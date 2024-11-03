// TrendChart.js
import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', new: 4000, renewals: 2400, churn: 200 },
  { month: 'Feb', new: 3000, renewals: 1398, churn: 221 },
  { month: 'Mar', new: 2000, renewals: 9800, churn: 2290 },
  { month: 'Apr', new: 2780, renewals: 3908, churn: 2000 },
  { month: 'May', new: 1890, renewals: 4800, churn: 2181 },
  { month: 'Jun', new: 2390, renewals: 3800, churn: 2500 },
  { month: 'Jul', new: 3490, renewals: 4300, churn: 2100 },
];

function AttendanceChart() {
  return (
    <Card className="attendance-chart">
      <CardContent>
        <Typography variant="subtitle1">Semester Graph</Typography>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="new" fill="#8884d8" />
            <Bar dataKey="renewals" fill="#82ca9d" />
            <Bar dataKey="churn" fill="#ff7300" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default AttendanceChart;
