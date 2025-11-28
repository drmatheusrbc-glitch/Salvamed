
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Activity, AlertTriangle, Droplet, Info, Calculator, Zap, Syringe, Clock } from 'lucide-react';

const SodiumCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'hypo' | 'hyper'>('hypo');
  // Sub-mode for Hyponatremia: 'gradual' (Calculator) or 'acute' (Emergency Protocol)
  const [hypoMode, setHypoMode] = useState<'gradual' | 'acute'>('gradual');

  // --- SHARED STATE ---
  const [weight, setWeight] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [sex, setSex] = useState<'male' | 'female'>('male');
  const [currentNa, setCurrentNa] = useState<string>('');
  const [targetNa, setTargetNa] = useState<string>('');
  
  // Solution key (different options based on tab)
  const [solution, setSolution] = useState<string>('sf09'); 

  const [result, setResult] = useState<{
    tbw: number;
    deltaNaL: number; // Change per Liter
    volNeeded: number; // Liters
    rate: number; // mL/h
    alert: string | null;
  } | null>(null);

  // --- CONSTANTS ---
  
  // Solutions for Hypernatremia (Lowering Na)
  const HYPER_SOLUTIONS: Record<string, { label: string; na: number }> = {
    'sg5': { label: 'Soro Glicosado 5% (0 mEq)', na: 0 },
    'nacl045': { label: 'NaCl 0,45% (77 mEq)', na: 77 },
    'sf09': { label: 'Soro Fisiológico 0,9% (154 mEq)', na: 154 },
  };

  // Solutions for Hyponatremia (Raising Na)
  const HYPO_SOLUTIONS: Record<string, { label: string; na: number }> = {
    'sf09': { label: 'Soro Fisiológico 0,9% (154 mEq)', na: 154 },
    'nacl3': { label: 'NaCl 3% (513 mEq)', na: 513 },
  };

  const NACL045_RECIPES = [
    "250 ML SF 0,9% + 250 ML Água Destilada",
    "10 ML NaCl 20% + 490 ML Água Destilada",
    "500 ML SF 0,9% + 500 ML Água Destilada",
    "22 ML NaCl 20% + 978 ML Água Destilada"
  ];

  const NACL3_RECIPES = [
    "890ML SF 0,9% + 110ML NaCl 20%",
    "850ML Água Destilada + 150ML NaCl 20%",
    "445ML SF 0,9% + 55ML NaCl 20% (Solução de 500ml)"
  ];

  // --- EFFECTS ---

  // Reset/Default solution when tab changes
  useEffect(() => {
    if (activeTab === 'hypo') {
      setSolution('sf09');
      setHypoMode('gradual'); // Reset sub-mode
    } else {
      setSolution('sg5');
    }
    setResult(null);
  }, [activeTab]);

  // Calculate when inputs change
  useEffect(() => {
    calculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weight, age, sex, currentNa, targetNa, solution, activeTab, hypoMode]);

  const calculate = () => {
    if (activeTab === 'hypo' && hypoMode === 'acute') {
        // No calculation needed for acute mode protocol view
        return;
    }

    const w = parseFloat(weight);
    const a = parseFloat(age);
    const naCurr = parseFloat(currentNa);
    const naTarg = parseFloat(targetNa);
    
    if (!w || !a || !naCurr || !naTarg) {
      setResult(null);
      return;
    }

    // 1. Calculate TBW (Total Body Water)
    let tbwFactor = 0.6;
    if (sex === 'male') {
      tbwFactor = a > 60 ? 0.5 : 0.6; 
    } else {
      tbwFactor = a > 60 ? 0.45 : 0.5;
    }
    const tbw = w * tbwFactor;

    // 2. Alert Check & Logic Selection
    let alertMsg = null;
    let solutionsMap = activeTab === 'hypo' ? HYPO_SOLUTIONS : HYPER_SOLUTIONS;
    
    // Fallback if solution key is invalid for current tab (during transition)
    if (!solutionsMap[solution]) return;

    const diff = Math.abs(naTarg - naCurr);
    
    // Safety Alert Rule
    if (diff > 8) {
       alertMsg = "Alerta: variação máxima de 6-8 meq/dia";
    }

    // 3. Adrogué-Madias Formula
    // DeltaNa = (Na_infusate - Na_serum) / (TBW + 1)
    const naSol = solutionsMap[solution].na;
    const deltaNaPerLiter = (naSol - naCurr) / (tbw + 1);

    // 4. Volume Needed
    // Volume = (Target - Current) / DeltaNa_per_Liter
    let volNeeded = 0;
    
    if (deltaNaPerLiter !== 0) {
        volNeeded = (naTarg - naCurr) / deltaNaPerLiter;
    }
    
    // 5. Rate (mL/h in 24h)
    // Vol is in Liters. 
    const rate = (volNeeded * 1000) / 24;

    setResult({
      tbw,
      deltaNaL: deltaNaPerLiter,
      volNeeded,
      rate,
      alert: alertMsg
    });
  };

  const currentSolutions = activeTab === 'hypo' ? HYPO_SOLUTIONS : HYPER_SOLUTIONS;

  const renderAcuteHypoProtocol = () => (
    <div className="space-y-6 animate-fadeIn">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h4 className="text-red-800 font-bold text-lg mb-4 flex items-center gap-2">
                <Zap className="w-6 h-6 text-red-600" />
                Protocolo de Emergência
            </h4>
            
            <div className="bg-white p-4 rounded-lg border border-red-100 shadow-sm mb-4">
                <div className="flex items-start gap-4">
                    <div className="bg-red-100 p-2 rounded-full">
                         <Syringe className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                        <h5 className="font-bold text-slate-800 text-lg">Bolus de Salina 3%</h5>
                        <p className="text-slate-600 font-medium">Administrar 100 mL EV.</p>
                    </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-sm text-red-700 bg-red-50 p-2 rounded">
                    <Clock className="w-4 h-4" />
                    Tempo de infusão: <span className="font-bold">10 minutos</span>
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-start gap-3 text-slate-700 text-sm">
                    <div className="min-w-[20px] font-bold text-red-500">•</div>
                    <p>Pode-se repetir a dose até <span className="font-bold">3 vezes</span> conforme resposta clínica.</p>
                </div>
                <div className="flex items-start gap-3 text-slate-700 text-sm">
                    <div className="min-w-[20px] font-bold text-red-500">•</div>
                    <p>Alvo de elevação da natremia: <span className="font-bold bg-yellow-100 px-1 rounded text-yellow-800">4 a 6 mEq/L</span> nas primeiras horas.</p>
                </div>
                <div className="flex items-start gap-3 text-slate-700 text-sm">
                    <div className="min-w-[20px] font-bold text-red-500">•</div>
                    <p>Monitorizar sódio sérico a cada hora até estabilização dos sintomas.</p>
                </div>
            </div>
        </div>

        {/* Always show Recipe for 3% in Acute mode */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
             <h4 className="text-blue-800 font-bold text-sm mb-3 flex items-center gap-2">
               <Info className="w-4 h-4" />
               Como preparar NaCl 3% (Se não houver bolsa pronta)
             </h4>
             <ul className="space-y-2">
                {NACL3_RECIPES.map((recipe, idx) => (
                  <li key={idx} className="text-xs text-blue-700 bg-white/50 p-2 rounded border border-blue-100/50">
                    • {recipe}
                  </li>
                ))}
             </ul>
        </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Main Tab Switcher */}
      <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-sm flex">
        <button
          onClick={() => setActiveTab('hypo')}
          className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2
            ${activeTab === 'hypo' 
              ? 'bg-blue-600 text-white shadow-sm' 
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
        >
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
            <span className="flex items-center gap-1"><span className="text-lg">↓</span> Hiponatremia</span>
            <span className={`text-xs font-normal ${activeTab === 'hypo' ? 'text-blue-100' : 'text-slate-400'}`}>(Na &lt; 135)</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('hyper')}
          className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2
            ${activeTab === 'hyper' 
              ? 'bg-red-500 text-white shadow-sm' 
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
        >
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
            <span className="flex items-center gap-1"><span className="text-lg">↑</span> Hipernatremia</span>
            <span className={`text-xs font-normal ${activeTab === 'hyper' ? 'text-red-100' : 'text-slate-400'}`}>(Na &gt; 145)</span>
          </div>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className={`p-4 border-b ${activeTab === 'hypo' ? 'bg-blue-50 border-blue-100' : 'bg-red-50 border-red-100'}`}>
            <h3 className={`font-bold flex items-center gap-2 ${activeTab === 'hypo' ? 'text-blue-800' : 'text-red-800'}`}>
              <Calculator className="w-5 h-5" />
              {activeTab === 'hypo' ? 'Calculadora de Hiponatremia (Na < 135)' : 'Calculadora de Hipernatremia (Na > 145)'}
            </h3>
            <p className={`text-xs mt-1 ${activeTab === 'hypo' ? 'text-blue-600' : 'text-red-600'}`}>
               {activeTab === 'hypo' 
                 ? 'Correção para aumentar o sódio sérico (Fórmula de Adrogué-Madias).' 
                 : 'Correção do déficit de água livre (Fórmula de Adrogué-Madias).'}
            </p>
          </div>

          <div className="p-4 sm:p-6 space-y-6">
            
            {/* HYPONATREMIA SUB-MODES */}
            {activeTab === 'hypo' && (
                <div className="flex p-1 bg-slate-100 rounded-lg mb-4">
                    <button 
                        onClick={() => setHypoMode('gradual')}
                        className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-md transition-all ${hypoMode === 'gradual' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500'}`}
                    >
                        Correção Gradual
                    </button>
                    <button 
                        onClick={() => setHypoMode('acute')}
                        className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-md transition-all flex items-center justify-center gap-1 ${hypoMode === 'acute' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-500'}`}
                    >
                        <Zap className="w-3 h-3" />
                        Sintomática Aguda
                    </button>
                </div>
            )}
            
            {/* RENDER ACUTE PROTOCOL */}
            {activeTab === 'hypo' && hypoMode === 'acute' ? (
                renderAcuteHypoProtocol()
            ) : (
                /* RENDER STANDARD CALCULATOR (Gradual Hypo OR Hyper) */
                <>
                    {/* 1. Patient Data */}
                    <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 sm:col-span-1">
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Peso (kg)</label>
                        <input 
                            type="number" 
                            value={weight}
                            onChange={e => setWeight(e.target.value)}
                            className={`w-full border-slate-200 rounded-lg focus:ring-2 border outline-none py-2 px-3 shadow-sm
                                ${activeTab === 'hypo' ? 'focus:ring-blue-500 focus:border-blue-500' : 'focus:ring-red-500 focus:border-red-500'}`}
                            placeholder="Ex: 70"
                        />
                    </div>
                    <div className="col-span-1 sm:col-span-0.5">
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Idade</label>
                        <input 
                            type="number" 
                            value={age}
                            onChange={e => setAge(e.target.value)}
                            className={`w-full border-slate-200 rounded-lg focus:ring-2 border outline-none py-2 px-3 shadow-sm
                                ${activeTab === 'hypo' ? 'focus:ring-blue-500 focus:border-blue-500' : 'focus:ring-red-500 focus:border-red-500'}`}
                            placeholder="Anos"
                        />
                    </div>
                    <div className="col-span-1 sm:col-span-0.5">
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Sexo</label>
                        <div className="flex bg-slate-100 rounded-lg p-1">
                            <button 
                            onClick={() => setSex('male')}
                            className={`flex-1 text-xs font-bold py-2 rounded-md transition-colors ${sex === 'male' ? 'bg-white shadow text-slate-800' : 'text-slate-400'}`}
                            >
                            M
                            </button>
                            <button 
                            onClick={() => setSex('female')}
                            className={`flex-1 text-xs font-bold py-2 rounded-md transition-colors ${sex === 'female' ? 'bg-white shadow text-slate-800' : 'text-slate-400'}`}
                            >
                            F
                            </button>
                        </div>
                    </div>
                    </div>

                    {/* 2. Sodium Values */}
                    <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Na+ Atual</label>
                        <div className="relative">
                            <input 
                            type="number" 
                            value={currentNa}
                            onChange={e => setCurrentNa(e.target.value)}
                            className={`w-full border-slate-200 rounded-lg focus:ring-2 border outline-none py-2 px-3 shadow-sm pr-8
                                ${activeTab === 'hypo' ? 'focus:ring-blue-500 focus:border-blue-500' : 'focus:ring-red-500 focus:border-red-500'}`}
                            placeholder={activeTab === 'hypo' ? "120" : "160"}
                            />
                            <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">mEq</span>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Na+ Alvo (24h)</label>
                        <div className="relative">
                            <input 
                            type="number" 
                            value={targetNa}
                            onChange={e => setTargetNa(e.target.value)}
                            className={`w-full border-slate-200 rounded-lg focus:ring-2 border outline-none py-2 px-3 shadow-sm pr-8
                                ${activeTab === 'hypo' ? 'focus:ring-blue-500 focus:border-blue-500' : 'focus:ring-red-500 focus:border-red-500'}`}
                            placeholder={activeTab === 'hypo' ? "128" : "152"}
                            />
                            <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">mEq</span>
                        </div>
                    </div>
                    </div>

                    {/* 3. Solution Selection */}
                    <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Solução para Reposição</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {Object.keys(currentSolutions).map((key) => (
                        <button
                            key={key}
                            onClick={() => setSolution(key)}
                            className={`px-3 py-3 text-xs sm:text-sm font-medium rounded-lg border text-center transition-all
                            ${solution === key 
                                ? (activeTab === 'hypo' ? 'bg-blue-600 text-white border-blue-600 ring-2 ring-blue-200 ring-offset-1' : 'bg-red-600 text-white border-red-600 ring-2 ring-red-200 ring-offset-1')
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                            }
                            `}
                        >
                            {currentSolutions[key].label}
                        </button>
                        ))}
                    </div>
                    </div>

                    {/* 4. Results & Alerts */}
                    {result && result.alert && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-3 animate-fadeIn">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                        <p className="text-sm text-yellow-800 font-medium">{result.alert}</p>
                    </div>
                    )}

                    {result && (
                    <div className="bg-slate-800 text-white rounded-xl p-5 shadow-lg space-y-4 animate-fadeIn">
                        <div className="flex justify-between items-end border-b border-slate-600 pb-4">
                            <div>
                            <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">Volume Total em 24h</p>
                            <p className="text-3xl font-bold text-white mt-1">
                                {result.volNeeded > 0 ? result.volNeeded.toFixed(2) : '---'} <span className="text-lg text-slate-400 font-normal">Litros</span>
                            </p>
                            </div>
                            <div className="text-right">
                            <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">Vazão (Bomba)</p>
                            <p className={`text-3xl font-bold mt-1 ${activeTab === 'hypo' ? 'text-blue-400' : 'text-green-400'}`}>
                                {result.rate > 0 ? result.rate.toFixed(1) : '---'} <span className={`text-lg font-normal ${activeTab === 'hypo' ? 'text-blue-600/70' : 'text-green-600/70'}`}>mL/h</span>
                            </p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-xs text-slate-300 pt-1">
                            <div>
                            <span className="block text-slate-500 mb-0.5">Água Corporal Total (ACT)</span>
                            <span className="font-mono">{result.tbw.toFixed(1)} L</span>
                            </div>
                            <div className="text-right">
                            <span className="block text-slate-500 mb-0.5">Variação Na+ por Litro</span>
                            <span className="font-mono">{result.deltaNaL.toFixed(2)} mEq/L</span>
                            </div>
                        </div>
                    </div>
                    )}

                    {/* 5. Recipes (NaCl 0.45% or NaCl 3%) */}
                    {activeTab === 'hyper' && solution === 'nacl045' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 animate-fadeIn">
                        <h4 className="text-blue-800 font-bold text-sm mb-3 flex items-center gap-2">
                        <Info className="w-4 h-4" />
                        Como preparar NaCl 0,45%
                        </h4>
                        <ul className="space-y-2">
                            {NACL045_RECIPES.map((recipe, idx) => (
                            <li key={idx} className="text-xs text-blue-700 bg-white/50 p-2 rounded border border-blue-100/50">
                                • {recipe}
                            </li>
                            ))}
                        </ul>
                    </div>
                    )}

                    {activeTab === 'hypo' && solution === 'nacl3' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 animate-fadeIn">
                        <h4 className="text-blue-800 font-bold text-sm mb-3 flex items-center gap-2">
                        <Info className="w-4 h-4" />
                        Como preparar NaCl 3%
                        </h4>
                        <ul className="space-y-2">
                            {NACL3_RECIPES.map((recipe, idx) => (
                            <li key={idx} className="text-xs text-blue-700 bg-white/50 p-2 rounded border border-blue-100/50">
                                • {recipe}
                            </li>
                            ))}
                        </ul>
                    </div>
                    )}
                </>
            )}

          </div>
        </div>
    </div>
  );
};

export default SodiumCalculator;
