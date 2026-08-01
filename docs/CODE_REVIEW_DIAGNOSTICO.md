# Revisión técnica y diagnóstico del proyecto

Fecha: 2026-02-20

## Alcance
- Revisión de arquitectura/documentación (`docs/AGENT_PROMPT.md`, `docs/ARCHITECTURE.md`).
- Revisión de implementación actual del sitio en `src/` con foco en:
  - autenticación/login (identificación),
  - estado funcional de socios,
  - deuda técnica y funcionalidades incompletas.

## Diagnóstico resumido

### Estado general
El proyecto tiene una base sólida (stack, rutas principales, CRUDs y modelo Prisma) pero aún está en una **fase intermedia**: funcionalidad amplia implementada, con varios bloqueos de calidad/producción (lint, build por fuentes, inconsistencias de auth UX/flujo) y con módulos todavía incompletos respecto al roadmap de arquitectura.

### Riesgos principales detectados
1. **Dependencia externa en build para fuentes** (`next/font/google`): no implica un problema visual por sí mismo, pero puede fallar en entornos restringidos y no está alineado con el objetivo documental de self-host (`public/fonts`).
2. **Flujo de login mejorable para socios** (redirección fija a `/admin` + enlace de recuperación inactivo).
3. **Riesgo técnico en composición Header/Auth**: componente cliente (`Header`) importando componente asíncrono dependiente de sesión (`MemberAreaLinks`).
4. **Manejo de webhooks Stripe con supuestos peligrosos** (uso de `session.subscription.current_period_end` que no siempre existe en `checkout.session.completed`).
5. **Estado de “dashboard admin” aún mock/TODO** (métricas fijas a 0), lo que muestra fase no finalizada.

## Fase estimada del proyecto
Según roadmap y checklist en `docs/ARCHITECTURE.md`, el proyecto se encuentra aproximadamente entre **Fase 3 y Fase 4**:
- Fase 1 y gran parte de Fase 2: mayoritariamente implementadas.
- Fase 3: bastante avanzada (CRUD contenido/eventos/categorías/tags), pero no cerrada al 100%.
- Fase 4: iniciada (registro de socios, área privada, Stripe), con huecos de robustez y experiencia.
- Fase 5/6: parcialmente iniciadas, no cerradas (migración, SEO completo, hardening, testing integral).

## Qué queda por desarrollar/priorizar

### Prioridad alta (bloquea salida a producción)
- Corregir lint errores y deuda acumulada (entidades no escapadas, uso de `<img>` en vez de `next/image` donde aplique).
- Definir política de fuentes: mantener `next/font/google` (válido si build con red) o migrar a self-host (`public/fonts`) para eliminar dependencia externa en build.
- Endurecer flujo de autenticación:
  - redirección post-login por rol/contexto,
  - recuperación de contraseña real,
  - eliminar logs sensibles de auth en runtime.
- Revisar webhook Stripe para no depender de campos no garantizados en `checkout.session.completed`.

### Prioridad media
- Completar dashboard admin con métricas reales y actividad real.
- Cerrar huecos de UX en socios (mensajes, onboarding tras pago, estados PENDING/ACTIVE claros).
- Revisar consistencia documental entre AGENT_PROMPT y ARCHITECTURE (roles/fases).

### Prioridad de cierre
- Migración WordPress completa y validada.
- SEO técnico completo (sitemap dinámico, structured data, OG consistente).
- Testing funcional + regresión + rendimiento antes de lanzamiento.
