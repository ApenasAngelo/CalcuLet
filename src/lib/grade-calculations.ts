import { CalculatedSubject, Subject } from "@/types";

const parseNum = (value: string | number | undefined): number | undefined => {
  if (value === undefined || value === "") return undefined;
  const num = Number(value);
  return isNaN(num) ? undefined : num;
};

export function calculateGrade(subject: Subject): CalculatedSubject {
  const g1 = parseNum(subject.g1);
  const g2 = parseNum(subject.g2);
  const g3 = parseNum(subject.g3);
  const g4 = parseNum(subject.g4);
  const desiredGrade = parseNum(subject.desiredGrade);

  let finalGrade: number | undefined = undefined;
  let partialGrade: number | undefined = undefined; // Nova propriedade para médias parciais
  let situation: string = "-";
  let neededForDesired: number | string = "-";

  // Função para calcular média parcial (considerando notas vazias como 0)
  const calculatePartialGrade = () => {
    if (subject.isJesus) {
      // Para critério Jesus, usar a fórmula (G1 + G2 + G3) / 3, tratando vazios como 0
      if (g1 !== undefined || g2 !== undefined || g3 !== undefined) {
        const grade1 = g1 ?? 0;
        const grade2 = g2 ?? 0;
        const grade3 = g3 ?? 0;
        return (grade1 + grade2 + grade3) / 3;
      }
    } else {
      // Para critério padrão, usar a fórmula (G1 + G2*2) / 3, tratando vazios como 0
      if (g1 !== undefined || g2 !== undefined) {
        const grade1 = g1 ?? 0;
        const grade2 = g2 ?? 0;
        return (grade1 + grade2 * 2) / 3;
      }
    }
    return undefined;
  };

  // Calcular média parcial sempre que houver pelo menos uma nota
  partialGrade = calculatePartialGrade();

  if (subject.isJesus) {
    // Critério "Jesus"
    if (g1 !== undefined && g2 !== undefined && g3 !== undefined) {
      const nfJesusInitial = (g1 + g2 + g3) / 3;
      if ((g1 >= 5 && g2 >= 5 && g3 >= 5) || nfJesusInitial >= 6) {
        finalGrade = nfJesusInitial;
      } else {
        // Precisa de G4
        if (g4 !== undefined) {
          const grades = [g1, g2, g3].sort((a, b) => b - a);
          const gm = grades[0];
          const gn = grades[1];
          if (g4 >= 3) {
            finalGrade = (gm + gn + g4) / 3;
          } else {
            finalGrade = (g1 + g2 + g3 + g4 * 3) / 6;
          }
        } else {
          situation = "Precisa G4";
          // Calcular nota necessária em G4 para aprovação
          if (desiredGrade !== undefined) {
            // Para calcular G4 necessário, considerando as duas estratégias
            const targetMedia = desiredGrade;
            const grades = [g1, g2, g3].sort((a, b) => b - a);
            const gm = grades[0];
            const gn = grades[1];

            // Estratégia 1: G4 >= 3 e MÉDIA = (Gm + Gn + G4) / 3
            const g4Strategy1 = targetMedia * 3 - gm - gn;

            // Estratégia 2: G4 < 3 e MÉDIA = (G1 + G2 + G3 + G4*3) / 6
            const g4Strategy2 = (targetMedia * 6 - g1 - g2 - g3) / 3;

            // Escolher a estratégia mais favorável
            let bestG4 = Math.min(g4Strategy1, g4Strategy2);

            // Se G4 strategy1 é >= 3 e é menor que strategy2, usar strategy1
            if (g4Strategy1 >= 3 && g4Strategy1 <= g4Strategy2) {
              bestG4 = g4Strategy1;
            } else if (g4Strategy2 < 3 && g4Strategy2 >= 0) {
              bestG4 = g4Strategy2;
            }

            neededForDesired = formatNeededGrade(bestG4);
          }
        }
      }
    } else {
      // Determinar quais notas estão faltando
      const missingGrades = [];
      if (g1 === undefined) missingGrades.push("G1");
      if (g2 === undefined) missingGrades.push("G2");
      if (g3 === undefined) missingGrades.push("G3");

      if (missingGrades.length === 3) {
        situation = "Preencha G1, G2, G3";
      } else if (missingGrades.length === 2) {
        situation = `Precisa ${missingGrades.join(" e ")}`;
      } else if (missingGrades.length === 1) {
        situation = `Precisa ${missingGrades[0]}`;

        // Calcular nota necessária para a nota faltante se possível
        if (desiredGrade !== undefined) {
          const targetMedia = desiredGrade;

          if (g3 === undefined && g1 !== undefined && g2 !== undefined) {
            // Falta G3: precisa calcular G3 necessário para NF = (G1 + G2 + G3) / 3 >= targetMedia
            const neededG3 = targetMedia * 3 - g1 - g2;
            neededForDesired = formatNeededGrade(neededG3);
          } else if (g2 === undefined && g1 !== undefined && g3 !== undefined) {
            // Falta G2: precisa calcular G2 necessário
            const neededG2 = targetMedia * 3 - g1 - g3;
            neededForDesired = formatNeededGrade(neededG2);
          } else if (g1 === undefined && g2 !== undefined && g3 !== undefined) {
            // Falta G1: precisa calcular G1 necessário
            const neededG1 = targetMedia * 3 - g2 - g3;
            neededForDesired = formatNeededGrade(neededG1);
          }
        }
      }
    }
  } else {
    // Critério Padrão
    if (g1 !== undefined && g2 !== undefined) {
      finalGrade = (g1 + g2 * 2) / 3;
    } else if (g1 !== undefined && g2 === undefined) {
      situation = "Precisa G2";
      const calcG2 = (target: number) => (target * 3 - g1) / 2;
      if (desiredGrade !== undefined) {
        neededForDesired = formatNeededGrade(calcG2(desiredGrade));
      }
    } else if (g1 === undefined && g2 !== undefined) {
      situation = "Precisa G1";
      const calcG1 = (target: number) => target * 3 - g2 * 2;
      if (desiredGrade !== undefined) {
        neededForDesired = formatNeededGrade(calcG1(desiredGrade));
      }
    } else {
      situation = "Preencha G1 e G2";
    }
  }

  if (finalGrade !== undefined) {
    finalGrade = parseFloat(finalGrade.toFixed(2)); // Arredondar para 2 casas decimais
    situation = finalGrade >= 5 ? "Aprovado" : "Reprovado";
  }

  return {
    ...subject,
    g1: subject.g1, // Manter string para o input
    g2: subject.g2,
    g3: subject.g3,
    g4: subject.g4,
    desiredGrade: subject.desiredGrade,
    finalGrade,
    partialGrade:
      partialGrade !== undefined
        ? parseFloat(partialGrade.toFixed(2))
        : undefined,
    situation,
    neededForDesired,
  };
}

function formatNeededGrade(grade: number): string {
  if (grade < 0 || grade > 10) return "Impossível";
  return grade.toFixed(2);
}

// Sistema de ID incremental
let nextId = 1;

export function generateId(): string {
  return `subject-${nextId++}`;
}

export function getInitialSubjects(): Subject[] {
  return [
    { id: generateId(), name: "", isJesus: false },
    { id: generateId(), name: "", isJesus: false },
    { id: generateId(), name: "", isJesus: false },
  ];
}
