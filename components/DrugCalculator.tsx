
import React, { useState, useEffect } from 'react';
import { Drug, CalculationType, UnitType } from '../types';
import { Calculator, Scale, Syringe } from 'lucide-react';

interface Props {
  drug: Drug;
}

const DrugCalculator: React.FC<Props> = ({ drug }) => {
  const [weight, setWeight] = useState<string>('');
  const [dose, setDose] = useState<string>('');
  const [flow, setFlow] = useState<string>(''); // mL/h or mL
  const [mode, setMode] = useState<'doseToFlow' | 'flowToDose'>('doseToFlow');

  // Reset local state when drug changes
  useEffect(() => {
    setDose('');
    setFlow('');
    // Keep weight if user is switching between variants of the same drug usually, 
    // but here we just keep it in state. Ideally lift weight state up if we want it to persist across drugs.
  }, [drug]);

  const handleCalculate = () => {
    const w = parseFloat(weight);
    const d = parseFloat(dose);
    const f = parseFloat(flow);
    const conc = drug.concentrationVal;

    // Safety checks
    if (drug.isWeightBased && (!w || w <= 0)) return;

    if (mode === 'doseToFlow') {
      if (!d && d !== 0) return;
      
      let resultFlow = 0;

      // CONTINUOUS INFUSION (mL/h)
      if (drug.type === CalculationType.Continuous) {
        if (drug.doseUnit === UnitType.McgKgMin) {
           // Flow (mL/h) = (Dose * Weight * 60) / (Conc in mcg/mL)
           // If conc is mg/mL, must convert conc to mcg/mL (x1000)
           const concMcg = drug.concentrationUnit === 'mg/ml' ? conc * 1000 : conc;
           const concFinal = drug.concentrationUnit === 'U/ml' ? conc : concMcg; 
           resultFlow = (d * w * 60) / concFinal;
        } 
        else if (drug.doseUnit === UnitType.McgMin) {
           // Flow (mL/h) = (Dose * 60) / (Conc in mcg/mL)
           const concMcg = drug.concentrationUnit === 'mg/ml' ? conc * 1000 : conc;
           resultFlow = (d * 60) / concMcg;
        }
        else if (drug.doseUnit === UnitType.UMin) {
           // Flow (mL/h) = (Dose * 60) / Conc
           resultFlow = (d * 60) / conc;
        }
        else if (drug.doseUnit === UnitType.MgKgH) {
           // Flow (mL/h) = (Dose * Weight) / (Conc in mg/mL)
           const concMg = drug.concentrationUnit === 'mcg/ml' ? conc / 1000 : conc;
           resultFlow = (d * w) / concMg;
        }
        else if (drug.doseUnit === UnitType.McgKgH) {
           // Flow (mL/h) = (Dose * Weight) / (Conc in mcg/mL)
           const concMcg = drug.concentrationUnit === 'mg/ml' ? conc * 1000 : conc;
           resultFlow = (d * w) / concMcg;
        }
      }
      // BOLUS (mL)
      else {
        if (drug.doseUnit === UnitType.MgKg) {
           // Vol (mL) = (Dose * Weight) / (Conc in mg/mL)
           const concMg = drug.concentrationUnit === 'mcg/ml' ? conc / 1000 : conc;
           resultFlow = (d * w) / concMg;
        }
        else if (drug.doseUnit === UnitType.McgKg) {
            // Vol (mL) = (Dose * Weight) / (Conc in mcg/mL)
            const concMcg = drug.concentrationUnit === 'mg/ml' ? conc * 1000 : conc;
            resultFlow = (d * w) / concMcg;
        }
      }
      
      setFlow(resultFlow.toFixed(2));
    } 
    else {
      // FLOW TO DOSE
      if (!f && f !== 0) return;
      
      let resultDose = 0;

      if (drug.type === CalculationType.Continuous) {
        if (drug.doseUnit === UnitType.McgKgMin) {
           // Dose = (Flow * Conc_mcg) / (Weight * 60)
           const concMcg = drug.concentrationUnit === 'mg/ml' ? conc * 1000 : conc;
           resultDose = (f * concMcg) / (w * 60);
        }
        else if (drug.doseUnit === UnitType.McgMin) {
           // Dose = (Flow * Conc_mcg) / 60
           const concMcg = drug.concentrationUnit === 'mg/ml' ? conc * 1000 : conc;
           resultDose = (f * concMcg) / 60;
        }
        else if (drug.doseUnit === UnitType.UMin) {
           // Dose = (Flow * Conc) / 60
           resultDose = (f * conc) / 60;
        }
        else if (drug.doseUnit === UnitType.MgKgH) {
           // Dose = (Flow * Conc_mg) / Weight
           const concMg = drug.concentrationUnit === 'mcg/ml' ? conc / 1000 : conc;
           resultDose = (f * concMg) / w;
        }
        else if (drug.doseUnit === UnitType.McgKgH) {
            // Dose = (Flow * Conc_mcg) / Weight
            const concMcg = drug.concentrationUnit === 'mg/ml' ? conc * 1000 : conc;
            resultDose = (f * concMcg) / w;
         }
      }
      else {
        if (drug.doseUnit === UnitType.MgKg) {
            const concMg = drug.concentrationUnit === 'mcg/ml' ? conc / 1000 : conc;
            resultDose = (f * concMg) / w;
        }
        else if (drug.doseUnit === UnitType.McgKg) {
            const concMcg = drug.concentrationUnit === 'mg/ml' ? conc * 1000 : conc;
            resultDose = (f * concMcg) / w;
        }
      }

      setDose(resultDose.toFixed(3));
    }
  };

  // Auto calculate when inputs change
  useEffect(() => {
    if (mode === 'doseToFlow' && dose && (!drug.isWeightBased || weight)) {
        handleCalculate();
    } else if (mode === 'flowToDose' && flow && (!drug.isWeightBased || weight)) {
        handleCalculate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dose, flow, weight, mode]);

  return (
    <div className="bg-white rounded-xl shadow-none border border-blue-100 overflow-hidden">
      <div className="bg-blue-50/50 p-3 border-b border-blue-100">
        <h3 className="font-bold text-blue-800 text-sm flex items-center gap-2">
          <Calculator className="w-4 h-4" />
          Calculadora Rápida
        </h3>
      </div>
      
      <div className="p-4 space-y-5">
        {/* Weight Input */}
        {drug.isWeightBased && (
            <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Peso do Paciente (kg)
            </label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Scale className="h-4 w-4 text-slate-400" />
                </div>
                <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="block w-full pl-10 pr-12 py-2 border-slate-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-base border shadow-sm"
                placeholder="70"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-slate-400 text-xs font-medium">kg</span>
                </div>
            </div>
            </div>
        )}

        {/* Toggle Mode */}
        <div className="flex bg-slate-100 p-1 rounded-lg">
            <button
                onClick={() => { setMode('doseToFlow'); setFlow(''); }}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${mode === 'doseToFlow' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
                Dose → Vazão
            </button>
            <button
                onClick={() => { setMode('flowToDose'); setDose(''); }}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${mode === 'flowToDose' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
                Vazão → Dose
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Input Side */}
            <div className={`transition-opacity ${mode === 'flowToDose' ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                   Dose Alvo
                </label>
                <div className="relative">
                    <input
                    type="number"
                    value={dose}
                    onChange={(e) => {
                        if (mode === 'doseToFlow') setDose(e.target.value);
                    }}
                    className="block w-full py-2 px-3 border-slate-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-base border shadow-sm"
                    placeholder="0.00"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                     <span className="text-slate-400 text-[10px] font-bold uppercase leading-tight text-right max-w-[60px]">{drug.doseUnit}</span>
                    </div>
                </div>
            </div>

            {/* Output Side */}
            <div className={`transition-opacity ${mode === 'doseToFlow' ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    {drug.type === CalculationType.Continuous ? 'Bomba Infusora' : 'Volume (Seringa)'}
                </label>
                <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Syringe className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                    type="number"
                    value={flow}
                    onChange={(e) => {
                         if (mode === 'flowToDose') setFlow(e.target.value);
                    }}
                    className="block w-full pl-9 pr-12 py-2 border-slate-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-base border shadow-sm font-bold text-blue-800 bg-blue-50/30"
                    placeholder="0.00"
                    />
                     <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-slate-500 text-xs font-bold">
                            {drug.type === CalculationType.Continuous ? 'mL/h' : 'mL'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DrugCalculator;
