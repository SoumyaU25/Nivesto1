import { inngest } from "./client";
import { db } from "../prisma";
import { sendEmail } from "@/actions/send-email";
import MyEmail from "@/emails/template";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const checkBudget = inngest.createFunction(
  { name: "Check Budget Alerts" },
  { cron: "0 */6 * * *" },
  async ({ step }) => {
    const budgets = await step.run("fetch-budget", async () => {
      return await db.budget.findMany({
        include: {
          user: {
            include: {
              accounts: {
                where: {
                  isDefault: true,
                },
              },
            },
          },
        },
      });
    });
    for (const budget of budgets) {
      const defaultAccount = budget.user.accounts[0];
      if (!defaultAccount) continue;
      console.log(budget.user.email);
      

      await step.run(`check-budget-${budget.id}`, async () => {
        const startDate = new Date();
        startDate.setDate(1);

        const expenses = await db.transaction.aggregate({
          where: {
            userId: budget.userId,
            accountId: defaultAccount.id,
            type: "EXPENSE",
            date: {
              gte: startDate,
            },
          },
          _sum: {
            amount: true,
          },
        });
        const totalExpenses = expenses._sum.amount?.toNumber() || 0;
        const budgetAmount = budget.amount;
        const percentageUsed = (totalExpenses / budgetAmount) * 100;

        if (
          percentageUsed >= 80 &&
          (!budget.lastAlertSent ||
            isNewMonth(new Date(budget.lastAlertSent), new Date()))
        ) {
          //send email
          try{
            await sendEmail({
            to: budget.user.email,
            subject: `Budget Alert for ${defaultAccount.name}`,
            react: MyEmail({
              userName: budget.user.name,
              type: "budget-alert",
              data: {
                percentageUsed,
                budgetAmount,
                totalExpenses,
                accountName: defaultAccount.name,
              },
            }),
          });

          //update lastAlertSent
          await db.budget.update({
            where: { id: budget.id },
            data: { lastAlertSent: new Date() },
          });

          }
          catch (error){
            console.error(`Failed to send email to ${budget.user.email}:`, error);

          }

          
        }
      });
    }
  }
);

function isNewMonth(lastAlertDate, currDate) {
  return (
    lastAlertDate.getMonth() !== currDate.getMonth() ||
    lastAlertDate.getFullYear() !== currDate.getFullYear()
  );
}

// export const generateMonthlyReports = inngest.createFunction(
//   {
//     id: "generate-monthly-reports",
//     name: "Generate Monthly Reports",
//   },
//   { cron: "0 0 1 * *" },
//   async ({ step }) => {
//     const users = await step.run("fetch-users", async () => {
//       return await db.user.findMany({
//         include: {
//           accounts: true,
//         },
//       });
//     });
//     for (const user of users) {
//       await step.run(`generate-report-${user.id}`, async () => {
//         const lastMonth = new Date();
//         lastMonth.setMonth(lastMonth.getMonth() - 1);
//         const stats = await getMonthlyStats(user.id, lastMonth);
//         const monthName = lastMonth.toLocaleString("default", {
//           month: "long",
//         });
//         const insights = await generateFinInsights(stats, monthName);

//         await sendEmail({
//           to: user.email,
//           subject: `Your Monthly Financial Report- ${monthName}`,
//           react: MyEmail({
//             userName: user.name,
//             type: "monthly-report",
//             data: {
//               stats,
//               month: monthName,
//               insights,
//             },
//           }),
//         });
//       });
//     }
//     return { processed: users.length };
//   }
// );

export const generateMonthlyReports = inngest.createFunction(
  {
    id: "generate-monthly-reports",
    name: "Generate Monthly Reports",
  },
  { cron: "0 0 1 * *" }, // Runs on the 1st of every month
  async ({ step }) => {
    const users = await step.run("fetch-users", async () => {
      return await db.user.findMany();
    });

    for (const user of users) {
      await step.run(`generate-report-${user.id}`, async () => {
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);

        const stats = await getMonthlyStats(user.id, lastMonth);

        const monthName = lastMonth.toLocaleString("default", {
          month: "long",
        });
        const monthYear = `${lastMonth.getFullYear()}-${String(
          lastMonth.getMonth() + 1
        ).padStart(2, "0")}`; // e.g., "2025-07"

        const aiInsights = await generateFinInsights(stats, monthName);

        // Save to MonthlyReport table
        await db.monthlyReport.upsert({
          where: {
            userId_reportMonth: {
              userId: user.id,
              reportMonth: monthYear,
            },
          },
          update: {
            insights: {
              stats,
              aiInsights,
            },
          },
          create: {
            userId: user.id,
            reportMonth: monthYear,
            insights: {
              stats,
              aiInsights,
            },
          },
        });
      });
    }

    return { processed: users.length };
  }
);


async function generateFinInsights(stats, month) {
  const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAi.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    Analyze this financial data and provide 3 concise, actionable insights.
    Focus on spending patterns and practical advice.
    Keep it friendly and conversational.

    Financial Data for ${month}:
    - Total Income: $${stats.totalIncome}
    - Total Expenses: $${stats.totalExpenses}
    - Net Income: $${stats.totalIncome - stats.totalExpenses}
    - Expense Categories: ${Object.entries(stats.byCategory)
      .map(([category, amount]) => `${category}: $${amount}`)
      .join(", ")}

    Format the response as a JSON array of strings, like this:
    ["insight 1", "insight 2", "insight 3"]
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error generating insights:", error);
    return [
      "Your highest expense category this month might need attention.",
      "Consider setting up a budget for better financial management.",
      "Track your recurring expenses to identify potential savings.",
    ];
  }
}

const getMonthlyStats = async (userId, month) => {
  const startDate = new Date(month.getFullYear(), month.getMonth(), 1);
  const endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);

  const transactions = await db.transaction.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  return transactions.reduce(
    (stats, t) => {
      const amount = t.amount.toNumber();
      if (t.type === "EXPENSE") {
        stats.totalExpenses += amount;
        stats.byCategory[t.category] =
          (stats.byCategory[t.category] || 0) + amount;
      } else {
        stats.totalIncome += amount;
      }
      return stats;
    },
    {
      totalExpenses: 0,
      totalIncome: 0,
      byCategory: {},
      transactionCount: transactions.length,
    }
  );
};

// export const triggerrecurringTransactions = inngest.createFunction(
//   {
//     id: "trigger-recurring-transactions",
//     name: "Trigger Recurring Transactions",
//   },
//   { cron: "0 0 * * *"},
//   async ({step}) =>{
//     //Fetch all due recurring transactions
//     const recurringTransactions = await step.run(
//       "fetch-recurring-transactions",
//       async ()=>{
//         return await db.transaction.findMany({
//           where:{
//             isRecurring: true,
//             status: "COMPLETED",
//             OR: [
//               {lastProcessed: null}, //Never Processed
//               {nextRecurringDate: {lte: new Date()}}, //Due date passed
//             ],
//           },
//         })
//       }
//     )
//     //create events for each transaction
//     if(recurringTransactions.length > 0){
//       const events = recurringTransactions.map((transaction)=>({
//         name: "transaction.recurring.process",
//         data: {transactionId: transaction.id, userId: transaction.userId}
//       }))

//       await inngest.send(events)
//     }

//     return {triggered: recurringTransactions.length};
//   }

// )

// export const processRecurringTransaction = inngest.createFunction({
//   id: "process-recurring-transaction",
//   throttle:{
//     limit: 10,   //only process 10 transactions
//     period: "1m", //per minute
//     key: "event.data.userId", //per user
//   },
// },
// {
//   event: "transaction.recurring.process"
// },
//  async({event, step})=>{

//  }

// )
