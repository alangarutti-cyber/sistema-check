
import React from 'react';
import MainLayout from '@/components/MainLayout.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Plus, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CreateChecklistPage = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto pb-20">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Models
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Create Checklist Model</h1>
          <p className="text-muted-foreground">Define a new standard operating procedure.</p>
        </div>

        <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border/50 shadow-sm space-y-6 mb-8">
          <div className="space-y-2">
            <Label>Template Name</Label>
            <Input placeholder="e.g., Daily Store Opening" className="text-lg font-medium" />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea placeholder="Brief description of this checklist's purpose..." className="resize-none" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Target Unit</Label>
              <Input placeholder="Select Unit" />
            </div>
            <div className="space-y-2">
              <Label>Frequency</Label>
              <Input placeholder="e.g., Daily" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Checklist Items</h2>
            <Button variant="outline" size="sm" className="gap-2">
              <Plus className="w-4 h-4" /> Add Item
            </Button>
          </div>
          
          <div className="p-8 text-center bg-muted/30 rounded-xl border border-dashed">
            <p className="text-muted-foreground mb-4">No items added yet.</p>
            <Button className="gap-2">
              <Plus className="w-4 h-4" /> Add First Item
            </Button>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
          <Button className="gap-2"><Save className="w-4 h-4" /> Save Template</Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default CreateChecklistPage;
