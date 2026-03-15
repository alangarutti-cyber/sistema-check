
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit2, Trash2, Users, UserCheck, UserCog, UserPlus, Layers } from 'lucide-react';
import { toast } from 'sonner';

const WhatsAppAlertsRecipients = ({ recipients, escalationGroups }) => {
  const [activeTab, setActiveTab] = useState('operadores');

  const safeRecipients = Array.isArray(recipients) ? recipients : [];
  const safeGroups = Array.isArray(escalationGroups) ? escalationGroups : [];

  const filterByType = (type) => safeRecipients.filter(r => r?.type === type);

  const RecipientTable = ({ data, typeName }) => (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>WhatsApp</TableHead>
            <TableHead>Unidade/Região</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((rec) => (
            <TableRow key={rec.id} className="hover:bg-muted/20 group">
              <TableCell className="font-bold text-sm">{rec.name}</TableCell>
              <TableCell className="font-mono text-sm">{rec.whatsappNumber}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{rec.unitId ? `Unidade ${rec.unitId}` : (rec.regionId || 'Geral')}</TableCell>
              <TableCell>
                <Badge variant={rec.isActive ? "default" : "secondary"} className={rec.isActive ? "bg-[hsl(var(--wa-success))]" : ""}>
                  {rec.isActive ? 'Ativo' : 'Inativo'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-8 w-8"><Edit2 className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {data.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                Nenhum {typeName.toLowerCase()} cadastrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Diretório de Contatos</h2>
          <p className="text-sm text-muted-foreground">Gerencie os destinatários e grupos de escalonamento para os alertas.</p>
        </div>
        <Button className="gap-2 shadow-sm">
          <Plus className="w-4 h-4" /> Adicionar Contato
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-6 h-auto p-1 bg-muted/50">
          <TabsTrigger value="operadores" className="py-2.5 text-xs sm:text-sm"><UserCheck className="w-4 h-4 mr-2 hidden sm:block"/> Operadores</TabsTrigger>
          <TabsTrigger value="gestores" className="py-2.5 text-xs sm:text-sm"><UserCog className="w-4 h-4 mr-2 hidden sm:block"/> Gestores</TabsTrigger>
          <TabsTrigger value="supervisores" className="py-2.5 text-xs sm:text-sm"><Users className="w-4 h-4 mr-2 hidden sm:block"/> Supervisores</TabsTrigger>
          <TabsTrigger value="extras" className="py-2.5 text-xs sm:text-sm"><UserPlus className="w-4 h-4 mr-2 hidden sm:block"/> Extras</TabsTrigger>
          <TabsTrigger value="escalonamento" className="py-2.5 text-xs sm:text-sm"><Layers className="w-4 h-4 mr-2 hidden sm:block"/> Grupos</TabsTrigger>
        </TabsList>

        <Card className="border-border/60 shadow-sm bg-card">
          <TabsContent value="operadores" className="m-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Operadores Responsáveis</CardTitle>
              <CardDescription>Recebem alertas diretos sobre checklists e ações sob sua responsabilidade.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <RecipientTable data={filterByType('Operador')} typeName="Operador" />
            </CardContent>
          </TabsContent>

          <TabsContent value="gestores" className="m-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Gestores de Unidade</CardTitle>
              <CardDescription>Recebem alertas escalonados ou resumos da unidade.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <RecipientTable data={filterByType('Gestor')} typeName="Gestor" />
            </CardContent>
          </TabsContent>

          <TabsContent value="supervisores" className="m-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Supervisores Regionais</CardTitle>
              <CardDescription>Recebem alertas críticos e escalonamentos de nível 2.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <RecipientTable data={filterByType('Supervisor')} typeName="Supervisor" />
            </CardContent>
          </TabsContent>

          <TabsContent value="extras" className="m-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Contatos Extras</CardTitle>
              <CardDescription>Contatos adicionais como manutenção terceirizada, diretoria, etc.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <RecipientTable data={filterByType('Extra')} typeName="Contato Extra" />
            </CardContent>
          </TabsContent>

          <TabsContent value="escalonamento" className="m-0">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Grupos de Escalonamento</CardTitle>
                <CardDescription>Defina a ordem de notificação quando um problema não é resolvido.</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="gap-2"><Plus className="w-4 h-4"/> Novo Grupo</Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead>Nome do Grupo</TableHead>
                      <TableHead>Membros (Ordem)</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {safeGroups.map((group) => (
                      <TableRow key={group.id} className="hover:bg-muted/20 group">
                        <TableCell className="font-bold text-sm">{group.name}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-2">
                            {(group.members || []).map((m, idx) => {
                              const rec = safeRecipients.find(r => r?.id === m.id);
                              return (
                                <Badge key={m.id} variant="secondary" className="text-xs font-medium">
                                  {idx + 1}º {rec?.name || 'Desconhecido'}
                                </Badge>
                              );
                            })}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={group.isActive ? "default" : "secondary"} className={group.isActive ? "bg-[hsl(var(--wa-success))]" : ""}>
                            {group.isActive ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-8 w-8"><Edit2 className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10"><Trash2 className="w-4 h-4" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </TabsContent>
        </Card>
      </Tabs>
    </div>
  );
};

export default WhatsAppAlertsRecipients;
