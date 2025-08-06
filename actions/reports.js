"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getMonthlyReports() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    const reports = await db.monthlyReport.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        reportMonth: "desc",
      },
    });

    // Convert Decimal values to numbers (for totalIncome/Expenses, etc.)
    return reports.map((r) => ({
      ...r,
      insights: {
        ...r.insights,
        totalIncome: Number(r.insights.totalIncome),
        totalExpenses: Number(r.insights.totalExpenses),
        byCategory: r.insights.byCategory,
        aiInsights: r.insights.aiInsights,
      },
    }));
  } catch (error) {
    console.error("Error fetching monthly reports:", error);
    throw error;
  }
}

export async function getSingleReport(id) {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) return null;

  const report = await db.monthlyReport.findUnique({
    where: {
      id,
      userId: user.id,
    },
  });

  return report;
}
