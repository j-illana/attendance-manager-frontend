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

interface AttendanceChartProps {
  percentage: number
}

const chartConfig = {
  asistencia: {
    label: "Asistencia",
    color: "var(--chart-1)",
  },
  inasistencia: {
    label: "Inasistencia",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function AttendanceChart({
  percentage,
}: AttendanceChartProps) {
  const absencePercentage = Math.max(
    0,
    100 - percentage,
  )

  const chartData = [
    {
      tipo: "asistencia",
      porcentaje: percentage,
      fill: "var(--color-asistencia)",
    },
    {
      tipo: "inasistencia",
      porcentaje: absencePercentage,
      fill: "var(--color-inasistencia)",
    },
  ]

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square h-55"
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
                    {Number(value).toFixed(2)}%
                  </span>
                </div>
              )}
            />
          }
        />

        <Pie
          data={chartData}
          dataKey="porcentaje"
          nameKey="tipo"
          innerRadius={65}
          outerRadius={90}
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
                      {percentage.toFixed(2)}%
                    </tspan>

                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy ?? 0) + 24}
                      className="fill-muted-foreground text-xs"
                    >
                      Asistencia
                    </tspan>
                  </text>
                )
              }
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}