
import React, { useState } from 'react';
import { CATEGORIES, DRUGS } from './constants';
import { Drug } from './types';
import DrugCalculator from './components/DrugCalculator';
import SodiumCalculator from './components/SodiumCalculator';
import PotassiumCalculator from './components/PotassiumCalculator';
import { 
  Activity, 
  HeartPulse, 
  ChevronDown, 
  ChevronUp, 
  Info, 
  Beaker, 
  ArrowLeft, 
  Droplet, 
  Syringe, 
  Home, 
  Stethoscope,
  Wind,
  Zap
} from 'lucide-react';

type ViewState = 'home' | 'drugs' | 'electrolytes' | 'sodium' | 'potassium';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  
  // Accordion State for Drugs
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [expandedDrugs, setExpandedDrugs] = useState<string[]>([]);
  
  // Selected variant for grouped drugs (Key: GroupName, Value: DrugId)
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  // --- HELPERS ---

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

  // --- RENDERERS ---

  const renderHeader = () => (
    <header className="bg-gradient-to-r from-blue-900 to-blue-700 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('home')}>
          <HeartPulse className="h-8 w-8 text-red-400" />
          <span className="text-xl font-bold tracking-tight">SALVAMED</span>
        </div>
        
        {currentView !== 'home' && (
          <button 
            onClick={() => setCurrentView('home')}
            className="p-2 rounded-full hover:bg-white/10 transition-colors flex items-center gap-1 text-sm font-medium"
          >
            <Home className="w-5 h-5" />
            <span className="hidden sm:inline">Início</span>
          </button>
        )}
      </div>
    </header>
  );

  const renderHomePage = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Bem-vindo ao Salvamed</h1>
        <p className="text-slate-500 max-w-md mx-auto">
          Ferramentas rápidas e precisas para auxiliar sua prática em urgência e terapia intensiva.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Calculator */}
        <button 
          onClick={() => setCurrentView('drugs')}
          className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-400 hover:-translate-y-1 transition-all group text-left"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
            <Syringe className="w-6 h-6 text-blue-600 group-hover:text-white" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Calculadora de Drogas</h2>
          <p className="text-sm text-slate-500">
            Cálculo de vasopressores, inotrópicos, sedação e sequências de intubação.
          </p>
        </button>

        {/* Card 2: Electrolytes */}
        <button 
          onClick={() => setCurrentView('electrolytes')}
          className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-teal-400 hover:-translate-y-1 transition-all group text-left"
        >
          <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-teal-600 transition-colors">
            <Droplet className="w-6 h-6 text-teal-600 group-hover:text-white" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Distúrbios Hidroeletrolíticos</h2>
          <p className="text-sm text-slate-500">
            Correção de Sódio, Potássio e ferramentas para manejo metabólico.
          </p>
        </button>

        {/* Card 3: Placeholders */}
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 border-dashed opacity-75">
          <div className="w-12 h-12 bg-slate-200 rounded-lg flex items-center justify-center mb-4">
            <Activity className="w-6 h-6 text-slate-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-400 mb-2">Scores e Escalas</h2>
          <p className="text-sm text-slate-400">
            Glasgow, SOFA, APACHE II (Em breve).
          </p>
        </div>

        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 border-dashed opacity-75">
          <div className="w-12 h-12 bg-slate-200 rounded-lg flex items-center justify-center mb-4">
            <Wind className="w-6 h-6 text-slate-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-400 mb-2">Ventilação Mecânica</h2>
          <p className="text-sm text-slate-400">
            Ajustes iniciais e tabelas de PEEP/FiO2 (Em breve).
          </p>
        </div>
      </div>
    </div>
  );

  const renderDrugCalculator = () => (
    <div className="space-y-4 animate-fadeIn">
      <div className="mb-6 flex items-center justify-between">
         <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Syringe className="w-6 h-6 text-blue-500" />
              Calculadora de Drogas
            </h2>
            <p className="text-slate-500 text-sm">Selecione a categoria e a droga desejada.</p>
         </div>
      </div>

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
  );

  const renderElectrolytesMenu = () => (
    <div className="animate-fadeIn">
      <button 
        onClick={() => setCurrentView('home')}
        className="mb-4 flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Voltar para Início
      </button>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Beaker className="w-6 h-6 text-teal-600" />
            Distúrbios Hidroeletrolíticos
        </h2>
        <p className="text-slate-500 text-sm">Selecione o eletrólito para cálculo.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
         {/* Sodium */}
         <button 
            onClick={() => setCurrentView('sodium')}
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-teal-400 transition-all flex items-center justify-between group"
         >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-lg">
                Na+
              </div>
              <div className="text-left">
                <h3 className="font-bold text-slate-800 group-hover:text-teal-700 transition-colors">Sódio</h3>
                <p className="text-xs text-slate-500">Hiponatremia e Hipernatremia</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-teal-50">
               <ChevronDown className="w-5 h-5 text-slate-400 transform -rotate-90 group-hover:text-teal-600" />
            </div>
         </button>
         
         {/* Potassium - Now Active */}
         <button 
            onClick={() => setCurrentView('potassium')}
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-purple-400 transition-all flex items-center justify-between group"
         >
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-lg">
                    K+
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-slate-800 group-hover:text-purple-700 transition-colors">Potássio</h3>
                  <p className="text-xs text-slate-500">Hipocalemia e Hipercalemia</p>
                </div>
             </div>
             <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-purple-50">
               <ChevronDown className="w-5 h-5 text-slate-400 transform -rotate-90 group-hover:text-purple-600" />
             </div>
         </button>
      </div>
    </div>
  );

  const renderSodiumCalculator = () => (
    <div className="animate-fadeIn">
      <button 
        onClick={() => setCurrentView('electrolytes')}
        className="mb-4 flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Voltar para Hidroeletrolíticos
      </button>
      
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Droplet className="w-6 h-6 text-teal-500" />
          Distúrbios do Sódio
        </h2>
        <p className="text-slate-500 text-sm">Calculadoras para correção e reposição.</p>
      </div>

      <SodiumCalculator />
    </div>
  );

  const renderPotassiumCalculator = () => (
    <div className="animate-fadeIn">
      <button 
        onClick={() => setCurrentView('electrolytes')}
        className="mb-4 flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Voltar para Hidroeletrolíticos
      </button>
      
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Zap className="w-6 h-6 text-purple-500" />
          Distúrbios do Potássio
        </h2>
        <p className="text-slate-500 text-sm">Correção e manejo da Hipocalemia e Hipercalemia.</p>
      </div>

      <PotassiumCalculator />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {renderHeader()}

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-6 w-full">
        {currentView === 'home' && renderHomePage()}
        {currentView === 'drugs' && renderDrugCalculator()}
        {currentView === 'electrolytes' && renderElectrolytesMenu()}
        {currentView === 'sodium' && renderSodiumCalculator()}
        {currentView === 'potassium' && renderPotassiumCalculator()}
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
