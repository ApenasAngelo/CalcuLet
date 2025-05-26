"use client";

import { Trash2 } from "lucide-react";

import { SubjectCombobox } from "@/components/SubjectCombobox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { calculateGrade } from "@/lib/grade-calculations";
import { CalculatedSubject, Subject } from "@/types";

interface MobileGradeCardProps {
  subject: Subject;
  onUpdate: (updates: Partial<Subject>) => void;
  onRemove: () => void;
  canRemove: boolean;
}

export function MobileGradeCard({
  subject,
  onUpdate,
  onRemove,
  canRemove,
}: MobileGradeCardProps) {
  const calculatedSubject: CalculatedSubject = calculateGrade(subject);

  const handleInputChange = (field: keyof Subject, value: string | boolean) => {
    onUpdate({ [field]: value });
  };

  const handleGradeChange = (
    field: "g1" | "g2" | "g3" | "g4" | "desiredGrade",
    value: string,
  ) => {
    if (
      value !== "" &&
      (isNaN(Number(value)) || Number(value) < 0 || Number(value) > 10)
    ) {
      return;
    }
    onUpdate({ [field]: value });
  };

  const renderGradeInput = (
    field: "g1" | "g2" | "g3" | "g4" | "desiredGrade",
    label: string,
    disabled = false,
  ) => (
    <div className="flex items-center gap-2">
      <label className="min-w-[60px] text-sm font-medium">{label}:</label>
      <Input
        type="number"
        min="0"
        max="10"
        step="0.1"
        value={subject[field] || ""}
        onChange={(e) => handleGradeChange(field, e.target.value)}
        disabled={disabled}
        className="flex-1 text-center [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        placeholder="0-10"
      />
    </div>
  );

  const getSituationBadge = (situation: string) => {
    if (situation === "Aprovado") {
      return (
        <Badge
          variant="default"
          className="border-emerald-200 bg-emerald-400/80 text-emerald-900 hover:bg-emerald-400 dark:border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-300"
        >
          Aprovado
        </Badge>
      );
    }
    if (situation === "Reprovado") {
      return (
        <Badge
          variant="destructive"
          className="border-rose-200 bg-rose-400/80 text-rose-900 hover:bg-rose-400 dark:border-rose-500/30 dark:bg-rose-500/20 dark:text-rose-300"
        >
          Reprovado
        </Badge>
      );
    }
    return (
      <Badge
        variant="secondary"
        className="border-gray-200 bg-gray-400/80 text-xs text-gray-900 hover:bg-gray-400 dark:border-gray-500/30 dark:bg-gray-500/20 dark:text-gray-300"
      >
        {situation}
      </Badge>
    );
  };

  const showNeededGrades =
    !subject.isJesus &&
    ((subject.g1 && !subject.g2) ||
      (!subject.g1 && subject.g2) ||
      (!subject.g1 &&
        !subject.g2 &&
        calculatedSubject.situation === "Preencha G1 e G2"));

  // Para matérias "Jesus", mostrar "o que precisa" quando falta apenas uma nota entre G1, G2, G3
  const showNeededGradesJesus =
    subject.isJesus &&
    ((subject.g1 && subject.g2 && !subject.g3) ||
      (subject.g1 && !subject.g2 && subject.g3) ||
      (!subject.g1 && subject.g2 && subject.g3));

  // Verificar se o input de "Nota Desejada" deve ser desabilitado
  const shouldDisableDesiredGrade = () => {
    if (subject.isJesus) {
      // Para matérias "Jesus", desabilitar se G1, G2 e G3 estão preenchidas
      return !!(subject.g1 && subject.g2 && subject.g3);
    } else {
      // Para matérias normais, desabilitar se G1 e G2 estão preenchidas
      return !!(subject.g1 && subject.g2);
    }
  };

  // Verificar se deve mostrar a seção "Nota Desejada" para este card específico
  const shouldShowDesiredGradeForThisCard = () => {
    // Só mostrar se a situação não for final (aprovado/reprovado)
    return (
      calculatedSubject.situation !== "Aprovado" &&
      calculatedSubject.situation !== "Reprovado"
    );
  };

  return (
    <Card className="bg-background w-full border shadow-lg">
      <CardContent className="space-y-4 p-4">
        {/* Nome da matéria */}
        <div className="flex items-center gap-2">
          <SubjectCombobox
            value={subject.name}
            onValueChange={(value) => handleInputChange("name", value)}
            placeholder="Selecione uma matéria"
            className="flex-1"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={onRemove}
            disabled={!canRemove}
            className="h-9 w-9 p-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Checkbox Jesus com tooltip */}
        <div className="flex items-center gap-2">
          <Checkbox
            checked={subject.isJesus}
            onCheckedChange={(checked) =>
              handleInputChange("isJesus", checked === true)
            }
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-help text-sm font-medium underline decoration-dotted">
                  É Jesus?
                </span>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-sm">
                  <strong>Critério &quot;Jesus&quot;:</strong>
                  <br />
                  • Precisa G1, G2 e G3
                  <br />
                  • Aprovado se: (G1≥5 E G2≥5 E G3≥5) OU média≥6
                  <br />• Senão: faz G4 com regras especiais
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Notas */}
        <div
          className={`grid gap-3 ${subject.isJesus ? "grid-cols-2" : "grid-cols-2"}`}
        >
          {renderGradeInput("g1", "G1")}
          {renderGradeInput("g2", "G2")}
          {subject.isJesus && (
            <>
              {renderGradeInput("g3", "G3")}
              {renderGradeInput("g4", "G4")}
            </>
          )}
        </div>

        {/* Resultado */}
        <div className="bg-muted/50 flex items-center justify-between rounded-md p-2">
          <div className="text-sm">
            <span className="font-medium">Média: </span>
            {calculatedSubject.finalGrade !== undefined ? (
              <span className="font-bold">
                {calculatedSubject.finalGrade.toFixed(2)}
              </span>
            ) : calculatedSubject.partialGrade !== undefined ? (
              <span className="text-muted-foreground font-medium">
                {calculatedSubject.partialGrade.toFixed(2)}*
              </span>
            ) : (
              <span className="text-muted-foreground">-</span>
            )}
          </div>
          <div>{getSituationBadge(calculatedSubject.situation)}</div>
        </div>

        {/* Cálculos de "o que precisa" - No mobile, só mostrar se a situação não for final para este card */}
        {shouldShowDesiredGradeForThisCard() && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Nota Desejada:</div>
            <div className="space-y-2">
              {renderGradeInput(
                "desiredGrade",
                "Meta",
                shouldDisableDesiredGrade(),
              )}
              {showNeededGrades &&
                subject.desiredGrade &&
                !shouldDisableDesiredGrade() && (
                  <div className="bg-muted/30 rounded-md p-2 text-center text-sm">
                    <span className="text-muted-foreground">Precisa: </span>
                    <span className="font-medium">
                      {calculatedSubject.neededForDesired}
                    </span>
                  </div>
                )}
              {showNeededGradesJesus &&
                subject.desiredGrade &&
                !shouldDisableDesiredGrade() && (
                  <div className="bg-muted/30 rounded-md p-2 text-center text-sm">
                    <span className="text-muted-foreground">Precisa: </span>
                    <span className="font-medium">
                      {calculatedSubject.neededForDesired}
                    </span>
                  </div>
                )}
              {subject.isJesus &&
                subject.desiredGrade &&
                calculatedSubject.situation === "Precisa G4" && (
                  <div className="bg-muted/30 rounded-md p-2 text-center text-sm">
                    <span className="text-muted-foreground">Precisa G4: </span>
                    <span className="font-medium">
                      {calculatedSubject.neededForDesired}
                    </span>
                  </div>
                )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
