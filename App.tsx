
import React, { useState, useMemo } from 'react';
import { CATEGORIES, DRUGS } from './constants';
import { Drug } from './types';
import DrugCalculator from './components/DrugCalculator';
import { Activity, HeartPulse, ChevronDown, ChevronUp, AlertCircle, Info } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('calc');
  
  // Accordion State
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [expandedDrugs, setExpandedDrugs] = useState<string[]>([]);
  
  // Selected variant for grouped drugs (Key: GroupName, Value: DrugId)
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  const toggleCategory = (catId: string) => {
    setExpandedCategories(prev => 
      prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
    );
  };

  const toggleDrug = (groupName: string) => {
    setExpandedDrugs(prev => 
      prev.includes(groupName) ? prev.filter(id => id !== groupName) : [...prev, groupName]
    );
  };

  const selectVariant = (groupName: string, drugId: string) => {
    setSelectedVariants(prev => ({ ...prev, [groupName]: drugId }));
  };

  // Helper to group drugs
  const getDrugsByCategory = (catId: string) => {
    return DRUGS.filter(d => d.category === catId);
  };

  const groupDrugsByName = (drugs: Drug[]) => {
    const groups: Record<string, Drug[]> = {};
    drugs.forEach(drug => {
      if (!groups[drug.groupName]) {
        groups[drug.groupName] = [];
      }
      groups[drug.groupName].push(drug);
    });
    return groups;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* HEADER */}
      <header className="bg-gradient-to-r from-blue-900 to-blue-700 text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartPulse className="h-8 w-8 text-red-400" />
            <span className="text-xl font-bold tracking-tight">SALVAMED</span>
          </div>
          
          <nav className="flex space-x-6">
            <button 
                onClick={() => setActiveTab('calc')}
                className={`text-sm font-medium transition-colors ${activeTab === 'calc' ? 'text-white border-b-2 border-white pb-1' : 'text-blue-200 hover:text-white'}`}
            >
              Cálculo
            </button>
            <button 
                onClick={() => setActiveTab('upcoming')}
                className={`text-sm font-medium transition-colors ${activeTab === 'upcoming' ? 'text-white border-b-2 border-white pb-1' : 'text-blue-200 hover:text-white'}`}
            >
              Ferramentas
            </button>
          </nav>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-6 w-full">
        {activeTab === 'calc' ? (
          <div className="space-y-4">
            
            {CATEGORIES.map(category => {
                const categoryDrugs = getDrugsByCategory(category.id);
                const groupedDrugs = groupDrugsByName(categoryDrugs);
                const isExpanded = expandedCategories.includes(category.id);

                return (
                  <div key={category.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    {/* LEVEL 1: CATEGORY HEADER */}
                    <button 
                      onClick={() => toggleCategory(category.id)}
                      className={`w-full flex items-center justify-between p-5 text-left transition-colors duration-200
                        ${isExpanded ? 'bg-slate-50' : 'bg-white hover:bg-slate-50'}
                      `}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-12 rounded-full ${category.color}`}></div>
                        <h2 className="text-lg font-bold text-slate-800">{category.name}</h2>
                      </div>
                      {isExpanded ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
                    </button>

                    {/* LEVEL 1 CONTENT: DRUGS LIST */}
                    {isExpanded && (
                      <div className="border-t border-slate-100 bg-slate-50/50">
                        {Object.keys(groupedDrugs).map((groupName) => {
                            const variants = groupedDrugs[groupName];
                            const isDrugExpanded = expandedDrugs.includes(groupName);
                            
                            // Determine currently selected drug in this group (default to first)
                            const selectedId = selectedVariants[groupName] || variants[0].id;
                            const activeDrug = variants.find(d => d.id === selectedId) || variants[0];
                            const hasVariants = variants.length > 1;

                            return (
                              <div key={groupName} className="border-b border-slate-100 last:border-0">
                                
                                {/* LEVEL 2: DRUG HEADER */}
                                <button
                                  onClick={() => toggleDrug(groupName)}
                                  className="w-full flex items-center justify-between p-4 pl-8 text-left hover:bg-white transition-colors"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${isDrugExpanded ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-500'}`}>
                                      <Activity className="w-5 h-5" />
                                    </div>
                                    <div>
                                      <span className="font-bold text-slate-700 block text-base">{groupName}</span>
                                      {!isDrugExpanded && (
                                        <span className="text-xs text-slate-400">
                                          {hasVariants ? `${variants.length} opções` : activeDrug.concentrationString}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className={`transform transition-transform duration-200 ${isDrugExpanded ? 'rotate-180' : ''}`}>
                                    <ChevronDown className="w-4 h-4 text-slate-400" />
                                  </div>
                                </button>

                                {/* LEVEL 2 CONTENT: CALCULATOR & DETAILS */}
                                {isDrugExpanded && (
                                  <div className="bg-white p-4 pl-4 sm:pl-8 border-t border-slate-100 animate-fadeIn">
                                    
                                    {/* VARIANT SELECTOR (If applicable) */}
                                    {hasVariants && (
                                      <div className="mb-6">
                                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                          Escolha a Diluição
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                          {variants.map(variant => (
                                            <button
                                              key={variant.id}
                                              onClick={() => selectVariant(groupName, variant.id)}
                                              className={`px-3 py-2 rounded-md text-sm font-medium border transition-all
                                                ${selectedId === variant.id
                                                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                                  : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:bg-blue-50'
                                                }
                                              `}
                                            >
                                              {variant.variantLabel || 'Padrão'}
                                            </button>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    {/* DRUG DETAILS CARD */}
                                    <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 mb-6">
                                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-slate-500 mb-1">Diluição</p>
                                                <p className="font-medium text-slate-800">{activeDrug.dilution}</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-500 mb-1">Concentração</p>
                                                <p className="font-medium text-slate-800">{activeDrug.concentrationString}</p>
                                            </div>
                                            <div className="md:col-span-2">
                                                <p className="text-slate-500 mb-1">Dose Recomendada</p>
                                                <p className="font-medium text-slate-800">{activeDrug.doseString}</p>
                                            </div>
                                       </div>
                                       {activeDrug.notes && (
                                          <div className="mt-4 pt-4 border-t border-slate-200 flex gap-2">
                                              <Info className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                                              <p className="text-slate-600 text-xs italic">{activeDrug.notes}</p>
                                          </div>
                                       )}
                                    </div>

                                    {/* CALCULATOR */}
                                    <DrugCalculator drug={activeDrug} />

                                  </div>
                                )}
                              </div>
                            );
                        })}
                        {Object.keys(groupedDrugs).length === 0 && (
                          <div className="p-8 text-center text-slate-400 text-sm">
                            Nenhuma droga encontrada nesta categoria.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
            })}

          </div>
        ) : (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 max-w-lg">
                    <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Em Desenvolvimento</h2>
                    <p className="text-slate-600 text-sm">Novas funcionalidades e ferramentas serão adicionadas em breve.</p>
                    <button 
                        onClick={() => setActiveTab('calc')}
                        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                        Voltar para Calculadora
                    </button>
                </div>
            </div>
        )}
      </main>

      <footer className="bg-slate-800 text-slate-400 py-6 mt-auto">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-sm font-semibold text-slate-300">SALVAMED &copy; {new Date().getFullYear()}</p>
          <p className="text-xs mt-3 leading-relaxed text-slate-500">
            Atenção: Este aplicativo é uma ferramenta de auxílio. A conferência dos cálculos e a decisão clínica são de responsabilidade exclusiva do médico. 
            Sempre verifique as doses e diluições conforme protocolo institucional.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
