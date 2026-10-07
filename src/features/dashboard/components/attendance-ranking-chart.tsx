import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

import type {
  ProfessorAttendanceSummary,
} from "../dashboard.types"

interface AttendanceRankingChartProps {
  data: ProfessorAttendanceSummary[]
}

const chartConfig = {
  porcentajeAsistencia: {
    label: "Asistencia",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function AttendanceRankingChart({
  data,
}: AttendanceRankingChartProps) {
  const chartData = data.map((professor) => ({
    id: professor.id,
    profesor: professor.nombreCompleto,
    porcentajeAsistencia:
      professor.porcentajeAsistencia,
  }))

  return (
    <ChartContainer
      config={chartConfig}
      className="h-60 w-full"
    >
      <BarChart
        accessibilityLayer
        data={chartData}
        layout="vertical"
        margin={{
          left: 0,
          right: 24,
        }}
      >
        <CartesianGrid
          horizontal={false}
        />

        <XAxis
          type="number"
          domain={[0, 100]}
          tickFormatter={(value) =>
            `${value}%`
          }
        />

        <YAxis
          dataKey="profesor"
          type="category"
          tickLine={false}
          axisLine={false}
          width={150}
          tickFormatter={(value: string) => {
            if (value.length <= 20) {
              return value
            }

            return `${value.slice(0, 20)}…`
          }}
        />

        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              formatter={(value) => (
                <div className="flex min-w-32 items-center justify-between gap-4">
                  <span>Asistencia</span>

                  <span className="font-mono font-medium tabular-nums">
                    {Number(value).toFixed(2)}%
                  </span>
                </div>
              )}
            />
          }
        />

        <Bar
          dataKey="porcentajeAsistencia"
          fill="var(--color-porcentajeAsistencia)"
          radius={5}
        />
      </BarChart>
    </ChartContainer>
  )
}