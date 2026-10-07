import {
  useEffect,
  useState,
} from "react"

import {
  getPeriods,
} from "@/features/periods/periods.api"

import type {
  Period,
} from "@/features/periods/periods.types"

import {
  importExcel,
} from "@/features/imports/imports.api"

import type {
  ImportExcelResponse,
} from "@/features/imports/imports.types"

import { Button } from "@/components/ui/button"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Input } from "@/components/ui/input"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function ImportPage() {
  const [periods, setPeriods] =
    useState<Period[]>([])

  const [selectedPeriodId, setSelectedPeriodId] =
    useState<number | null>(null)

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null)

  const [result, setResult] =
    useState<ImportExcelResponse | null>(null)

  const [isLoadingPeriods, setIsLoadingPeriods] =
    useState(true)

  const [isImporting, setIsImporting] =
    useState(false)

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
        setIsLoadingPeriods(false)
      }
    }

    loadPeriods()
  }, [])

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0] ?? null

    setSelectedFile(file)
    setResult(null)
    setError("")
  }

  async function handleImport() {
    if (
      selectedPeriodId === null ||
      selectedFile === null
    ) {
      return
    }

    try {
      setIsImporting(true)
      setError("")
      setResult(null)

      const response =
        await importExcel(
          selectedPeriodId,
          selectedFile,
        )

      setResult(response)
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError(
          "No fue posible importar el archivo.",
        )
      }
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold">
            Importar Excel
          </h1>

          <p className="text-muted-foreground text-sm">
            Importa los datos de asistencia desde un archivo de Excel.
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

                setResult(null)
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

      {isLoadingPeriods ? (
        <p className="text-muted-foreground text-sm">
          Cargando periodos...
        </p>
      ) : periods.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          No hay periodos académicos disponibles.
        </p>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>
              Archivo de asistencia
            </CardTitle>

            <CardDescription>
              Selecciona un archivo con extensión .xlsx.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            <Input
              type="file"
              accept=".xlsx"
              onChange={handleFileChange}
              disabled={isImporting}
            />

            {selectedFile && (
              <p className="text-muted-foreground text-sm">
                Archivo seleccionado:{" "}
                <span className="text-foreground font-medium">
                  {selectedFile.name}
                </span>
              </p>
            )}

            <div className="flex justify-end">
              <Button
                onClick={handleImport}
                disabled={
                  selectedFile === null ||
                  selectedPeriodId === null ||
                  isImporting
                }
              >
                {isImporting
                  ? "Importando..."
                  : "Importar"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card>
          <CardContent className="py-4">
            <p className="text-destructive text-sm">
              {error}
            </p>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>
              {result.message}
            </CardTitle>

            <CardDescription>
              La información del archivo fue procesada por el sistema.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground text-sm">
                  Archivo
                </dt>

                <dd className="font-medium">
                  {result.archivo}
                </dd>
              </div>

              <div>
                <dt className="text-muted-foreground text-sm">
                  Hoja
                </dt>

                <dd className="font-medium">
                  {result.hoja}
                </dd>
              </div>

              <div>
                <dt className="text-muted-foreground text-sm">
                  Filas procesadas
                </dt>

                <dd className="font-medium tabular-nums">
                  {result.filas}
                </dd>
              </div>

              <div>
                <dt className="text-muted-foreground text-sm">
                  Registros guardados
                </dt>

                <dd className="font-medium tabular-nums">
                  {result.registrosGuardados}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      )}
    </div>
  )
}