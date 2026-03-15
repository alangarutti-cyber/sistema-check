
import React from 'react';
import { CheckCircle, AlertTriangle, Clock, AlertCircle, Camera, Plus, Calendar } from 'lucide-react';

const ActivityItem = ({ type, description, timestamp, user, unit, onClick }) => {
  const getIcon = () => {
    switch(type) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-success" />;
      case 'critical': return <AlertTriangle className="w-4 h-4 text-critical" />;
      case 'overdue': return <Clock className="w-4 h-4 text-warning" />;
      case 'action_created': return <AlertCircle className="w-4 h-4 text-error" />;
      case 'action_resolved': return <CheckCircle className="w-4 h-4 text-primary" />;
      case 'evidence': return <Camera className="w-4 h-4 text-muted-foreground" />;
      case 'template': return <Plus className="w-4 h-4 text-primary" />;
      case 'scheduled': return <Calendar className="w-4 h-4 text-secondary-foreground" />;
      default: return <CheckCircle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div 
      onClick={onClick}
      className="flex items-start gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer group"
    >
      <div className="mt-0.5 p-2 bg-background rounded-full border shadow-sm group-hover:scale-110 transition-transform">
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground leading-snug mb-1">
          {description}
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{timestamp}</span>
          <span>•</span>
          <span className="truncate">{user}</span>
          <span>•</span>
          <span className="truncate font-medium">{unit}</span>
        </div>
      </div>
    </div>
  );
};

export default ActivityItem;
