# FinLex Angular

Aplicación Angular modularizada a partir del prototipo HTML original.

## Estructura

- `src/app/pages`: un componente lazy-loaded por enlace del navbar.
- `src/app/layout`: cabecera y pie compartidos.
- `src/app/core/models`: contratos de datos.
- `src/app/core/services`: acceso a API y autenticación, preparado para sustituir los endpoints simulados por un backend real.

## Desarrollo

1. Instale una versión de Node.js compatible con Angular 21.2: `^20.19.0`, `^22.12.0` o `^24.0.0`.
2. Ejecute `npm install`.
3. Ejecute `npm start`.
4. Abra `http://localhost:4200`.

La URL `/api/contact-requests` está definida como punto de integración futuro para el backend.

## Autenticación con NestJS y PostgreSQL

El backend se encuentra en `backend/` e incluye JWT, contraseñas con bcrypt y roles `admin` y `user`.

1. Inicie PostgreSQL con `docker compose up -d postgres`.
2. En `backend/`, ejecute `npm install` y después `npm run start:dev`.
3. En la raíz, ejecute `npm start` para iniciar Angular con el proxy hacia NestJS.

Al iniciar el backend por primera vez se ejecuta la migración y se crea el administrador configurado en `backend/.env`. Todos los registros públicos reciben siempre el rol `user`.

Antes de producción cambie `JWT_SECRET`, `ADMIN_PASSWORD` y las credenciales de PostgreSQL, desactive o retire la contraseña inicial y use HTTPS.
