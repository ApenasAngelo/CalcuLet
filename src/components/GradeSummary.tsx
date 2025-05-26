"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalculatedSubject } from "@/types";

interface GradeSummaryProps {
  calculatedSubjects: CalculatedSubject[];
}

export function GradeSummary({ calculatedSubjects }: GradeSummaryProps) {
  // Matérias com nome preenchido e pelo menos uma nota
  const subjectsWithGrades = calculatedSubjects.filter(
    (subject) =>
      subject.name.trim() !== "" &&
      (subject.finalGrade !== undefined || subject.partialGrade !== undefined),
  );

  if (subjectsWithGrades.length === 0) {
    return null;
  }

  // Matérias com nota final calculada (completas)
  const completedSubjects = subjectsWithGrades.filter(
    (subject) => subject.finalGrade !== undefined,
  );

  // Contadores para o resumo
  const approved = completedSubjects.filter(
    (subject) => subject.situation === "Aprovado",
  ).length;
  const failed = completedSubjects.filter(
    (subject) => subject.situation === "Reprovado",
  ).length;

  // Pendentes incluem: matérias incompletas (só partialGrade) + matérias completas mas não aprovadas/reprovadas
  const incompleteSubjects = subjectsWithGrades.filter(
    (subject) =>
      subject.finalGrade === undefined && subject.partialGrade !== undefined,
  ).length;
  const pendingCompleted = completedSubjects.filter(
    (subject) =>
      subject.situation !== "Aprovado" && subject.situation !== "Reprovado",
  ).length;
  const pending = incompleteSubjects + pendingCompleted;

  // Calcular média geral apenas com matérias completas
  const totalGrades = completedSubjects.reduce(
    (sum, subject) => sum + (subject.finalGrade || 0),
    0,
  );
  const averageGrade =
    completedSubjects.length > 0 ? totalGrades / completedSubjects.length : 0;

  const getAverageColor = (avg: number) => {
    if (avg >= 8) return "text-green-600 dark:text-green-400";
    if (avg >= 6) return "text-blue-600 dark:text-blue-400";
    if (avg >= 5) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <Card className="mt-6 w-full">
      <CardHeader>
        <CardTitle className="text-center text-xl font-semibold">
          📊 Resumo Geral
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{approved}</div>
            <div className="text-muted-foreground text-sm">Aprovadas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{failed}</div>
            <div className="text-muted-foreground text-sm">Reprovadas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{pending}</div>
            <div className="text-muted-foreground text-sm">Pendentes</div>
          </div>
          <div className="text-center">
            <div
              className={`text-2xl font-bold ${getAverageColor(averageGrade)}`}
            >
              {completedSubjects.length > 0 ? averageGrade.toFixed(2) : "-"}
            </div>
            <div className="text-muted-foreground text-sm">Média Geral</div>
          </div>
        </div>

        {subjectsWithGrades.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2">
            {approved > 0 && (
              <Badge
                variant="default"
                className="bg-green-500 hover:bg-green-600"
              >
                {approved} Aprovada{approved !== 1 ? "s" : ""}
              </Badge>
            )}
            {failed > 0 && (
              <Badge variant="destructive">
                {failed} Reprovada{failed !== 1 ? "s" : ""}
              </Badge>
            )}
            {pending > 0 && (
              <Badge variant="secondary">
                {pending} Pendente{pending !== 1 ? "s" : ""}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
