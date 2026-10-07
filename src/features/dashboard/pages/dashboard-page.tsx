import {
  useEffect,
  useState,
} from "react"

import {
  getDashboard,
} from "@/features/dashboard/dashboard.api"

import {
  AttendanceChart,
} from "@/features/dashboard/components/attendance-chart"

import {
  AttendanceRankingChart,
} from "@/features/dashboard/components/attendance-ranking-chart"

import type {
  DashboardResponse,
} from "@/features/dashboard/dashboard.types"

import {
  getPeriods,
} from "@/features/periods/periods.api"

import type {
  Period,
} from "@/features/periods/periods.types"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function Dashboard() {
  const [periods, setPeriods] =
    useState<Period[]>([])

  const [selectedPeriodId, setSelectedPeriodId] =
    useState<number | null>(null)

  const [dashboard, setDashboard] =
    useState<DashboardResponse | null>(null)

  const [isLoading, setIsLoading] =
    useState(true)

  const [error, setError] =
    useState("")

  useEffect(() => {
    async function loadPeriods() {
      try {
        setError("")

        const response =
          await getPeriods()

        setPeriods(response)

        if (response.length > 0) {
          setSelectedPeriodId(
            response[0].id,
          )
        }
      } catch {
        setError(
          "No fue posible cargar los periodos académicos.",
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadPeriods()
  }, [])

  useEffect(() => {
    if (selectedPeriodId === null) {
      return
    }

    async function loadDashboard() {
      try {
        setIsLoading(true)
        setError("")

        const response =
          await getDashboard(
            selectedPeriodId!,
          )

        setDashboard(response)
      } catch {
        setError(
          "No fue posible cargar la información del dashboard.",
        )

        setDashboard(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboard()
  }, [selectedPeriodId])

  return (
    <div className="flex flex-1 flex-col gap-6 p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold">
            Inicio
          </h1>

          <p className="text-muted-foreground text-sm">
            Consulta el resumen general de asistencia
            de los profesores.
          </p>
        </div>

        {periods.length > 0 && (
          <Select
            value={
              selectedPeriodId ??
              undefined
            }
            onValueChange={(value) => {
              if (value !== null) {
                setSelectedPeriodId(
                  Number(value),
                )
              }
            }}
          >
            <SelectTrigger className="w-45">
              <SelectValue>
                {periods.find(
                  (period) =>
                    period.id ===
                    selectedPeriodId,
                )?.nombre ??
                  "Seleccionar periodo"}
              </SelectValue>
            </SelectTrigger>

            <SelectContent>
              {periods.map((period) => (
                <SelectItem
                  key={period.id}
                  value={period.id}
                >
                  {period.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {error && (
        <Card>
          <CardContent className="py-6">
            <p className="text-destructive text-sm">
              {error}
            </p>
          </CardContent>
        </Card>
      )}

      {isLoading && !dashboard && (
        <div className="flex flex-1 items-center justify-center py-16">
          <p className="text-muted-foreground text-sm">
            Cargando...
          </p>
        </div>
      )}

      {!isLoading && !error && periods.length === 0 && (
        <Card>
          <CardContent className="py-6">
            <p className="text-muted-foreground text-sm">
              No hay periodos académicos disponibles.
            </p>
          </CardContent>
        </Card>
      )}

      {dashboard && (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  Total de profesores
                </CardTitle>

                <CardDescription>
                  Profesores registrados en el periodo.
                </CardDescription>
              </CardHeader>

              <CardContent className="flex min-h-55 items-center justify-center">
                <p className="text-6xl font-bold tabular-nums">
                  {dashboard.totalProfesores}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  Asistencia general
                </CardTitle>

                <CardDescription>
                  Porcentaje general de asistencia
                  del periodo.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <AttendanceChart
                  percentage={
                    dashboard.porcentajeAsistenciaGeneral
                  }
                />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  Mayor asistencia
                </CardTitle>

                <CardDescription>
                  Profesores con mayor porcentaje
                  de asistencia.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <AttendanceRankingChart
                  data={
                    dashboard.mayorAsistencia
                  }
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  Menor asistencia
                </CardTitle>

                <CardDescription>
                  Profesores con menor porcentaje
                  de asistencia.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <AttendanceRankingChart
                  data={
                    dashboard.menorAsistencia
                  }
                />
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}