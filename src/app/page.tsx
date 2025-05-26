"use client";

import { GradeTable } from "@/components/GradeTable";
import { ModeToggle } from "@/components/ui/mode-toggle";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-30 dark:opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle, #8b5cf6 2px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="mb-4 flex justify-end">
          <ModeToggle />
        </div>

        {/* Título */}
        <div className="bg-background mx-auto mb-8 w-fit rounded-lg text-center">
          <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">
            Calculadora de notas da{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Leticia
            </span>
            ✨💜
          </h1>
        </div>

        <div className="mx-auto max-w-7xl">
          <GradeTable />
        </div>
      </div>
    </div>
  );
}
