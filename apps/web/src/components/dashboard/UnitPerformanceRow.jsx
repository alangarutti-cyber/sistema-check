
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const UnitPerformanceRow = ({ position, unit, compliance, completed, overdue, critical, openActions, expiredActions, onClick }) => {
  const getColorClass = (val) => {
    if (val >= 90) return 'bg-success text-success-foreground';
    if (val >= 70) return 'bg-warning text-warning-foreground';
    if (val >= 50) return 'bg-orange-500 text-white';
    return 'bg-critical text-critical-foreground';
  };

  const getBadge = (val) => {
    if (val >= 95) return <Badge className="bg-success hover:bg-success">Excelente</Badge>;
    if (val >= 85) return <Badge className="bg-primary hover:bg-primary">Bom</Badge>;
    if (val >= 70) return <Badge className="bg-warning hover:bg-warning">Aceitável</Badge>;
    return <Badge className="bg-critical hover:bg-critical">Crítico</Badge>;
  };

  return (
    <TableRow onClick={onClick} className="cursor-pointer hover:bg-muted/50 transition-colors">
      <TableCell className="font-medium text-muted-foreground">{position}º</TableCell>
      <TableCell className="font-bold">{unit}</TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <span className="font-bold w-12">{compliance}%</span>
          <div className="h-2 w-24 bg-muted rounded-full overflow-hidden hidden sm:block">
            <div className={`h-full ${getColorClass(compliance)}`} style={{ width: `${compliance}%` }} />
          </div>
        </div>
      </TableCell>
      <TableCell>{getBadge(compliance)}</TableCell>
      <TableCell className="text-center">{completed}</TableCell>
      <TableCell className="text-center text-warning font-medium">{overdue > 0 ? overdue : '-'}</TableCell>
      <TableCell className="text-center text-critical font-bold">{critical > 0 ? critical : '-'}</TableCell>
      <TableCell className="text-center">{openActions}</TableCell>
      <TableCell className="text-center text-error font-bold">{expiredActions > 0 ? expiredActions : '-'}</TableCell>
    </TableRow>
  );
};

export default UnitPerformanceRow;
