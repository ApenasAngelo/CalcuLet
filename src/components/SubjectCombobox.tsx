"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

// Lista de disciplinas do curso de Psicologia
const subjects = [
  "O Humano e o Fenômeno Religioso",
  "Aprendizagem e Memória",
  "Laboratório de Aprendizagem e Memória",
  "Fundamentos em Neurociências",
  "Teorias da Personalidade",
  "Epistemologia Científica",
  "Psicologia do Desenvolvimento I",
  "Optativas de Cristianismo",
  "Sensação e Percepção",
  "Laboratório de Sensação e Percepção",
  "Bases Biológicas do Comportamento",
  "Laboratório de Bases Biológicas do Comportamento",
  "História da Psicologia Moderna",
  "Psicanálise I",
  "Métodos Quantitativos",
  "Laboratório de Métodos Quantitativos",
  "Optativas de Filosofia - Núcleo Básico CTCH",
  "Motivação e Emoção",
  "Laboratório de Motivação e Emoção",
  "Psicologia Social: Processos Individuais",
  "Métodos Qualitativos",
  "Laboratório de Métodos Qualitativos",
  "Psicometria",
  "Laboratório de Psicometria",
  "Técnicas de observação e Entrevista",
  "Desenvolvimento Atípico e Inclusão",
  "Análise e Produção do Texto Acadêmico",
  "Pensamento e Linguagem",
  "Laboratório de Pensamento e Linguagem",
  "Psicopatologia",
  "Psicanálise II",
  "Neuropsicologia",
  "Psicologia do Desenvolvimento II",
  "Prática Em Pesquisa: Métodos Quantitativos",
  "Ética Cristã",
  "Transtornos Mentais II",
  "Psicologia e Saúde: Psicologia Hospitalar",
  "Estágio Básico em Psicologia Social",
  "Linguagem e Subjetividade",
  "Prática Em Pesquisa: Métodos Qualitativos",
  "Psicologia e Instituições",
  "Psicologia Social: Processos Grupais",
  "Ética Socioambiental e Direitos Humanos",
  "Transtornos Mentais I",
  "Psicanálise III",
  "Psicologia e Saúde: Saúde Coletiva",
  "Avaliação Psicológica I",
  "Estágio Básico em Psicologia Clínica",
  "Ética Profissional",
  "Psicoterapias",
  "Fundamentos Metodológicos de Elaboração de Monografia",
  "Estágio Profissionalizante I",
  "Saúde Mental",
  "Psicologia Escolar e Educacional",
  "Optativas de Sociologia / História - Núcleo Básico CTCH",
  "Diversidade, Movimentos Sociais e Direitos Humanos",
  "Avaliação Psicológica II",
  "Laboratório de Avaliação Psicológica II",
  "Estágio Profissionalizante II",
  "Psicologia Organizacional",
  "Desenvolvimento Profissional",
  "Estágio Profissionalizante III",
  "Monografia I",
  "Psicofarmacologia",
  "Estágio Profissionalizante IV",
  "Monografia II",
];

interface SubjectComboboxProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SubjectCombobox({
  value,
  onValueChange,
  placeholder = "Selecione uma matéria...",
  className,
}: SubjectComboboxProps) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const selectedSubject = subjects.find((subject) => subject === value);

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("w-full justify-between overflow-hidden", className)}
          >
            <div className="flex-1 overflow-hidden text-left">
              <span
                className={cn(
                  "block truncate",
                  !selectedSubject && "text-muted-foreground",
                )}
              >
                {selectedSubject || placeholder}
              </span>
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <SubjectList
            setOpen={setOpen}
            setSelectedSubject={onValueChange}
            selectedSubject={selectedSubject}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between overflow-hidden", className)}
        >
          <div className="flex-1 overflow-hidden text-left">
            <span
              className={cn(
                "block truncate",
                !selectedSubject && "text-muted-foreground",
              )}
            >
              {selectedSubject || placeholder}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <SubjectList
            setOpen={setOpen}
            setSelectedSubject={onValueChange}
            selectedSubject={selectedSubject}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function SubjectList({
  setOpen,
  setSelectedSubject,
  selectedSubject,
}: {
  setOpen: (open: boolean) => void;
  setSelectedSubject: (subject: string) => void;
  selectedSubject: string | undefined;
}) {
  return (
    <Command>
      <CommandInput placeholder="Pesquisar matéria..." />
      <CommandList>
        <CommandEmpty>Nenhuma matéria encontrada.</CommandEmpty>
        <CommandGroup>
          {subjects.map((subject) => (
            <CommandItem
              key={subject}
              value={subject}
              onSelect={(currentValue) => {
                setSelectedSubject(
                  currentValue === selectedSubject ? "" : currentValue,
                );
                setOpen(false);
              }}
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  selectedSubject === subject ? "opacity-100" : "opacity-0",
                )}
              />
              {subject}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
