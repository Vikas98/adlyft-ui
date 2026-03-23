import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function LineChart({ data, lines, height = 300 }) {
  const colors = ['#6366f1', '#10b981', '#3b82f6', '#f59e0b', '#ef4444'];
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Legend />
        {lines.map((line, i) => (
          <Line
            key={line.key}
            type="monotone"
            dataKey={line.key}
            name={line.label}
            stroke={line.color || colors[i % colors.length]}
            strokeWidth={2}
            dot={false}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}
