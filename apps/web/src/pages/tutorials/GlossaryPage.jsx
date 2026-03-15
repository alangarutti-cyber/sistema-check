
import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout.jsx';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, BookA } from 'lucide-react';

const mockTerms = [
  { term: 'Ação Corretiva', def: 'Tarefa gerada para corrigir uma não conformidade identificada durante um checklist.', ex: 'Substituir extintor vencido.' },
  { term: 'Auditoria', def: 'Processo sistemático de verificação de conformidade em uma unidade.', ex: 'Auditoria mensal de qualidade.' },
  { term: 'Checklist', def: 'Lista de verificação composta por itens a serem avaliados.', ex: 'Checklist de Abertura de Loja.' },
  { term: 'Conformidade', def: 'Estado de estar de acordo com as regras, padrões ou leis estabelecidas.', ex: 'Unidade com 95% de conformidade.' },
  { term: 'Dashboard', def: 'Painel visual que apresenta indicadores e métricas de desempenho.', ex: 'Dashboard operacional da rede.' },
  { term: 'Evidência', def: 'Comprovação visual (foto) ou documental de uma resposta dada.', ex: 'Foto do piso limpo.' },
  { term: 'Item Crítico', def: 'Pergunta cuja não conformidade gera risco grave e alerta imediato.', ex: 'Temperatura da câmara fria.' },
  { term: 'Modelo (Template)', def: 'Estrutura base reutilizável para criar checklists.', ex: 'Modelo Padrão de Limpeza.' },
  { term: 'Não Conformidade', def: 'Falha no atendimento a um requisito ou padrão estabelecido.', ex: 'Produto fora da validade.' },
  { term: 'Observação', def: 'Texto descritivo adicionado para detalhar uma resposta.', ex: 'Equipamento apresenta ruído estranho.' },
  { term: 'Plano de Ação', def: 'Conjunto de ações corretivas organizadas para resolver um problema complexo.', ex: 'Plano de adequação sanitária.' },
  { term: 'Rascunho', def: 'Checklist em andamento que foi salvo localmente mas não finalizado.', ex: 'Salvar rascunho para continuar depois.' },
  { term: 'Setor', def: 'Subdivisão física ou lógica dentro de uma unidade.', ex: 'Cozinha, Salão, Estoque.' },
  { term: 'Sincronização', def: 'Processo de envio de dados offline para o servidor central.', ex: 'Sincronizando checklists pendentes.' },
  { term: 'Unidade', def: 'Local físico (loja, filial, fábrica) onde os checklists são executados.', ex: 'Unidade São Paulo Centro.' },
  { term: 'Usuário Administrador', def: 'Perfil com acesso total a configurações, modelos e relatórios.', ex: 'Gerente de Operações da Rede.' },
  { term: 'Usuário Operador', def: 'Perfil focado apenas na execução de checklists agendados.', ex: 'Líder de Turno.' },
  { term: 'Validação', def: 'Ato de confirmar que uma ação corretiva foi executada corretamente.', ex: 'Verificar foto do conserto.' },
  { term: 'Vencimento', def: 'Data limite estabelecida para conclusão de um checklist ou ação.', ex: 'Ação vence em 2 dias.' },
  { term: 'Visão Geral', def: 'Resumo consolidado dos principais indicadores da rede.', ex: 'Tela inicial do sistema.' },
];

const GlossaryPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTerms = mockTerms
    .filter(t => t.term.toLowerCase().includes(searchTerm.toLowerCase()) || t.def.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => a.term.localeCompare(b.term));

  // Group by first letter
  const groupedTerms = filteredTerms.reduce((acc, curr) => {
    const letter = curr.term.charAt(0).toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(curr);
    return acc;
  }, {});

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto space-y-8 pb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
              <BookA className="w-8 h-8 text-primary" /> Glossário
            </h1>
            <p className="text-muted-foreground">Dicionário de termos técnicos utilizados na plataforma CheckFlow.</p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar termo..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-card"
            />
          </div>
        </div>

        <div className="space-y-10">
          {Object.keys(groupedTerms).length > 0 ? (
            Object.keys(groupedTerms).map(letter => (
              <div key={letter} className="relative">
                <div className="sticky top-0 bg-background/95 backdrop-blur-sm py-2 z-10 mb-4 border-b">
                  <h2 className="text-2xl font-black text-primary">{letter}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {groupedTerms[letter].map((item, idx) => (
                    <Card key={idx} className="p-5 hover:shadow-md transition-shadow border-l-4 border-l-primary/50 hover:border-l-primary">
                      <h3 className="text-lg font-bold mb-2">{item.term}</h3>
                      <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{item.def}</p>
                      <div className="bg-muted/50 p-3 rounded-lg text-xs">
                        <span className="font-bold text-foreground block mb-1">Exemplo de uso:</span>
                        <span className="text-muted-foreground italic">"{item.ex}"</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-card rounded-2xl border border-dashed">
              <p className="text-muted-foreground">Nenhum termo encontrado.</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default GlossaryPage;
