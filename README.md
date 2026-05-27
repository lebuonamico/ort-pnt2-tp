# Finanzas Pro

SPA desarrollada con Vue.js para el seguimiento de finanzas personales. El objetivo del proyecto es permitir que una persona registre ingresos y gastos, consulte su balance y acceda a un panel privado mediante autenticacion.

## Estado actual

- Proyecto Vue creado con Vite.
- Rutas principales configuradas con Vue Router.
- Estado global de autenticacion centralizado con Pinia.
- Persistencia local del estado de usuario con `pinia-plugin-persistedstate`.
- Conexion a Supabase para registro, inicio de sesion y cierre de sesion.
- Landing page, login, registro, dashboard protegido y pagina 404.

## En desarrollo

- Dashboard financiero con ingresos, gastos, balance e historial.
- Store global para transacciones.
- Filtros por fecha y tipo de movimiento.
- Configuracion PWA con `vite-plugin-pwa`.
- Documentacion tecnica ampliada.
- Deploy publico en produccion.

## Tecnologias

- Vue.js
- Vite
- Vue Router
- Pinia
- Supabase

## Scripts

```bash
npm run dev
npm run build
npm run preview
```
