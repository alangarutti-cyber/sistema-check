
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const ChartContainer = ({ title, children, className }) => {
  return (
    <Card className={`border-border/50 shadow-sm ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

export default ChartContainer;
