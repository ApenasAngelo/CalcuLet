"use client";

import { ChartNoAxesColumnIcon } from "lucide-react";

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
    if (avg >= 8) return "text-emerald-500 dark:text-emerald-400";
    if (avg >= 6) return "text-sky-500 dark:text-sky-400";
    if (avg >= 5) return "text-amber-500 dark:text-amber-400";
    return "text-rose-500 dark:text-rose-400";
  };

  return (
    <Card className="mt-6 w-full">
      <CardHeader>
        <CardTitle className="text-center text-xl font-semibold">
          <ChartNoAxesColumnIcon className="mr-2 inline-block h-6 w-6" />
          Resumo Geral
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-500 dark:text-emerald-400">
              {approved}
            </div>
            <div className="text-muted-foreground text-sm">Aprovadas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-rose-500 dark:text-rose-400">
              {failed}
            </div>
            <div className="text-muted-foreground text-sm">Reprovadas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-500 dark:text-gray-400">
              {pending}
            </div>
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
                className="border-emerald-200 bg-emerald-400/80 text-emerald-900 hover:bg-emerald-400 dark:border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-300"
              >
                {approved} Aprovada{approved !== 1 ? "s" : ""}
              </Badge>
            )}
            {failed > 0 && (
              <Badge
                variant="destructive"
                className="border-rose-200 bg-rose-400/80 text-rose-900 hover:bg-rose-400 dark:border-rose-500/30 dark:bg-rose-500/20 dark:text-rose-300"
              >
                {failed} Reprovada{failed !== 1 ? "s" : ""}
              </Badge>
            )}
            {pending > 0 && (
              <Badge
                variant="secondary"
                className="border-gray-200 bg-gray-400/80 text-gray-900 hover:bg-gray-400 dark:border-gray-500/30 dark:bg-gray-500/20 dark:text-gray-300"
              >
                {pending} Pendente{pending !== 1 ? "s" : ""}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
