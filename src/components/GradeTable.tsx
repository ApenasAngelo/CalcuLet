"use client";

import { Info, Plus, RotateCcw } from "lucide-react";

import { GradeRow } from "@/components/GradeRow";
import { GradeSummary } from "@/components/GradeSummary";
import { MobileGradeCard } from "@/components/MobileGradeCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  calculateGrade,
  generateId,
  getInitialSubjects,
} from "@/lib/grade-calculations";
import { Subject } from "@/types";

export function GradeTable() {
  const [subjects, setSubjects] = useLocalStorage<Subject[]>(
    "leticia-grades",
    getInitialSubjects,
  );

  // Calcular as matérias com resultados
  const calculatedSubjects = subjects.map(calculateGrade);

  // Verificar se deve mostrar a coluna "Nota Desejada"
  const shouldShowDesiredGradeColumn = subjects.some((subject) => {
    const calculatedSubject = calculateGrade(subject);
    // Mostrar se a situação não é "Aprovado" nem "Reprovado" (ou seja, ainda precisa de notas)
    return (
      calculatedSubject.situation !== "Aprovado" &&
      calculatedSubject.situation !== "Reprovado"
    );
  });

  // Verificar se existem matérias "Jesus"
  const hasJesusSubjects = subjects.some((s) => s.isJesus);

  const addSubject = () => {
    const newSubject: Subject = {
      id: generateId(),
      name: "",
      isJesus: false,
    };
    setSubjects([...subjects, newSubject]);
  };

  const removeSubject = (id: string) => {
    setSubjects(subjects.filter((subject) => subject.id !== id));
  };

  const updateSubject = (id: string, updates: Partial<Subject>) => {
    setSubjects(
      subjects.map((subject) =>
        subject.id === id ? { ...subject, ...updates } : subject,
      ),
    );
  };

  const clearTable = () => {
    setSubjects(getInitialSubjects());
  };

  return (
    <Card className="bg-background w-full border shadow-lg">
      <CardContent className="p-6">
        {/* Layout Desktop - Tabela */}
        <div className="hidden overflow-x-auto rounded-md border lg:block">
          <Table className="w-full table-fixed">
            <TableHeader>
              <TableRow className="bg-muted/50 text-xs md:text-sm">
                <TableHead className="w-[300px] max-w-[300px] font-semibold">
                  Matéria
                </TableHead>
                <TableHead className="w-[80px] text-center font-semibold">
                  <div className="flex items-center justify-center gap-1">
                    É Jesus?
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="text-muted-foreground h-3 w-3 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="text-sm">
                            <strong>Critério 5:</strong>
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
                </TableHead>
                <TableHead className="w-[80px] text-center font-semibold">
                  G1
                </TableHead>
                <TableHead className="w-[80px] text-center font-semibold">
                  G2
                </TableHead>
                {hasJesusSubjects && (
                  <>
                    <TableHead className="w-[80px] text-center font-semibold">
                      G3
                    </TableHead>
                    <TableHead className="w-[80px] text-center font-semibold">
                      G4
                    </TableHead>
                  </>
                )}
                {shouldShowDesiredGradeColumn && (
                  <TableHead className="w-[120px] text-center font-semibold">
                    Nota Desejada
                  </TableHead>
                )}
                <TableHead className="w-[80px] text-center font-semibold">
                  Média Final
                </TableHead>
                <TableHead className="w-[120px] text-center font-semibold">
                  Situação
                </TableHead>
                <TableHead className="w-[60px] text-center font-semibold">
                  Ação
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjects.map((subject) => (
                <GradeRow
                  key={subject.id}
                  subject={subject}
                  onUpdate={(updates: Partial<Subject>) =>
                    updateSubject(subject.id, updates)
                  }
                  onRemove={() => removeSubject(subject.id)}
                  canRemove={subjects.length > 1}
                  shouldShowDesiredGradeColumn={shouldShowDesiredGradeColumn}
                  hasJesusSubjects={hasJesusSubjects}
                />
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Layout Mobile - Cards */}
        <div className="space-y-4 lg:hidden">
          {subjects.map((subject) => (
            <MobileGradeCard
              key={subject.id}
              subject={subject}
              onUpdate={(updates: Partial<Subject>) =>
                updateSubject(subject.id, updates)
              }
              onRemove={() => removeSubject(subject.id)}
              canRemove={subjects.length > 1}
            />
          ))}
        </div>
        <div className="mt-6 flex flex-col justify-center gap-4 sm:flex-row">
          <Button onClick={addSubject} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Adicionar Matéria
          </Button>
          <Button
            onClick={clearTable}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Limpar Tabela
          </Button>
        </div>

        <GradeSummary calculatedSubjects={calculatedSubjects} />
      </CardContent>
    </Card>
  );
}
