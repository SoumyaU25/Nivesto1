
"use client";

import useFetch from "@/hooks/use-fetch";
import { useEffect } from "react";
import { getMonthlyReports } from "@/actions/reports";
import Link from "next/link";

function ReportsPage() {
  const {
    data: reports,
    loading,
    error,
    fn: fetchReports,
  } = useFetch(getMonthlyReports);

  useEffect(() => {
    fetchReports();
  }, []);

  if (loading) return <p className="p-4">Loading reports...</p>;
  if (error) return <p className="p-4 text-red-500">Failed to load reports.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Monthly Reports</h1>

      {!reports || reports.length === 0 ? (
        <p>No reports found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((report) => {
            const insights = report.insights || {};
            const stats = insights.stats || {};

            return (
              <Link
                href={`/reports/${report.id}`}
                key={report.id}
                className="border rounded-xl p-4 shadow-sm bg-black hover:shadow-lg transition duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-semibold text-gray-300">
                    {report.reportMonth}
                  </h2>
                  <h2 className="text-xl font-semibold text-gray-300">
                    Monthly Report
                  </h2>
                </div>

                <p className="text-gray-400">
                  Income: ${stats.totalIncome ?? 0}
                </p>
                <p className="text-gray-400">
                  Expenses: ${stats.totalExpenses ?? 0}
                </p>
                <p className="text-sm text-green-600 mt-2 underline">
                  View full report →
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ReportsPage
