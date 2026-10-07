import { useState } from "react"
import { useNavigate } from "react-router"
import { cn } from "cn"

import { useAuth } from "@/features/auth/auth-context"

import { Button } from "@/components/ui/button"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"

import { Input } from "@/components/ui/input"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] =
    useState("")

  const [password, setPassword] =
    useState("")

  const [error, setError] =
    useState("")

  const [isLoading, setIsLoading] =
    useState(false)

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    setError("")
    setIsLoading(true)

    try {
      await login({
        correo: email,
        password,
      })

      navigate("/", {
        replace: true,
      })
    } catch {
      setError(
        "Correo electrónico o contraseña incorrectos.",
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-6",
        className,
      )}
      {...props}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Inicio de sesión
          </CardTitle>

          <CardDescription>
            Ingrese su correo electrónico y contraseña
            para acceder a su cuenta.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">
                  Correo electrónico
                </FieldLabel>

                <Input
                  id="email"
                  type="email"
                  placeholder="admin@buap.mx"
                  autoComplete="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value,
                    )
                  }
                  disabled={isLoading}
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">
                  Contraseña
                </FieldLabel>

                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value,
                    )
                  }
                  disabled={isLoading}
                  required
                />
              </Field>

              {error && (
                <Field>
                  <FieldDescription className="text-destructive">
                    {error}
                  </FieldDescription>
                </Field>
              )}

              <Field>
                <Button
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading
                    ? "Iniciando sesión..."
                    : "Iniciar sesión"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}