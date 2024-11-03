// SalesPieChart.js
import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Basic Plan', value: 100 },
  { name: 'Pro Plan', value: 300 },
  { name: 'Advanced Plan', value: 200 },
  { name: 'Enterprise Plan', value: 150 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function AttendancePieChart() {
  return (
    <Card className="attendance-pie-chart">
      <CardContent>
        <Typography variant="subtitle1">Sales</Typography>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default AttendancePieChart;
