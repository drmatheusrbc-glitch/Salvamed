
import React, { useState } from 'react';
import { Calculator, AlertTriangle, Info, CheckCircle, Pill, Syringe, Ban, Droplet, Layers, Zap, HeartPulse } from 'lucide-react';

const MagnesiumCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'calc' | 'emergency'>('calc');
  const [currentMg, setCurrentMg] = useState<string>('');

  const mgVal = parseFloat(currentMg);

  // --- RENDERING HELPERS ---

  const renderSectionHeader = (title: string, colorClass: string, icon?: React.ReactNode) => (
    <div className={`flex items-center gap-2 mb-3 ${colorClass} font-bold border-b pb-2`}>
      {icon}
      <span>{title}</span>
    </div>
  );

  const renderAmpouleReference = () => (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden mt-4">
        <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1">
                <Info className="w-3 h-3" /> Referência de Apresentação
            </span>
        </div>
        <table className="w-full text-sm text-left">
            <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-700">Sulfato de Magnésio 10%</td>
                    <td className="px-4 py-3 text-slate-600">Ampola 10 mL = <span className="font-bold">1g</span></td>
                </tr>
                <tr className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-700">Sulfato de Magnésio 50%</td>
                    <td className="px-4 py-3 text-slate-600">Ampola 10 mL = <span className="font-bold">5g</span></td>
                </tr>
            </tbody>
        </table>
    </div>
  );

  const renderEmergencyProtocol = () => (
    <div className="animate-fadeIn space-y-6">
       {/* TORSADES */}
       <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-red-800 font-bold border-b border-red-200 pb-2">
                <HeartPulse className="w-5 h-5 text-red-600" />
                <span>1) Torsade de Pointes</span>
            </div>
            
            <div className="space-y-4">
               <div className="bg-white/60 p-3 rounded border border-red-100">
                   <div className="flex justify-between items-center mb-1">
                       <p className="font-bold text-red-900 text-sm">Opção A (Mg 10%)</p>
                       <span className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded uppercase">Preferencial</span>
                   </div>
                   <p className="text-sm text-red-800">
                       Sulfato de Magnésio 10% (<span className="font-bold text-red-900">20 mL</span>) + 100 mL SG 5%.
                   </p>
               </div>
               
               <div className="text-center text-xs text-red-400 font-bold uppercase tracking-widest">- OU -</div>

               <div className="bg-white/60 p-3 rounded border border-red-100">
                   <p className="font-bold text-red-900 text-sm mb-1">Opção B (Mg 50%)</p>
                   <p className="text-sm text-red-800">
                       Sulfato de Magnésio 50% (<span className="font-bold text-red-900">4 mL</span>) + 100 mL SG 5%.
                   </p>
               </div>

               <div className="flex items-center gap-2 text-xs font-bold text-red-700 bg-red-100/50 p-2.5 rounded border border-red-100">
                   <Zap className="w-4 h-4" />
                   Tempo de infusão: 2 a 15 minutos (EV).
               </div>
            </div>
       </div>

       {/* SINTOMAS GRAVES */}
       <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-orange-800 font-bold border-b border-orange-200 pb-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <span>2) Sintomas Graves ou Instabilidade</span>
            </div>
            <p className="text-xs text-orange-700 mb-5 font-medium bg-orange-100/50 p-2 rounded">
               Tetania, arritmias, convulsões ou instabilidade hemodinâmica.
            </p>
            
            <div className="space-y-4">
               {/* Attack */}
               <div className="bg-white/60 p-3 rounded border border-orange-100 relative pt-4">
                   <span className="absolute -top-2.5 left-2 bg-orange-100 text-orange-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase border border-orange-200 shadow-sm">
                       Dose de Ataque
                   </span>
                   <p className="text-sm text-orange-900 mt-1">
                       Sulfato de Magnésio 10% (<span className="font-bold">20 mL</span>) + 100 mL SG 5% (ou SF 0,9%).
                   </p>
                   <div className="flex items-center gap-1 mt-2 text-orange-700 text-xs font-bold">
                       <Zap className="w-3 h-3" /> Infusão: 5 a 60 minutos (EV).
                   </div>
               </div>

               {/* Maintenance */}
               <div className="bg-white/60 p-3 rounded border border-orange-100 relative pt-4">
                   <span className="absolute -top-2.5 left-2 bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase border border-blue-200 shadow-sm">
                       Manutenção
                   </span>
                   <p className="text-sm text-blue-900 mt-1">
                       Sulfato de Magnésio 10% (<span className="font-bold">40 mL</span>) + 460 mL SG 5% (ou SF 0,9%).
                   </p>
                   <div className="flex items-center gap-1 mt-2 text-blue-700 text-xs font-bold">
                       <CheckCircle className="w-3 h-3" /> Infusão: 12 a 24 horas (EV).
                   </div>
               </div>
            </div>
       </div>
       
       {renderAmpouleReference()}
    </div>
  );

  const renderCalculatorProtocol = () => {
    if (!currentMg || isNaN(mgVal)) {
        return (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Layers className="w-6 h-6 text-slate-400" />
                </div>
                <h4 className="text-slate-700 font-bold mb-1">Informe o nível de Magnésio</h4>
                <p className="text-slate-500 text-sm">Insira o valor sérico (mg/dL) para visualizar o protocolo.</p>
            </div>
        );
    }

    // --- HIPOMAGNESEMIA GRAVE / ESTÁVEL (< 1.0) ---
    if (mgVal < 1.0) {
        return (
            <div className="animate-fadeIn space-y-4">
                 <div className="bg-red-100 border border-red-300 rounded-lg p-3 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <h4 className="font-bold text-red-800">Hipomagnesemia Grave (&lt; 1,0 mg/dL)</h4>
                 </div>

                 <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    {renderSectionHeader('Reposição Endovenosa (Estável)', 'text-red-800 border-red-200', <Syringe className="w-4 h-4" />)}
                    
                    <div className="space-y-4">
                        <div className="bg-white/60 p-3 rounded border border-red-100">
                            <p className="font-bold text-red-900 text-sm mb-1">Opção A (Mg 10%)</p>
                            <p className="text-sm text-red-800">
                                Sulfato de Magnésio 10% (<span className="font-bold">20 mL</span>) + 250 mL SG 5% (ou SF 0,9%).
                            </p>
                        </div>
                        
                        <div className="text-center text-xs text-red-400 font-bold uppercase">- OU -</div>

                        <div className="bg-white/60 p-3 rounded border border-red-100">
                            <p className="font-bold text-red-900 text-sm mb-1">Opção B (Mg 50%)</p>
                            <p className="text-sm text-red-800">
                                Sulfato de Magnésio 50% (<span className="font-bold">4 mL</span>) + 246 mL SG 5% (ou SF 0,9%).
                            </p>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-bold text-red-700 bg-red-100/50 p-2 rounded">
                            <CheckCircle className="w-3 h-3" />
                            Tempo de infusão: 3 a 6 horas.
                        </div>
                    </div>
                 </div>

                 <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="font-bold text-blue-900 text-sm mb-1">Dose de Manutenção</p>
                    <p className="text-sm text-blue-800">
                        Sulfato de Magnésio 4 a 6g/dia por 3 a 4 dias para repor estoques.
                    </p>
                 </div>

                 {renderAmpouleReference()}
            </div>
        );
    }

    // --- HIPOMAGNESEMIA LEVE (1.0 - 1.7) ---
    if (mgVal >= 1.0 && mgVal <= 1.7) {
        return (
            <div className="animate-fadeIn space-y-4">
                 <div className="bg-amber-100 border border-amber-300 rounded-lg p-3 flex items-center gap-2">
                    <Info className="w-5 h-5 text-amber-600" />
                    <h4 className="font-bold text-amber-800">Hipomagnesemia Leve (1,0 - 1,7 mg/dL)</h4>
                 </div>

                 {/* ORAL */}
                 <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    {renderSectionHeader('Reposição Via Oral', 'text-amber-800 border-amber-200', <Pill className="w-4 h-4" />)}
                    
                    <p className="text-xs text-amber-900 mb-3 font-medium">
                        Dose diária (Função renal preservada): 240 a 1000mg de magnésio elementar, fracionada.
                    </p>

                    <div className="space-y-2">
                        <div className="bg-white/60 p-2 rounded border border-amber-100 flex justify-between items-center">
                            <div>
                                <p className="font-bold text-sm text-amber-900">Glicinato de Mg (Magnen®)</p>
                                <p className="text-xs text-amber-700">720 mg</p>
                            </div>
                            <span className="text-xs font-bold bg-amber-200 text-amber-800 px-2 py-1 rounded">130 mg Elementar</span>
                        </div>
                        <div className="bg-white/60 p-2 rounded border border-amber-100 flex justify-between items-center">
                            <div>
                                <p className="font-bold text-sm text-amber-900">Pidolato de Mg (Pidomag®)</p>
                                <p className="text-xs text-amber-700">1500 mg</p>
                            </div>
                            <span className="text-xs font-bold bg-amber-200 text-amber-800 px-2 py-1 rounded">130 mg Elementar</span>
                        </div>
                        <div className="bg-white/60 p-2 rounded border border-amber-100 flex justify-between items-center">
                            <div>
                                <p className="font-bold text-sm text-amber-900">Hidróxido de Mg</p>
                                <p className="text-xs text-amber-700">Estomazil®, Eno® (180mg)</p>
                            </div>
                            <span className="text-xs font-bold bg-amber-200 text-amber-800 px-2 py-1 rounded">72 mg Elementar</span>
                        </div>
                    </div>
                 </div>

                 {/* IV FALLBACK */}
                 <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    {renderSectionHeader('Opção EV (Se indisponibilidade VO)', 'text-slate-700 border-slate-200', <Syringe className="w-4 h-4" />)}
                    
                    <div className="space-y-3">
                         <p className="text-sm text-slate-700">
                            • <strong>Mg 10%:</strong> 10 mL + 100 mL diluente.
                         </p>
                         <p className="text-sm text-slate-700">
                            • <strong>Mg 50%:</strong> 2,5 mL + 100 mL diluente.
                         </p>
                         <p className="text-xs text-slate-500 italic">
                            Diluente: SG 5% ou SF 0,9%. Correr em 3-6 horas.
                         </p>
                    </div>
                 </div>

                 {renderAmpouleReference()}
            </div>
        );
    }

    // --- HIPERMAGNESEMIA (> 2.5) ---
    if (mgVal > 2.5) {
        return (
            <div className="animate-fadeIn space-y-4">
                 <div className="bg-red-100 border border-red-300 rounded-lg p-3 flex items-center gap-2">
                    <Ban className="w-5 h-5 text-red-600" />
                    <h4 className="font-bold text-red-800">Hipermagnesemia (&gt; 2,5 mg/dL)</h4>
                 </div>

                 <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    {renderSectionHeader('Conduta', 'text-red-800 border-red-200', <AlertTriangle className="w-4 h-4" />)}
                    
                    <ul className="space-y-4">
                        <li className="flex items-start gap-3">
                            <Ban className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-red-900 font-bold">Interromper reposição de magnésio imediatamente.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <Droplet className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-red-900">
                                <p className="font-bold">Expansão e Diurese</p>
                                <p>Considerar hidratação com Soro Fisiológico.</p>
                                <p className="mt-1">
                                    <span className="font-semibold text-red-800">Furosemida:</span> 40 a 80mg EV de até 4/4 horas.
                                </p>
                            </div>
                        </li>
                    </ul>
                 </div>
            </div>
        );
    }

    // --- NORMAL RANGE (1.8 - 2.5) ---
    return (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800 text-sm flex items-center gap-2">
             <CheckCircle className="w-5 h-5 text-green-600" />
             Magnésio dentro dos limites de referência ou fora da faixa de tratamento deste protocolo (1,8 - 2,5).
        </div>
    );
  };


  return (
    <div className="space-y-4">
      
      {/* Tab Switcher */}
      <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-sm flex">
        <button
          onClick={() => setActiveTab('calc')}
          className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2
            ${activeTab === 'calc' 
              ? 'bg-amber-500 text-white shadow-sm' 
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
        >
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
             <Calculator className="w-4 h-4" />
             <span>Calculadora (Nível Sérico)</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('emergency')}
          className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2
            ${activeTab === 'emergency' 
              ? 'bg-red-600 text-white shadow-sm' 
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
        >
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
             <Zap className="w-4 h-4" />
             <span className="flex flex-col sm:flex-row items-center">
                 Hipomagnesemia Grave
                 <span className="hidden sm:inline ml-1 text-[10px] font-normal opacity-80">(Emergência)</span>
             </span>
          </div>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className={`p-4 border-b ${activeTab === 'calc' ? 'bg-amber-50 border-amber-100' : 'bg-red-50 border-red-100'}`}>
            <h3 className={`font-bold flex items-center gap-2 ${activeTab === 'calc' ? 'text-amber-800' : 'text-red-800'}`}>
              {activeTab === 'calc' ? <Calculator className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
              {activeTab === 'calc' ? 'Manejo do Magnésio' : 'Protocolos de Emergência'}
            </h3>
            <p className={`text-xs mt-1 ${activeTab === 'calc' ? 'text-amber-700' : 'text-red-700'}`}>
               {activeTab === 'calc' ? 'Correção baseada no valor sérico.' : 'Torsade de Pointes e Instabilidade Hemodinâmica.'}
            </p>
          </div>

          <div className="p-4 sm:p-6 space-y-6">
            
            {activeTab === 'calc' && (
                <>
                    {/* Input Mg */}
                    <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Magnésio Sérico (Mg)</label>
                    <div className="relative max-w-xs">
                        <input 
                        type="number" 
                        value={currentMg}
                        onChange={e => setCurrentMg(e.target.value)}
                        className="w-full border-slate-200 rounded-lg focus:ring-2 border outline-none py-2 px-3 shadow-sm pr-12 focus:ring-amber-500 focus:border-amber-500"
                        placeholder="Ex: 1.2"
                        />
                        <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">mg/dL</span>
                    </div>
                    </div>

                    {/* Logic Content */}
                    {renderCalculatorProtocol()}
                </>
            )}

            {activeTab === 'emergency' && renderEmergencyProtocol()}

          </div>
      </div>
    </div>
  );
};

export default MagnesiumCalculator;
