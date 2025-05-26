export interface Subject {
  id: string;
  name: string;
  g1?: string | number;
  g2?: string | number;
  g3?: string | number;
  g4?: string | number;
  isJesus: boolean;
  desiredGrade?: string | number;
}

export interface CalculatedSubject extends Subject {
  finalGrade?: number;
  partialGrade?: number;
  situation: string;
  neededForDesired: number | string;
}

export type GradeField = "g1" | "g2" | "g3" | "g4" | "desiredGrade";
