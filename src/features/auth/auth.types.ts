export interface LoginRequest {
  correo: string
  password: string
}

export interface UserResponse {
  id: number
  correo: string
  nombre: string
  apellidoPaterno: string
  apellidoMaterno: string
  roles: string[]
}