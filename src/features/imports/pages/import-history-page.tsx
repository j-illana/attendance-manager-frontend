import {
  useEffect,
  useState,
} from "react"

import {
  getImportHistory,
} from "@/features/imports/imports.api"

import type {
  ImportHistoryItem,
} from "@/features/imports/imports.types"

import {
  getPeriods,
} from "@/features/periods/periods.api"

import type {
  Period,
} from "@/features/periods/periods.types"

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

export default function ImportHistoryPage() {
  const [periods, setPeriods] =
    useState<Period[]>([])

  const [selectedPeriodId, setSelectedPeriodId] =
    useState<number | null>(null)

  const [imports, setImports] =
    useState<ImportHistoryItem[]>([])

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

    async function loadHistory() {
      try {
        setIsLoading(true)
        setError("")

        const response =
          await getImportHistory(
            selectedPeriodId!,
          )

        setImports(response)
      } catch {
        setError(
          "No fue posible cargar el historial de importaciones.",
        )

        setImports([])
      } finally {
        setIsLoading(false)
      }
    }

    loadHistory()
  }, [selectedPeriodId])

  function formatDate(date: string) {
    return new Intl.DateTimeFormat(
      "es-MX",
      {
        dateStyle: "medium",
        timeStyle: "short",
      },
    ).format(new Date(date))
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold">
            Historial de importaciones
          </h1>

          <p className="text-muted-foreground text-sm">
            Consulta los archivos importados anteriormente.
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
                Archivo
              </TableHead>

              <TableHead>
                Periodo
              </TableHead>

              <TableHead className="text-right">
                Fecha de importación
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
            ) : imports.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="h-24 text-center"
                >
                  <span className="text-muted-foreground">
                    No hay importaciones registradas.
                  </span>
                </TableCell>
              </TableRow>
            ) : (
              imports.map(
                (item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item.nombreArchivo}
                    </TableCell>

                    <TableCell>
                      {item.periodo}
                    </TableCell>

                    <TableCell className="text-right">
                      {formatDate(
                        item.fechaImportacion,
                      )}
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