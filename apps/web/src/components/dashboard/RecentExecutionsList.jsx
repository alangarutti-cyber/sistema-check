
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import StatusBadge from '@/components/badges/StatusBadge.jsx';
import { useNavigate } from 'react-router-dom';

const RecentExecutionsList = ({ executions }) => {
  const navigate = useNavigate();

  return (
    <div className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>Checklist</TableHead>
            <TableHead>Unit / Sector</TableHead>
            <TableHead>Executed By</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Conformity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {executions.map((exec) => (
            <TableRow 
              key={exec.id} 
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => navigate(`/history?id=${exec.id}`)}
            >
              <TableCell className="font-medium">{exec.checklistName}</TableCell>
              <TableCell>
                <div className="text-sm">{exec.unit}</div>
                <div className="text-xs text-muted-foreground">{exec.sector}</div>
              </TableCell>
              <TableCell>{exec.assignedTo}</TableCell>
              <TableCell>{new Date(exec.date).toLocaleDateString()}</TableCell>
              <TableCell><StatusBadge status={exec.status} /></TableCell>
              <TableCell className="text-right font-medium">
                {exec.status === 'completed' ? `${exec.conformity}%` : '-'}
              </TableCell>
            </TableRow>
          ))}
          {executions.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No recent executions found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default RecentExecutionsList;
