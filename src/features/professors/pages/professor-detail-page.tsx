import {
  useEffect,
  useState,
} from "react"

import {
  useNavigate,
  useParams,
} from "react-router"

import {
  getProfessor,
} from "@/features/professors/professors.api"

import type {
  ProfessorDetail,
} from "@/features/professors/professors.types"

import {
  ProfessorAttendanceChart,
} from "@/features/professors/components/professor-attendance-chart"

import {
  getPeriods,
} from "@/features/periods/periods.api"

import type {
  Period,
} from "@/features/periods/periods.types"

import { Button } from "@/components/ui/button"

import { ArrowLeft } from "lucide-react"

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

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  ScrollArea,
  ScrollBar,
} from "@/components/ui/scroll-area"

export default function ProfessorDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()

  const professorId = Number(id)

  const [periods, setPeriods] =
    useState<Period[]>([])

  const [selectedPeriodId, setSelectedPeriodId] =
    useState<number | null>(null)

  const [professor, setProfessor] =
    useState<ProfessorDetail | null>(null)

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
    if (
      selectedPeriodId === null ||
      !Number.isInteger(professorId)
    ) {
      return
    }

    async function loadProfessor() {
      try {
        setIsLoading(true)
        setError("")

        const response =
          await getProfessor(
            professorId,
            selectedPeriodId!,
          )

        setProfessor(response)
      } catch {
        setError(
          "No fue posible cargar la información del profesor.",
        )

        setProfessor(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadProfessor()
  }, [
    professorId,
    selectedPeriodId,
  ])

  function formatTime(time: string) {
    return time.slice(0, 5)
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-6 p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-4">
          <Button
            variant="outline"
            className="w-fit px-4"
            onClick={() =>
              navigate("/profesores")
            }
          >
            <ArrowLeft />
            Volver a profesores
          </Button>

          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold">
              {professor?.nombreCompleto ??
                "Profesor"}
            </h1>

            <p className="text-muted-foreground text-sm">
              Consulta la asistencia y los horarios del profesor.
            </p>
          </div>
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
            <SelectTrigger className="w-48">
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
        <p className="text-destructive text-sm">
          {error}
        </p>
      )}

      {isLoading && !professor && (
        <p className="text-muted-foreground text-sm">
          Cargando...
        </p>
      )}

      {professor && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <CardDescription>
                  Asistencias
                </CardDescription>

                <CardTitle className="text-3xl tabular-nums">
                  {professor.resumen.asistencias}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardDescription>
                  Inasistencias justificadas
                </CardDescription>

                <CardTitle className="text-3xl tabular-nums">
                  {professor.resumen.justificantes}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardDescription>
                  Sin justificar
                </CardDescription>

                <CardTitle className="text-3xl tabular-nums">
                  {
                    professor.resumen
                      .inasistenciasSinJustificar
                  }
                </CardTitle>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardDescription>
                  Debe asistir
                </CardDescription>

                <CardTitle className="text-3xl tabular-nums">
                  {professor.resumen.debeAsistir}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                Asistencia
              </CardTitle>

              <CardDescription>
                Resumen de asistencia del profesor durante el periodo.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <ProfessorAttendanceChart
                summary={professor.resumen}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Horarios
              </CardTitle>

              <CardDescription>
                Materias y horarios asociados al profesor.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <ScrollArea className="w-full">
                <Table className="min-w-max">
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        Claves Programas
                      </TableHead>

                      <TableHead>
                        NRC
                      </TableHead>

                      <TableHead>
                        Clave
                      </TableHead>

                      <TableHead>
                        Materia
                      </TableHead>

                      <TableHead>
                        Secc
                      </TableHead>

                      <TableHead>
                        Días
                      </TableHead>

                      <TableHead>
                        Hora
                      </TableHead>

                      <TableHead>
                        Salón
                      </TableHead>

                      <TableHead className="text-right">
                        Justificante
                      </TableHead>

                      <TableHead className="text-right">
                        Debe asistir
                      </TableHead>

                      <TableHead className="text-right">
                        Asistió
                      </TableHead>

                      <TableHead className="text-right">
                        % Asistencia
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {professor.horarios.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={12}
                          className="h-24 text-center"
                        >
                          <span className="text-muted-foreground">
                            No hay horarios registrados.
                          </span>
                        </TableCell>
                      </TableRow>
                    ) : (
                      professor.horarios.map(
                        (schedule) => (
                          <TableRow key={schedule.id}>
                            <TableCell>
                              {schedule.clavesProgramas}
                            </TableCell>

                            <TableCell className="font-medium">
                              {schedule.nrc}
                            </TableCell>

                            <TableCell>
                              {schedule.claveMateria}
                            </TableCell>

                            <TableCell>
                              {schedule.materia}
                            </TableCell>

                            <TableCell>
                              {schedule.seccion ?? "—"}
                            </TableCell>

                            <TableCell>
                              {schedule.dia}
                            </TableCell>

                            <TableCell className="whitespace-nowrap tabular-nums">
                              {formatTime(
                                schedule.horaInicio,
                              )}
                              {" - "}
                              {formatTime(
                                schedule.horaFin,
                              )}
                            </TableCell>

                            <TableCell>
                              {schedule.salon}
                            </TableCell>

                            <TableCell className="text-right tabular-nums">
                              {schedule.justificantes}
                            </TableCell>

                            <TableCell className="text-right tabular-nums">
                              {schedule.debeAsistir}
                            </TableCell>

                            <TableCell className="text-right tabular-nums">
                              {schedule.asistencias}
                            </TableCell>

                            <TableCell className="text-right tabular-nums">
                              {schedule.porcentajeAsistencia.toFixed(
                                2,
                              )}
                              %
                            </TableCell>
                          </TableRow>
                        ),
                      )
                    )}
                  </TableBody>
                </Table>

                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}