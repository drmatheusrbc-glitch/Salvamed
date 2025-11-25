
export enum CalculationType {
  Continuous = 'continuous', // Infusion (mL/h <-> Dose)
  Bolus = 'bolus'            // One time (mL <-> Dose)
}

export enum UnitType {
  McgKgMin = 'mcg/kg/min',
  McgMin = 'mcg/min',
  UMin = 'U/min',
  MgKgH = 'mg/kg/h',
  McgKgH = 'mcg/kg/h',
  MgKg = 'mg/kg', // For Bolus
  McgKg = 'mcg/kg', // For Bolus
  None = 'none'
}

export interface Drug {
  id: string;
  name: string; // Display name (e.g. "Noradrenalina")
  groupName: string; // For grouping variants (e.g. "Noradrenalina")
  variantLabel?: string; // e.g. "Padrão (64 mcg/mL)"
  category: string;
  presentation: string; // "Apresentação"
  dilution: string;     // "Diluição"
  concentrationString: string; // "Concentração" (Display)
  doseString: string;   // "Dose" (Display)
  notes?: string;       // "Notas"
  
  // Math properties
  type: CalculationType;
  concentrationVal: number; // The numeric value of concentration
  concentrationUnit: 'mcg/ml' | 'mg/ml' | 'U/ml';
  doseUnit: UnitType;
  isWeightBased: boolean; // False for things like Adrenaline (mcg/min) or Vasopressin (U/min)
}

export interface Category {
  id: string;
  name: string;
  color: string;
}
