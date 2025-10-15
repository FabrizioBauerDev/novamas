// Definición de enums con sus labels para uso en formularios
export const ScaleEnum = {
  1: "Muy en desacuerdo",
  2: "En desacuerdo",
  3: "Neutral",
  4: "De acuerdo",
  5: "Muy de acuerdo",
}

export const GenderEnum = {
  MASCULINO: "Masculino",
  FEMENINO: "Femenino",
  OTRO: "Otro",
} as const;

export const CouldntStopEnum = {
  NO: "No",
  NO_ES_SEG: "No estoy seguro/a",
  SI: "Sí",
} as const;

export const PersonalIssuesEnum = {
  NO: "No",
  NO_AP: "No aplica",
  SI: "Sí",
} as const;

export const BooleanEnum = {
  false: "No",
  true: "Sí",
} as const;

// Tipos para garantizar type safety
export type GenderType = keyof typeof GenderEnum;
export type CouldntStopType = keyof typeof CouldntStopEnum;
export type PersonalIssuesType = keyof typeof PersonalIssuesEnum;
export type BooleanType = keyof typeof BooleanEnum;
export type ScaleType = keyof typeof ScaleEnum;

// Función helper para obtener las opciones como array de objetos
export const getEnumOptions = <T extends Record<string, string>>(
  enumObj: T
) => {
  return Object.entries(enumObj).map(([value, label]) => ({
    value: value as keyof T,
    label,
  }));
};
