import {
  Label,
  Pie,
  PieChart,
} from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

import type {
  ProfessorAttendanceSummary,
} from "../professors.types"

interface ProfessorAttendanceChartProps {
  summary: ProfessorAttendanceSummary
}

const chartConfig = {
  asistencias: {
    label: "Asistencias",
    color: "var(--chart-1)",
  },
  justificantes: {
    label: "Justificadas",
    color: "var(--chart-2)",
  },
  inasistencias: {
    label: "Sin justificar",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

export function ProfessorAttendanceChart({
  summary,
}: ProfessorAttendanceChartProps) {
  const chartData = [
    {
      tipo: "asistencias",
      cantidad: summary.asistencias,
      fill: "var(--color-asistencias)",
    },
    {
      tipo: "justificantes",
      cantidad: summary.justificantes,
      fill: "var(--color-justificantes)",
    },
    {
      tipo: "inasistencias",
      cantidad: summary.inasistenciasSinJustificar,
      fill: "var(--color-inasistencias)",
    },
  ]

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square h-56"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              hideLabel
              formatter={(value, name) => (
                <div className="flex min-w-32 items-center justify-between gap-4">
                  <span>
                    {chartConfig[
                      name as keyof typeof chartConfig
                    ]?.label ?? name}
                  </span>

                  <span className="font-mono font-medium tabular-nums">
                    {Number(value)}
                  </span>
                </div>
              )}
            />
          }
        />

        <Pie
          data={chartData}
          dataKey="cantidad"
          nameKey="tipo"
          innerRadius={65}
          strokeWidth={5}
        >
          <Label
            content={({ viewBox }) => {
              if (
                viewBox &&
                "cx" in viewBox &&
                "cy" in viewBox
              ) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-2xl font-bold"
                    >
                      {summary.porcentajeAsistencia.toFixed(2)}%
                    </tspan>

                    <tspan
                      x={viewBox.cx}
                      y={Number(viewBox.cy) + 24}
                      className="fill-muted-foreground text-xs"
                    >
                      Asistencia
                    </tspan>
                  </text>
                )
              }

              return null
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}