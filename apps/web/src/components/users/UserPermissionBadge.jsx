
import React from 'react';
import { Shield, UserCog, UserCheck, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const UserPermissionBadge = ({ role, className }) => {
  const getRoleConfig = (roleName) => {
    const normalizedRole = roleName?.toLowerCase() || 'operator';
    
    switch (normalizedRole) {
      case 'administrator':
      case 'admin':
        return {
          label: 'Administrador',
          icon: Shield,
          classes: 'bg-[hsl(var(--role-admin))]/10 text-[hsl(var(--role-admin))] border-[hsl(var(--role-admin))]/20'
        };
      case 'manager':
        return {
          label: 'Gerente',
          icon: UserCog,
          classes: 'bg-[hsl(var(--role-manager))]/10 text-[hsl(var(--role-manager))] border-[hsl(var(--role-manager))]/20'
        };
      case 'supervisor':
        return {
          label: 'Supervisor',
          icon: UserCheck,
          classes: 'bg-[hsl(var(--role-supervisor))]/10 text-[hsl(var(--role-supervisor))] border-[hsl(var(--role-supervisor))]/20'
        };
      case 'operator':
      default:
        return {
          label: 'Operador',
          icon: User,
          classes: 'bg-[hsl(var(--role-operator))]/10 text-[hsl(var(--role-operator))] border-[hsl(var(--role-operator))]/20'
        };
    }
  };

  const config = getRoleConfig(role);
  const Icon = config.icon;

  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border", config.classes, className)}>
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
};

export default UserPermissionBadge;
