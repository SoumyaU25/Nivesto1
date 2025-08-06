// app/reports/[id]/page.jsx
import { getSingleReport } from "@/actions/reports";
import { notFound } from "next/navigation";
import Link from "next/link";

async function ReportDetails({ params }) {
  const report = await getSingleReport(params.id);

  if (!report) return notFound();

  const insights = report.insights || {};
  const stats = insights.stats || {};
  const byCategory = stats.byCategory || {};
  const aiInsights = insights.aiInsights || [];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-300">
        {report.reportMonth} Report
      </h1>

      <p className="text-gray-400">Total Income: ${stats.totalIncome ?? 0}</p>
      <p className="text-gray-400">
        Total Expenses: ${stats.totalExpenses ?? 0}
      </p>

      <div className="mt-4">
        <h2 className="font-medium text-gray-300">By Category</h2>
        <ul className="list-disc pl-5 text-sm text-gray-300">
          {Object.entries(byCategory).map(([cat, amt]) => (
            <li key={cat}>
              {cat}: ${amt}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <h2 className="font-medium text-gray-300">AI Insights</h2>
        <ul className="list-disc pl-5 text-sm text-gray-400">
          {aiInsights.map((insight, idx) => (
            <li key={idx}>{insight}</li>
          ))}
        </ul>
      </div>
      <Link href="/reports" className="text-sm underline text-green-600">
        ← Back to All Reports
      </Link>
    </div>
  );
}
export default ReportDetails
