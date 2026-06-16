# Finanzas Pro

Aplicación SPA desarrollada con Vue 3 y Vite para llevar el control de finanzas personales: registrar ingresos y gastos, ver resúmenes, gráficos y un panel de usuario protegido por autenticación (Supabase).

## Contenido

- Descripción
- Requisitos
- Instalación y ejecución
- Variables de entorno
- Estructura del proyecto
- Contribuir

## Requisitos

- Node.js 18+ (recomendado)
- npm o yarn
- Cuenta y proyecto en Supabase (para autenticación y almacenamiento)

## Instalación y ejecución (local)

1. Instala dependencias:

```bash
npm install
```

2. Crea un archivo `.env` en la raíz (ver sección "Variables de entorno").

3. Levanta el servidor de desarrollo:

```bash
npm run dev
```

4. Para crear una build de producción:

```bash
npm run build
```

5. Para previsualizar la build localmente:

```bash
npm run preview
```

## Variables de entorno

La aplicación usa Supabase para autenticación y almacenamiento. Define al menos estas variables en `.env`:

- `VITE_SUPABASE_URL` = URL de tu proyecto Supabase
- `VITE_SUPABASE_PUBLISHABLE_KEY` = Key pública (anon) de Supabase

Ejemplo de `.env`:

```env
VITE_SUPABASE_URL=https://xyzcompany.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJI...
```

Nota: Las variables que comienzan con `VITE_` se exponen al bundle cliente.

## Estructura principal

- `index.html` — punto de entrada.
- `src/main.js` — inicialización de Vue, Pinia y Router.
- `src/App.vue` — layout principal.
- `src/components/` — componentes reutilizables (tarjetas, gráficos, formularios).
- `src/composables/` — composables (lógica reutilizable):
	- `useAuthForm.js`, `useTransacciones.js`, `useNuevaTransaccion.js`, etc.
- `src/stores/` — stores de Pinia (`auth.js`, `admin.js`).
- `src/views/` — vistas/ráutas principales (Dashboard, Movimientos, Login, Register, Admin).
- `src/lib/supabase.js` — cliente y helpers para Supabase.

## Dependencias principales

- Vue 3
- Vite
- Vue Router
- Pinia (+ pinia-plugin-persistedstate)
- @supabase/supabase-js
- chart.js + vue-chartjs

## Notas de desarrollo

- Las rutas protegidas dependen del `auth` store (Pinia). Asegurate de tener configurado correctamente Supabase y las reglas en la base de datos.
- Las imágenes de categorías se sirven desde el bucket `imagenesCategorias` en Supabase (revisar `src/composables/useCategoryImage.js`).

## Cómo contribuir

1. Crea una rama con un nombre descriptivo: `feature/mi-cambio` o `fix/lo-que-arregla`.
2. Haz commits claros y atómicos.
3. Abre un pull request describiendo el cambio y su motivación.

## Licencia

Este repositorio no incluye una licencia explícita. Añade una si deseas permitir contribuciones externas.

---