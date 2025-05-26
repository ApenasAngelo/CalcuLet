"use client";

import { Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import { calculateGrade } from "@/lib/grade-calculations";
import { CalculatedSubject, Subject } from "@/types";

interface GradeRowProps {
  subject: Subject;
  onUpdate: (updates: Partial<Subject>) => void;
  onRemove: () => void;
  canRemove: boolean;
  shouldShowDesiredGradeColumn: boolean;
  hasJesusSubjects: boolean;
}

export function GradeRow({
  subject,
  onUpdate,
  onRemove,
  canRemove,
  shouldShowDesiredGradeColumn,
  hasJesusSubjects,
}: GradeRowProps) {
  const calculatedSubject: CalculatedSubject = calculateGrade(subject);

  const handleInputChange = (field: keyof Subject, value: string | boolean) => {
    onUpdate({ [field]: value });
  };

  const handleGradeChange = (
    field: "g1" | "g2" | "g3" | "g4" | "desiredGrade",
    value: string,
  ) => {
    // Validação básica - apenas números entre 0 e 10
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
    disabled = false,
  ) => (
    <Input
      type="number"
      min="0"
      max="10"
      step="0.1"
      value={subject[field] || ""}
      onChange={(e) => handleGradeChange(field, e.target.value)}
      disabled={disabled}
      className="w-full text-center text-sm [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      placeholder="0-10"
    />
  );

  const renderNeededGrade = (value: number | string) => {
    if (value === "-" || value === "Impossível") {
      return <span className="text-muted-foreground text-xs">{value}</span>;
    }
    return <span className="text-xs font-medium">{value}</span>;
  };

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
    <TableRow className="hover:bg-muted/50">
      <TableCell className="p-2">
        <Input
          value={subject.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          placeholder="Nome da matéria"
          className="min-w-[120px] text-sm"
        />
      </TableCell>

      <TableCell className="p-2">
        <div className="flex items-center justify-center">
          <Checkbox
            checked={subject.isJesus}
            onCheckedChange={(checked) =>
              handleInputChange("isJesus", checked === true)
            }
          />
        </div>
      </TableCell>

      <TableCell className="p-2">{renderGradeInput("g1")}</TableCell>

      <TableCell className="p-2">{renderGradeInput("g2")}</TableCell>

      {hasJesusSubjects && (
        <>
          <TableCell className="p-2">
            {subject.isJesus ? (
              renderGradeInput("g3")
            ) : (
              <div className="text-center">
                <span className="text-muted-foreground text-xs">-</span>
              </div>
            )}
          </TableCell>

          <TableCell className="p-2">
            {subject.isJesus ? (
              renderGradeInput("g4")
            ) : (
              <div className="text-center">
                <span className="text-muted-foreground text-xs">-</span>
              </div>
            )}
          </TableCell>
        </>
      )}

      {shouldShowDesiredGradeColumn && (
        <TableCell className="p-2">
          <div className="space-y-1">
            {renderGradeInput("desiredGrade", shouldDisableDesiredGrade())}
            {showNeededGrades &&
              subject.desiredGrade &&
              !shouldDisableDesiredGrade() && (
                <div className="text-center">
                  {renderNeededGrade(calculatedSubject.neededForDesired)}
                </div>
              )}
            {showNeededGradesJesus &&
              subject.desiredGrade &&
              !shouldDisableDesiredGrade() && (
                <div className="text-center">
                  {renderNeededGrade(calculatedSubject.neededForDesired)}
                </div>
              )}
            {subject.isJesus &&
              subject.desiredGrade &&
              calculatedSubject.situation === "Precisa G4" && (
                <div className="text-center">
                  {renderNeededGrade(calculatedSubject.neededForDesired)}
                </div>
              )}
          </div>
        </TableCell>
      )}

      <TableCell className="p-2 text-center">
        {calculatedSubject.finalGrade !== undefined ? (
          <span className="text-sm font-semibold">
            {calculatedSubject.finalGrade.toFixed(2)}
          </span>
        ) : calculatedSubject.partialGrade !== undefined ? (
          <span className="text-muted-foreground text-sm font-medium">
            {calculatedSubject.partialGrade.toFixed(2)}*
          </span>
        ) : (
          <span className="text-muted-foreground text-xs">-</span>
        )}
      </TableCell>

      <TableCell className="p-2 text-center">
        {getSituationBadge(calculatedSubject.situation)}
      </TableCell>

      <TableCell className="p-2 text-center">
        <Button
          variant="outline"
          size="sm"
          onClick={onRemove}
          disabled={!canRemove}
          className="h-8 w-8 p-0"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}
