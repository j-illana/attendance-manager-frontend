import {
  useEffect,
  useState,
} from "react"

import {
  useNavigate,
} from "react-router"

import {
  getProfessors,
} from "@/features/professors/professors.api"

import type {
  ProfessorSummary,
} from "@/features/professors/professors.types"

import {
  getPeriods,
} from "@/features/periods/periods.api"

import type {
  Period,
} from "@/features/periods/periods.types"

import { Input } from "@/components/ui/input"

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

export default function ProfessorsPage() {
  const navigate = useNavigate()

  const [periods, setPeriods] =
    useState<Period[]>([])

  const [selectedPeriodId, setSelectedPeriodId] =
    useState<number | null>(null)

  const [professors, setProfessors] =
    useState<ProfessorSummary[]>([])

  const [search, setSearch] =
    useState("")

  const [debouncedSearch, setDebouncedSearch] =
    useState("")

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
    const timeout = setTimeout(() => {
      setDebouncedSearch(search)
    }, 300)

    return () => {
      clearTimeout(timeout)
    }
  }, [search])

  useEffect(() => {
    if (selectedPeriodId === null) {
      return
    }

    async function loadProfessors() {
      try {
        setIsLoading(true)
        setError("")

        const response =
          await getProfessors({
            periodId: selectedPeriodId!,
            search: debouncedSearch,
          })

        setProfessors(response)
      } catch {
        setError(
          "No fue posible cargar los profesores.",
        )

        setProfessors([])
      } finally {
        setIsLoading(false)
      }
    }

    loadProfessors()
  }, [
    selectedPeriodId,
    debouncedSearch,
  ])

  function handleProfessorClick(
    professorId: number,
  ) {
    navigate(
      `/profesores/${professorId}`,
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold">
            Profesores
          </h1>

          <p className="text-muted-foreground text-sm">
            Busca y consulta la información de los profesores.
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

      <Input
        type="search"
        placeholder="Buscar profesor..."
        value={search}
        onChange={(event) =>
          setSearch(
            event.target.value,
          )
        }
        className="max-w-md"
      />

      {error && (
        <p className="text-destructive text-sm">
          {error}
        </p>
      )}

      <div className="overflow-hidden rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                Profesor
              </TableHead>

              <TableHead>
                Cantidad de cursos
              </TableHead>

              <TableHead className="text-right">
                Asistencia
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="h-24 text-center"
                >
                  <span className="text-muted-foreground">
                    Cargando...
                  </span>
                </TableCell>
              </TableRow>
            ) : professors.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="h-24 text-center"
                >
                  <span className="text-muted-foreground">
                    No se encontraron profesores.
                  </span>
                </TableCell>
              </TableRow>
            ) : (
              professors.map(
                (professor) => (
                  <TableRow
                    key={professor.id}
                    className="cursor-pointer"
                    onClick={() =>
                      handleProfessorClick(
                        professor.id,
                      )
                    }
                  >
                    <TableCell className="font-medium">
                      {
                        professor.nombreCompleto
                      }
                    </TableCell>

                    <TableCell>
                      {
                        professor.cantidadNrc
                      }
                    </TableCell>

                    <TableCell className="text-right tabular-nums">
                      {professor.porcentajeAsistencia.toFixed(
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
      </div>
    </div>
  )
}