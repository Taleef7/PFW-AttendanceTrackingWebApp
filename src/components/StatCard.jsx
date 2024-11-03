// StatCard.js
import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

function StatCard({ title, value, backgroundColor }) {
  return (
    <Card className="stat-card" style={{ backgroundColor: backgroundColor || '#fff' }}>
      <CardContent>
        <Typography variant="subtitle1" className="stat-card__title">{title}</Typography>
        <Typography variant="h5" className="stat-card__value">{value}</Typography>
      </CardContent>
    </Card>
  );
}

export default StatCard;
