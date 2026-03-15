
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter, X } from 'lucide-react';

const FilterPanel = ({ onSearch, onFilterChange, filters }) => {
  return (
    <div className="bg-card p-4 rounded-xl border border-border/50 shadow-sm mb-6 flex flex-col sm:flex-row gap-4 items-center">
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Search..." 
          className="pl-9 w-full text-foreground"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <div className="flex gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
        <Select onValueChange={(val) => onFilterChange('status', val)}>
          <SelectTrigger className="w-[140px] shrink-0">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={(val) => onFilterChange('unit', val)}>
          <SelectTrigger className="w-[140px] shrink-0">
            <SelectValue placeholder="Unit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Units</SelectItem>
            <SelectItem value="Headquarters">Headquarters</SelectItem>
            <SelectItem value="Factory A">Factory A</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="shrink-0 gap-2">
          <Filter className="w-4 h-4" /> More Filters
        </Button>
      </div>
    </div>
  );
};

export default FilterPanel;
