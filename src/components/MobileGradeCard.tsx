"use client";

import { Trash2 } from "lucide-react";

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
  shouldShowDesiredGradeColumn: boolean;
  hasJesusSubjects: boolean;
}

export function MobileGradeCard({
  subject,
  onUpdate,
  onRemove,
  canRemove,
  shouldShowDesiredGradeColumn,
  hasJesusSubjects,
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
        <Badge variant="default" className="bg-green-500 hover:bg-green-600">
          Aprovado
        </Badge>
      );
    }
    if (situation === "Reprovado") {
      return <Badge variant="destructive">Reprovado</Badge>;
    }
    return (
      <Badge variant="secondary" className="text-xs">
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

  return (
    <Card className="bg-background w-full border shadow-lg">
      <CardContent className="space-y-4 p-4">
        {/* Nome da matéria */}
        <div className="flex items-center gap-2">
          <Input
            value={subject.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="Nome da matéria"
            className="flex-1 font-medium"
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
          className={`grid gap-3 ${hasJesusSubjects ? "grid-cols-2" : "grid-cols-2"}`}
        >
          {renderGradeInput("g1", "G1")}
          {renderGradeInput("g2", "G2")}
          {hasJesusSubjects && (
            <>
              {subject.isJesus ? (
                renderGradeInput("g3", "G3")
              ) : (
                <div className="flex items-center gap-2">
                  <label className="text-muted-foreground min-w-[60px] text-sm font-medium">
                    G3:
                  </label>
                  <div className="text-muted-foreground flex-1 text-center text-xs">
                    -
                  </div>
                </div>
              )}
              {subject.isJesus ? (
                renderGradeInput("g4", "G4")
              ) : (
                <div className="flex items-center gap-2">
                  <label className="text-muted-foreground min-w-[60px] text-sm font-medium">
                    G4:
                  </label>
                  <div className="text-muted-foreground flex-1 text-center text-xs">
                    -
                  </div>
                </div>
              )}
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

        {/* Cálculos de "o que precisa" */}
        {shouldShowDesiredGradeColumn && (
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
