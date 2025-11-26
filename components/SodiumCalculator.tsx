
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Activity, AlertTriangle, Droplet, Info, Calculator } from 'lucide-react';

const SodiumCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'hypo' | 'hyper'>('hypo');

  // --- STATE FOR HYPERNATREMIA ---
  const [weight, setWeight] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [sex, setSex] = useState<'male' | 'female'>('male');
  const [currentNa, setCurrentNa] = useState<string>('');
  const [targetNa, setTargetNa] = useState<string>('');
  const [solution, setSolution] = useState<string>('sg5'); // Default to Free Water (SG5%) often used, or 0.45

  const [result, setResult] = useState<{
    tbw: number;
    deltaNaL: number; // Change per Liter
    volNeeded: number; // Liters
    rate: number; // mL/h
    alert: string | null;
  } | null>(null);

  // --- CONSTANTS ---
  const SOLUTIONS: Record<string, { label: string; na: number }> = {
    'sf09': { label: 'Soro Fisiológico 0,9%', na: 154 },
    'sg5': { label: 'Soro Glicosado 5%', na: 0 },
    'nacl045': { label: 'NaCl 0,45%', na: 77 },
  };

  const NACL045_RECIPES = [
    "250 ML SF 0,9% + 250 ML Água Destilada",
    "10 ML NaCl 20% + 490 ML Água Destilada",
    "500 ML SF 0,9% + 500 ML Água Destilada",
    "22 ML NaCl 20% + 978 ML Água Destilada"
  ];

  // --- CALCULATION EFFECT ---
  useEffect(() => {
    if (activeTab === 'hyper') {
      calculateHyper();
    } else {
      setResult(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weight, age, sex, currentNa, targetNa, solution, activeTab]);

  const calculateHyper = () => {
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
      tbwFactor = a > 60 ? 0.5 : 0.6; // Assuming cutoff > 60 includes 60 for simplicity or strictly >. Using >60 as "Idoso" logic usually implies >= 65, but prompt said >60.
    } else {
      tbwFactor = a > 60 ? 0.45 : 0.5;
    }
    const tbw = w * tbwFactor;

    // 2. Alert Check
    const diff = Math.abs(naTarg - naCurr);
    let alertMsg = null;
    if (diff > 8) {
      alertMsg = "Alerta: variação máxima recomendada é de 8-10 mEq/L nas primeiras 24h (ideal 6-8).";
    }
    // Check if target is actually lower for hypernatremia
    if (naTarg >= naCurr) {
        // Technically user might want to increase Na in Hyper if input wrong, but assume correction means lowering.
        // We won't block, but math will result in negative volume if we don't handle abs.
    }

    // 3. Adrogué-Madias Formula
    // DeltaNa = (Na_infusate - Na_serum) / (TBW + 1)
    const naSol = SOLUTIONS[solution].na;
    const deltaNaPerLiter = (naSol - naCurr) / (tbw + 1);

    // 4. Volume Needed
    // Volume = (Target - Current) / DeltaNa_per_Liter
    // Example: Current 160, Target 152. Diff = -8.
    // Solution SG5 (0). TBW 40. Delta/L = (0-160)/41 = -3.9
    // Vol = -8 / -3.9 = 2.05 L
    
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

  return (
    <div className="space-y-4">
      {/* Tab Switcher */}
      <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-sm flex">
        <button
          onClick={() => setActiveTab('hypo')}
          className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2
            ${activeTab === 'hypo' 
              ? 'bg-blue-600 text-white shadow-sm' 
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
        >
          <span className="flex items-center gap-2">
            <span className="text-lg">↓</span> Hiponatremia
          </span>
        </button>
        <button
          onClick={() => setActiveTab('hyper')}
          className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2
            ${activeTab === 'hyper' 
              ? 'bg-red-500 text-white shadow-sm' 
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
        >
          <span className="flex items-center gap-2">
            <span className="text-lg">↑</span> Hipernatremia
          </span>
        </button>
      </div>

      {/* --- HYPERNATREMIA CALCULATOR --- */}
      {activeTab === 'hyper' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-fadeIn">
          <div className="bg-red-50 p-4 border-b border-red-100">
            <h3 className="font-bold text-red-800 flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Calculadora de Hipernatremia
            </h3>
            <p className="text-xs text-red-600 mt-1">
              Correção do déficit de água livre (Fórmula de Adrogué-Madias).
            </p>
          </div>

          <div className="p-4 sm:p-6 space-y-6">
            
            {/* 1. Patient Data */}
            <div className="grid grid-cols-2 gap-4">
               <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Peso (kg)</label>
                  <input 
                    type="number" 
                    value={weight}
                    onChange={e => setWeight(e.target.value)}
                    className="w-full border-slate-200 rounded-lg focus:ring-red-500 focus:border-red-500"
                    placeholder="Ex: 70"
                  />
               </div>
               <div className="col-span-1 sm:col-span-0.5">
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Idade</label>
                  <input 
                    type="number" 
                    value={age}
                    onChange={e => setAge(e.target.value)}
                    className="w-full border-slate-200 rounded-lg focus:ring-red-500 focus:border-red-500"
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
                      className="w-full border-slate-200 rounded-lg focus:ring-red-500 focus:border-red-500 pr-8"
                      placeholder="160"
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
                      className="w-full border-slate-200 rounded-lg focus:ring-red-500 focus:border-red-500 pr-8"
                      placeholder="152"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">mEq</span>
                  </div>
               </div>
            </div>

            {/* 3. Solution Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Solução para Reposição</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                 {Object.keys(SOLUTIONS).map((key) => (
                   <button
                     key={key}
                     onClick={() => setSolution(key)}
                     className={`px-3 py-3 text-xs sm:text-sm font-medium rounded-lg border text-center transition-all
                       ${solution === key 
                         ? 'bg-red-600 text-white border-red-600 ring-2 ring-red-200 ring-offset-1' 
                         : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                       }
                     `}
                   >
                     {SOLUTIONS[key].label}
                   </button>
                 ))}
              </div>
            </div>

            {/* 4. Results & Alerts */}
            {result && result.alert && (
               <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-3">
                 <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                 <p className="text-sm text-yellow-800 font-medium">{result.alert}</p>
               </div>
            )}

            {result && (
              <div className="bg-slate-800 text-white rounded-xl p-5 shadow-lg space-y-4">
                 <div className="flex justify-between items-end border-b border-slate-600 pb-4">
                    <div>
                      <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">Volume Total em 24h</p>
                      <p className="text-3xl font-bold text-white mt-1">
                        {result.volNeeded > 0 ? result.volNeeded.toFixed(2) : '0.00'} <span className="text-lg text-slate-400 font-normal">Litros</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">Vazão (Bomba)</p>
                      <p className="text-3xl font-bold text-green-400 mt-1">
                        {result.rate > 0 ? result.rate.toFixed(1) : '0.0'} <span className="text-lg text-green-600/70 font-normal">mL/h</span>
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

            {/* 5. Special NaCl 0.45% Info */}
            {solution === 'nacl045' && (
               <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
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

          </div>
        </div>
      )}

      {/* --- HYPONATREMIA PLACEHOLDER --- */}
      {activeTab === 'hypo' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-blue-50 p-4 border-b border-blue-100">
             <h3 className="font-bold text-blue-800 flex items-center gap-2">
               <Droplet className="w-5 h-5" />
               Correção de Hiponatremia
             </h3>
          </div>
          <div className="p-8 text-center opacity-60">
             <Activity className="w-12 h-12 text-slate-300 mx-auto mb-3" />
             <p className="text-slate-500 text-sm">A calculadora de Hiponatremia será implementada em breve.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SodiumCalculator;
