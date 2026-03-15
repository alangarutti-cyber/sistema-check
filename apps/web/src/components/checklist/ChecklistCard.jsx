
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import StatusBadge from '@/components/badges/StatusBadge.jsx';
import ProgressBar from '@/components/badges/ProgressBar.jsx';
import { Calendar, MapPin, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ChecklistCard = ({ checklist }) => {
  const navigate = useNavigate();

  return (
    <Card 
      className="overflow-hidden border-border/50 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full"
      onClick={() => navigate(`/execute/${checklist.id}`)}
    >
      <CardContent className="p-5 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4 gap-4">
          <h3 className="font-semibold text-lg leading-tight text-balance">{checklist.checklistName}</h3>
          <StatusBadge status={checklist.status} className="shrink-0" />
        </div>
        
        <div className="space-y-2.5 mb-6 flex-1">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 mr-2 shrink-0" />
            <span className="truncate">{checklist.unit} • {checklist.sector}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-2 shrink-0" />
            <span>Due: {new Date(checklist.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <User className="w-4 h-4 mr-2 shrink-0" />
            <span className="truncate">{checklist.assignedTo}</span>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-border/50">
          {checklist.status === 'in_progress' ? (
            <ProgressBar percentage={checklist.conformity || 50} label="Progress" color="bg-yellow-500" />
          ) : checklist.status === 'completed' ? (
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">Conformity</span>
              <span className="text-sm font-bold text-green-600">{checklist.conformity}%</span>
            </div>
          ) : (
            <div className="text-sm font-medium text-primary hover:underline">
              Start Execution &rarr;
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChecklistCard;
