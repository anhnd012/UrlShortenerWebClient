import React from 'react';
import type { DailyClick } from '../types/analytics.types';
import { formatReadableDate } from '../../../lib/date-time';

interface DailyClicksTableProps {
  dailyClicks: DailyClick[];
  totalClicks: number;
}

export const DailyClicksTable: React.FC<DailyClicksTableProps> = ({
  dailyClicks,
  totalClicks,
}) => {
  const sortedClicks = [...dailyClicks].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="rounded-card border border-border bg-surface shadow-subtle overflow-hidden">
      <div className="border-b border-border px-5 py-4">
        <h3 className="text-sm font-semibold text-text-primary">
          Clicks Breakdowns
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-surface-muted text-xs font-semibold text-text-secondary uppercase tracking-wider">
              <th className="px-5 py-3 font-semibold">Date</th>
              <th className="px-5 py-3 font-semibold text-right">Clicks</th>
              <th className="px-5 py-3 font-semibold text-right">Percentage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-sm text-text-primary">
            {sortedClicks.map((row) => {
              const percentage = totalClicks > 0 
                ? ((row.clicks / totalClicks) * 100).toFixed(1) 
                : '0.0';
              
              return (
                <tr key={row.date} className="hover:bg-surface-muted transition-colors">
                  <td className="px-5 py-3.5 font-medium">
                    {formatReadableDate(row.date).split(',')[0]}
                  </td>
                  <td className="px-5 py-3.5 text-right font-semibold">
                    {row.clicks}
                  </td>
                  <td className="px-5 py-3.5 text-right text-text-secondary">
                    <div className="flex items-center justify-end gap-2">
                      <span className="font-mono text-xs">{percentage}%</span>
                      <div className="hidden sm:block w-16 bg-surface-muted rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-primary h-full rounded-full" 
                          style={{ width: `${Math.min(parseFloat(percentage), 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
