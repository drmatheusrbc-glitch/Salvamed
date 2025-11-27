
import React, { useState } from 'react';
import { Calculator, AlertTriangle, Info, CheckCircle, XCircle, Pill, Activity, Syringe, Wind, AlertCircle } from 'lucide-react';

const PotassiumCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'hypo' | 'hyper'>('hypo');
  const [currentK, setCurrentK] = useState<string>('');
  const [hasEcgChanges, setHasEcgChanges] = useState<boolean | null>(null);

  const kVal = parseFloat(currentK);

  // --- RENDERING HELPERS ---

  const renderSectionHeader = (step: string, title: string, colorClass: string) => (
    <div className={`flex items-center gap-2 mb-3 ${colorClass} font-bold border-b pb-2`}>
      <span className="uppercase text-xs tracking-wider px-2 py-1 rounded-md bg-white border opacity-80">{step}</span>
      <span>{title}</span>
    </div>
  );

  const renderStabilization = () => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      {renderSectionHeader('Passo 01', 'Estabilização da Membrana Cardíaca', 'text-red-800 border-red-200')}
      <div className="flex items-start gap-3">
        <Syringe className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-red-900">
          <p className="font-bold">Gluconato de Cálcio 10%</p>
          <p>10 mL + 100 mL SG 5% EV em BIC - correr em 10 minutos.</p>
          <p className="text-xs text-red-700 mt-1 italic">(Pode ser repetido 3x ou até normalizar ECG)</p>
        </div>
      </div>
    </div>
  );

  const renderRedistribution = () => (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      {renderSectionHeader('Passo 02', 'Redistribuição do Potássio (Shift)', 'text-blue-800 border-blue-200')}
      <ul className="space-y-4">
        <li className="flex items-start gap-3">
          <Syringe className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-900">
            <p className="font-bold">Solução Polarizante (Glicoinsulina)</p>
            <p className="mb-1">10 UI de insulina regular + Escolha uma opção:</p>
            <ul className="list-disc pl-4 space-y-0.5 text-blue-800">
                <li>100 mL de SG 50%</li>
                <li>OU 500 mL de SG 10%</li>
                <li>OU 1.000 mL de SG 5%</li>
            </ul>
            <p className="text-xs mt-1">Administrar 4/4h ou 6/6h.</p>
          </div>
        </li>
        <li className="flex items-start gap-3">
          <Wind className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-900">
            <p className="font-bold">Beta2-agonista (Salbutamol)</p>
            <p>100 µg (6 a 10 puffs) via inalatória.</p>
          </div>
        </li>
      </ul>
    </div>
  );

  const renderElimination = (maintenanceDoseLokelma: string, stepLabel: string, showDialysis: boolean = false) => (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
      {renderSectionHeader(stepLabel, 'Eliminação do Potássio', 'text-green-800 border-green-200')}
      
      <div className="space-y-4">
        <div className="flex items-start gap-3">
           <Pill className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
           <div className="text-sm text-green-900">
              <p className="font-bold">Diurético de Alça</p>
              <p>Furosemida (20mg/2mL): 1 a 2 mg/kg EV em bolus, até 4/4h.</p>
           </div>
        </div>

        <div className="border-t border-green-200 pt-2">
            <p className="text-xs font-bold text-green-700 uppercase mb-2">Quelantes de Potássio (E/ou)</p>
            
            <div className="space-y-3">
                <div className="bg-white/60 p-2 rounded">
                    <p className="font-bold text-sm text-green-900">Poliestirenossulfonato de Cálcio (Sorcal®)</p>
                    <p className="text-sm text-green-800">30 g/envelope: Fazer 15g + 100 mL água VO de 6/6 horas.</p>
                </div>
                
                <div className="bg-white/60 p-2 rounded">
                    <p className="font-bold text-sm text-green-900">Ciclossilicato de Zircônio (Lokelma®)</p>
                    <p className="text-sm text-green-800">5 g/envelope: 2 sachês de 8/8h em 24h.</p>
                    <p className="text-sm font-bold text-green-900 mt-1">Manutenção: {maintenanceDoseLokelma}</p>
                </div>
            </div>
        </div>

        {showDialysis && (
             <div className="flex items-start gap-3 border-t border-green-200 pt-3">
                <Activity className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-800 font-bold">
                    Hemodiálise se refratário.
                </div>
             </div>
        )}
      </div>
    </div>
  );

  const renderSuspension = () => (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
      {renderSectionHeader('Passo 01', 'Suspensão de Fármacos', 'text-yellow-800 border-yellow-200')}
      <div className="flex items-start gap-3">
        <XCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-yellow-900">
          <p className="font-bold">Suspender drogas que aumentam o K⁺ sérico:</p>
          <ul className="list-disc pl-4 mt-1">
            <li>IECA / BRA</li>
            <li>Espironolactona</li>
            <li>Betabloqueadores</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const renderHypoOralOptions = () => (
     <div className="space-y-3">
        <div className="bg-white/60 p-3 rounded border border-purple-100">
           <div className="flex items-center justify-between mb-1">
             <span className="font-bold text-purple-900 text-sm">Cloreto de Potássio (Drágeas)</span>
             <span className="text-xs bg-purple-200 text-purple-800 px-2 py-0.5 rounded">600 mg</span>
           </div>
           <p className="text-sm text-purple-800">1 a 2 drágeas VO em até 6/6 horas.</p>
        </div>
        <div className="text-center text-xs text-purple-400 font-bold uppercase">- OU -</div>
        <div className="bg-white/60 p-3 rounded border border-purple-100">
           <div className="flex items-center justify-between mb-1">
             <span className="font-bold text-purple-900 text-sm">Cloreto de Potássio (Xarope)</span>
             <span className="text-xs bg-purple-200 text-purple-800 px-2 py-0.5 rounded">6% (60mg/mL)</span>
           </div>
           <p className="text-sm text-purple-800">10 a 20 mL VO em até 6/6 horas.</p>
        </div>
     </div>
  );

  const renderHypoSafetyNotes = () => (
      <div className="mt-6 space-y-4">
         {/* Safety Alerts */}
         <div className="bg-slate-800 text-slate-300 rounded-lg p-4 text-xs space-y-2">
            <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                <p><strong className="text-white">Concentração Máxima:</strong> Veia Periférica (50 mEq/L) | Veia Central (100 mEq/L).</p>
            </div>
            <div className="flex items-start gap-2">
                <Activity className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <p><strong className="text-white">Velocidade de Infusão:</strong> Veia Periférica: 5-10 mEq/h (Ideal) | Veia Central: 20-30 mEq/h (c/ monitorização ECG).</p>
            </div>
         </div>

         {/* Reference Table */}
         <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1">
                    <Info className="w-3 h-3" /> Referência de Apresentação
                </span>
            </div>
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-100 text-slate-600 font-bold text-xs uppercase">
                    <tr>
                        <th className="px-4 py-2">Produto</th>
                        <th className="px-4 py-2">Apresentação</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium text-slate-700">Cloreto de Potássio 10%</td>
                        <td className="px-4 py-3 text-slate-600">1 AMP (10mL) = 13,4 mEq</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium text-slate-700">Cloreto de Potássio 19,1%</td>
                        <td className="px-4 py-3 text-slate-600">1 AMP (10mL) = 25 mEq</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium text-slate-700">Cloreto de Potássio 6% Xarope</td>
                        <td className="px-4 py-3 text-slate-600">15mL = 12 mEq</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium text-slate-700">Cloreto de Potássio 600mg CP</td>
                        <td className="px-4 py-3 text-slate-600">8 mEq / Cápsula</td>
                    </tr>
                </tbody>
            </table>
         </div>
      </div>
  );

  // --- LOGIC DISPATCHERS ---

  const renderHypokalemiaProtocol = () => {
    if (!currentK || isNaN(kVal)) {
        return (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Info className="w-6 h-6 text-slate-400" />
                </div>
                <h4 className="text-slate-700 font-bold mb-1">Informe o nível de Potássio</h4>
                <p className="text-slate-500 text-sm">Insira o valor sérico para visualizar o protocolo.</p>
            </div>
        );
    }

    // CHECK FOR NORMAL RANGE (> 3.4)
    if (kVal > 3.4) {
        return (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800 text-sm font-medium flex items-center gap-2">
                 <CheckCircle className="w-5 h-5 text-green-600" />
                 Potássio dentro dos limites de segurança para este protocolo (&gt; 3,4).
            </div>
        );
    }

    // MILD/MODERATE (3.1 - 3.4)
    if (kVal >= 3.1) {
        return (
            <div className="animate-fadeIn">
                 <div className="bg-purple-100 border border-purple-300 rounded-lg p-3 mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5 text-purple-600" />
                    <h4 className="font-bold text-purple-800">Hipocalemia Leve a Moderada (3,1 - 3,4)</h4>
                 </div>

                 {/* OPTION 1: ORAL */}
                 <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                    {renderSectionHeader('Opção 01', 'Reposição Via Oral', 'text-purple-800 border-purple-200')}
                    <div className="flex items-start gap-3">
                        <Pill className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <div className="w-full">
                           {renderHypoOralOptions()}
                        </div>
                    </div>
                 </div>

                 {/* OPTION 2: IV */}
                 <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    {renderSectionHeader('Opção 02', 'Reposição Endovenosa', 'text-blue-800 border-blue-200')}
                    <p className="text-xs text-blue-600 mb-2 font-medium uppercase tracking-wide">Se impossibilidade de via oral</p>
                    
                    <div className="flex items-start gap-3">
                        <Syringe className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-blue-900 bg-white/60 p-3 rounded border border-blue-100 w-full">
                            <p className="font-bold">Cloreto de Potássio 19,1%</p>
                            <p>15 mL + 895 mL SF 0,9%</p>
                            <p className="text-blue-700 mt-1 text-xs font-semibold">Correr em 4-6 horas em BIC.</p>
                        </div>
                    </div>
                 </div>
                 
                 {renderHypoSafetyNotes()}
            </div>
        );
    }

    // SEVERE (< 3.0)
    // Assuming anything < 3.1 falls here based on prompt logic gap.
    return (
        <div className="animate-fadeIn">
             <div className="bg-red-100 border border-red-300 rounded-lg p-3 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h4 className="font-bold text-red-800">Hipocalemia Grave (&lt; 3,0)</h4>
             </div>

             {/* STEP 1: IV */}
             <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                {renderSectionHeader('Passo 01', 'Reposição Endovenosa', 'text-red-800 border-red-200')}
                
                <div className="space-y-3">
                    {/* Peripheral */}
                    <div className="flex items-start gap-3 bg-white/60 p-3 rounded border border-red-100">
                        <Syringe className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-red-900 w-full">
                            <div className="flex justify-between mb-1">
                                <p className="font-bold">Veia Periférica</p>
                                <span className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded uppercase">Preferencial</span>
                            </div>
                            <p>KCl 19,1% - <span className="font-bold">20 mL</span> + 490 mL SF 0,9%</p>
                            <p className="text-red-700 mt-1 text-xs font-semibold">Correr em 6 horas em BIC.</p>
                        </div>
                    </div>

                    {/* Central */}
                    <div className="flex items-start gap-3 bg-white/60 p-3 rounded border border-red-100">
                        <Activity className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-red-900 w-full">
                            <div className="flex justify-between mb-1">
                                <p className="font-bold">Veia Central</p>
                                <span className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded uppercase">Monitorização</span>
                            </div>
                            <p>KCl 19,1% - <span className="font-bold">20 mL</span> + 480 mL SF 0,9%</p>
                            <p className="text-red-700 mt-1 text-xs font-semibold">Correr em 3-4 horas em BIC.</p>
                        </div>
                    </div>
                </div>
             </div>

             {/* STEP 2: ORAL */}
             <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                {renderSectionHeader('Passo 02', 'Associar Via Oral', 'text-purple-800 border-purple-200')}
                <div className="flex items-start gap-3">
                    <Pill className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div className="w-full">
                       {renderHypoOralOptions()}
                    </div>
                </div>
             </div>

             {renderHypoSafetyNotes()}
        </div>
    );
  };

  const renderHyperkalemiaProtocol = () => {
    if (!currentK || isNaN(kVal)) {
        return (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Info className="w-6 h-6 text-slate-400" />
                </div>
                <h4 className="text-slate-700 font-bold mb-1">Informe o nível de Potássio</h4>
                <p className="text-slate-500 text-sm">Insira o valor sérico para visualizar o protocolo.</p>
            </div>
        );
    }

    // RANGE: 5.6 to 5.9 (Mild)
    if (kVal >= 5.6 && kVal <= 5.9) {
        return (
            <div className="space-y-4 animate-fadeIn">
                 <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4">
                    <h4 className="font-bold text-yellow-800 mb-2">Hipercalemia Leve (5,6 - 5,9)</h4>
                    
                    <div className="bg-white rounded p-3 border border-yellow-200">
                        <p className="text-sm font-semibold text-slate-700 mb-3">
                            Existe alteração no eletrocardiograma?
                            <span className="block text-xs font-normal text-slate-500 mt-1">
                                (Ex: Ondas T apiculadas, encurtamento QT, intervalos PR, aumento QRS)
                            </span>
                        </p>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setHasEcgChanges(true)}
                                className={`flex-1 py-2.5 rounded-md font-bold text-sm border flex items-center justify-center gap-2 transition-all
                                ${hasEcgChanges === true 
                                    ? 'bg-red-600 text-white border-red-600 shadow-md ring-2 ring-red-200 ring-offset-1' 
                                    : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:border-red-300'}`}
                            >
                                <CheckCircle className="w-4 h-4" /> SIM
                            </button>
                            <button 
                                onClick={() => setHasEcgChanges(false)}
                                className={`flex-1 py-2.5 rounded-md font-bold text-sm border flex items-center justify-center gap-2 transition-all
                                ${hasEcgChanges === false 
                                    ? 'bg-green-600 text-white border-green-600 shadow-md ring-2 ring-green-200 ring-offset-1' 
                                    : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:border-green-300'}`}
                            >
                                <XCircle className="w-4 h-4" /> NÃO
                            </button>
                        </div>
                    </div>
                 </div>

                 {hasEcgChanges === true && (
                    <div className="animate-fadeIn">
                        <div className="mb-2 text-xs font-bold text-red-600 uppercase">Conduta: Tratamento Completo</div>
                        {renderStabilization()}
                        {renderRedistribution()}
                        {renderElimination("2 sachês de 12/12h de manutenção", "Passo 03")}
                    </div>
                 )}

                 {hasEcgChanges === false && (
                    <div className="animate-fadeIn">
                        <div className="mb-2 text-xs font-bold text-yellow-600 uppercase">Conduta: Conservadora</div>
                        {renderSuspension()}
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                            {renderSectionHeader('Passo 02', 'Eliminação do Potássio', 'text-green-800 border-green-200')}
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Pill className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                    <div className="text-sm text-green-900">
                                        <p className="font-bold">Diurético de Alça</p>
                                        <p>Furosemida (20mg/2mL): 1 a 2 mg/kg EV em bolus, até 4/4h.</p>
                                    </div>
                                </div>
                                <div className="border-t border-green-200 pt-2">
                                    <p className="text-xs font-bold text-green-700 uppercase mb-2">Quelantes (Opcional)</p>
                                    <div className="bg-white/60 p-2 rounded space-y-2">
                                         <div>
                                            <p className="font-bold text-sm text-green-900">Sorcal® (30g)</p>
                                            <p className="text-sm text-green-800">15g + 100mL água VO 6/6h</p>
                                         </div>
                                         <div className="border-t border-green-100 pt-2">
                                            <p className="font-bold text-sm text-green-900">Lokelma® (5g)</p>
                                            <p className="text-sm text-green-800">2 sachês 8/8h (24h)</p>
                                            <p className="text-sm font-bold text-green-900">Manutenção: 1 sachê 12/12h</p>
                                         </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                 )}
            </div>
        );
    }

    // RANGE: 6.0 to 6.4 (Moderate)
    if (kVal >= 6.0 && kVal <= 6.4) {
        return (
            <div className="animate-fadeIn">
                 <div className="bg-orange-100 border border-orange-300 rounded-lg p-3 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    <h4 className="font-bold text-orange-800">Hipercalemia Moderada (6,0 - 6,4)</h4>
                 </div>
                 {renderStabilization()}
                 {renderRedistribution()}
                 {renderElimination("2 sachês de 12/12h de manutenção", "Passo 03", true)}
            </div>
        );
    }

    // RANGE: >= 6.5 (Severe)
    if (kVal >= 6.5) {
        return (
            <div className="animate-fadeIn">
                 <div className="bg-red-100 border border-red-300 rounded-lg p-3 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <h4 className="font-bold text-red-800">Hipercalemia Grave (≥ 6,5)</h4>
                 </div>
                 {renderStabilization()}
                 {renderRedistribution()}
                 {renderElimination("2 sachês de 12/12h de manutenção", "Passo 03", true)}
            </div>
        );
    }

    return (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800 text-sm flex items-center gap-2">
             <CheckCircle className="w-5 h-5 text-green-600" />
             Potássio dentro dos limites de segurança para este protocolo (&lt; 5,6).
        </div>
    );
  };


  return (
    <div className="space-y-4">
      {/* Tab Switcher */}
      <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-sm flex">
        <button
          onClick={() => { setActiveTab('hypo'); setCurrentK(''); setHasEcgChanges(null); }}
          className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2
            ${activeTab === 'hypo' 
              ? 'bg-purple-600 text-white shadow-sm' 
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
        >
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
            <span className="flex items-center gap-1"><span className="text-lg">↓</span> Hipocalemia</span>
            <span className={`text-xs font-normal ${activeTab === 'hypo' ? 'text-purple-100' : 'text-slate-400'}`}>(K &lt; 3,5)</span>
          </div>
        </button>
        <button
          onClick={() => { setActiveTab('hyper'); setCurrentK(''); setHasEcgChanges(null); }}
          className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2
            ${activeTab === 'hyper' 
              ? 'bg-red-600 text-white shadow-sm' 
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
        >
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
            <span className="flex items-center gap-1"><span className="text-lg">↑</span> Hipercalemia</span>
            <span className={`text-xs font-normal ${activeTab === 'hyper' ? 'text-red-100' : 'text-slate-400'}`}>(K &gt; 5,5)</span>
          </div>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className={`p-4 border-b ${activeTab === 'hypo' ? 'bg-purple-50 border-purple-100' : 'bg-red-50 border-red-100'}`}>
            <h3 className={`font-bold flex items-center gap-2 ${activeTab === 'hypo' ? 'text-purple-800' : 'text-red-800'}`}>
              <Calculator className="w-5 h-5" />
              {activeTab === 'hypo' ? 'Manejo da Hipocalemia' : 'Manejo da Hipercalemia'}
            </h3>
            <p className={`text-xs mt-1 ${activeTab === 'hypo' ? 'text-purple-600' : 'text-red-600'}`}>
               {activeTab === 'hypo' 
                 ? 'Protocolo para reposição de cloreto de potássio.' 
                 : 'Protocolo de redução dos níveis de potássio sérico.'}
            </p>
          </div>

          <div className="p-4 sm:p-6 space-y-6">
            
            {/* Input K+ */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Potássio Sérico Atual (K+)</label>
              <div className="relative max-w-xs">
                <input 
                  type="number" 
                  value={currentK}
                  onChange={e => {
                      setCurrentK(e.target.value);
                      setHasEcgChanges(null); // Reset triage on change
                  }}
                  className={`w-full border-slate-200 rounded-lg focus:ring-2 border outline-none py-2 px-3 shadow-sm pr-12
                    ${activeTab === 'hypo' ? 'focus:ring-purple-500 focus:border-purple-500' : 'focus:ring-red-500 focus:border-red-500'}`}
                  placeholder="Ex: 6.0"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">mEq/L</span>
              </div>
            </div>

            {/* Logic Content */}
            {activeTab === 'hyper' ? renderHyperkalemiaProtocol() : renderHypokalemiaProtocol()}

          </div>
      </div>
    </div>
  );
};

export default PotassiumCalculator;
