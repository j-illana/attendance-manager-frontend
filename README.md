# Gestor de asistencia - Frontend

## Instalación desde GitHub

### Requisitos

-   Git.
-   Node.js 22 o compatible.
-   pnpm.
-   Backend del proyecto configurado y en ejecución.

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd attendance-manager-frontend
```

### 2. Instalar dependencias

``` bash
pnpm install
```

Las dependencias se restauran a partir de package.json y pnpm-lock.yaml, no es necesario instalar manualmente React, Tailwind o shadcn/ui.

### 3. Configurar el entorno

Crea el archivo `.env` a partir del archivo `.env.example` incluido en el proyecto:

```bash
cp .env.example .env
```

El archivo `.env` contendrá la URL utilizada para comunicarse con el backend:

```env
VITE_API_URL=http://localhost:5049
```

Si el backend se ejecuta en otro puerto o dirección, modifica `VITE_API_URL` en el archivo `.env`.

### 4. Ejecutar en desarrollo

``` bash
pnpm dev
```

Vite sirve normalmente la aplicación en:

``` text
http://localhost:5173
```

Para utilizar la aplicación completa, el backend debe estar ejecutándose
y permitir este origen mediante CORS.

## Tecnologías

-   Vite.
-   React.
-   TypeScript.
-   React Router en Declarative Mode.
-   Tailwind CSS v4.
-   shadcn/ui con Base UI.
-   Componentes de gráficas de shadcn/ui/Recharts.

## Organización

El código se organiza principalmente por funcionalidades:

```text
src/
├── app/
│   ├── App.tsx
│   └── layout.tsx
├── components/
│   ├── ui/
│   └── app-sidebar.tsx
├── features/
│   ├── auth/
│   │   ├── components/
│   │   └── pages/
│   ├── dashboard/
│   │   ├── components/
│   │   └── pages/
│   ├── imports/
│   │   └── pages/
│   ├── periods/
│   └── professors/
│       ├── components/
│       └── pages/
├── hooks/
├── lib/
│   ├── api.ts
│   └── utils.ts
├── assets/
├── index.css
└── main.tsx
```

Cada feature agrupa sus páginas, componentes, tipos y funciones de acceso a la API cuando corresponde.

`components/ui` contiene los componentes reutilizables de shadcn/ui.

## Comunicación con el backend

La configuración común de las peticiones se encuentra en:

``` text
src/lib/api.ts
```

La URL base se obtiene de:

``` ts
import.meta.env.VITE_API_URL
```

Las peticiones se realizan con:

``` ts
credentials: "include"
```

Esto permite que el navegador envíe automáticamente la cookie
`login_auth` creada por el backend.

El frontend nunca se conecta directamente a PostgreSQL.

## Autenticación

La página `/login` es pública. El resto de la aplicación se encuentra
dentro del layout protegido.

Al iniciar o recargar la aplicación se consulta:

``` text
GET /api/auth/me
```

Esto permite comprobar si el navegador conserva una sesión válida.

Flujo básico:

``` mermaid
flowchart TD
    A["/login"] -->|Credenciales válidas| B["/"]
    B --> C["Dashboard"]
    B --> D["Profesores"]
    B --> E["Importaciones"]
    B --> F["Historial"]
```

Cerrar sesión ejecuta el endpoint de logout y elimina la sesión del
usuario.

## Rutas

Las principales rutas son:

``` text
/login
/
/profesores
/profesores/:id
/importaciones
/historial
```

El `Layout` protegido contiene el sidebar y utiliza `<Outlet />` para
renderizar la página correspondiente.

## Dashboard

El dashboard permite seleccionar un periodo académico y visualizar:

-   Total de profesores.
-   Porcentaje general de asistencia.
-   Distribución de asistencia general.
-   Profesores con mayor asistencia.
-   Profesores con menor asistencia.

Las gráficas de ranking utilizan una escala de 0 a 100.

## Profesores

La página de profesores permite:

-   Seleccionar un periodo.
-   Buscar profesores por nombre.
-   Consultar la cantidad de cursos de cada profesor.
-   Consultar su porcentaje de asistencia.
-   Abrir la vista de detalle.

La búsqueda utiliza debounce para reducir peticiones innecesarias
mientras el usuario escribe.

### Detalle del profesor

Muestra los datos personales del profesor, un resumen de asistencia, una
gráfica y sus cursos.

La gráfica distingue:

-   Asistencias.
-   Inasistencias justificadas.
-   Inasistencias sin justificar.

Los justificantes no se contabilizan como asistencia.

La tabla de cursos muestra:

``` text
Claves Programas
NRC
Clave
Materia
Secc
Días
Hora
Salón
Justificante
Debe asistir
Asistió
% Asistencia
```

Cuando un profesor imparte varios cursos, cada NRC aparece como una fila
independiente.

La tabla utiliza desplazamiento horizontal cuando su contenido supera el
espacio disponible.

## Importación de Excel

La página de importaciones permite:

1.  Seleccionar un periodo académico.
2.  Seleccionar un archivo `.xlsx`.
3.  Enviarlo al backend.
4.  Mostrar el resultado de la importación o el mensaje de error
    recibido.

El archivo se envía utilizando `FormData`.

No debe establecerse manualmente `Content-Type` para esta petición, ya
que el navegador genera automáticamente el `boundary` requerido por
`multipart/form-data`.

## Historial de importaciones

El historial muestra:

-   Nombre del archivo.
-   Periodo académico.
-   Fecha y hora de importación.

También permite filtrar los registros por periodo.

El historial es una bitácora de operaciones y no una copia visual del
contenido completo de cada Excel importado.

## Periodos académicos

Los periodos disponibles se obtienen mediante:

``` text
GET /api/periodos
```

Los selectores de periodo se utilizan para mantener separadas las
consultas del dashboard, profesores, importaciones e historial.

## Variables de entorno y seguridad

El frontend utiliza:

``` env
VITE_API_URL=http://localhost:5049
```

`VITE_API_URL` **no es un secreto**. Su valor puede formar parte del
JavaScript que Vite entrega al navegador.

La arquitectura actual no requiere ninguna clave privada en el frontend.

La autenticación utiliza una cookie `HttpOnly` gestionada por el
backend. El navegador la envía automáticamente en las peticiones con
credenciales y React no necesita leer su contenido.