import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function PerformanceChart({ data = [] }) {
  const chartData = data.slice(-14).map((d) => ({
    ...d,
    date: d.date?.slice(5) || d.date,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#9ca3af' }} />
        <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="impressions" stroke="#6366f1" strokeWidth={2} dot={false} name="Impressions" />
        <Line type="monotone" dataKey="clicks" stroke="#06b6d4" strokeWidth={2} dot={false} name="Clicks" />
      </LineChart>
    </ResponsiveContainer>
  );
}
