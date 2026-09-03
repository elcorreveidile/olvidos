# Roles y permisos en la web de Olvidos

Cada cuenta tiene un solo rol (`User.role`). Las etiquetas y utilidades
compartidas están en `src/lib/roles.ts`.

| Rol | Etiqueta en el panel | Qué puede hacer |
|---|---|---|
| `USER` | Usuario | Cuenta registrada sin permisos especiales. |
| `MEMBER` | Socio | Área «Mi cuenta» (carnet, documentos, pagos) y contenidos para socios. |
| `EDITOR` | Equipo Olvidos | Entra en el panel; crea, edita, publica y archiva artículos y actividades. No ve Usuarios, Socios ni Pagos. |
| `MEMBER_ADMIN` | Admin de socios | Entra en el panel; gestiona socios, pagos y contabilidad. No edita artículos ni roles. |
| `ADMIN` | Administrador | Todo lo anterior y la asignación de roles. |

**Quién publica.** Solo `EDITOR` y `ADMIN` (comprobación en
`src/lib/actions/articles.ts`, `checkPermission`). Los socios no tienen ningún
flujo para enviar textos.

**Cómo cambiar un rol.** Un administrador entra en el panel, Usuarios, y elige
el rol en la columna «Rol». El cambio se aplica al instante (la sesión relee el
rol de la base de datos en cada petición). Un administrador no puede cambiar su
propio rol ni dejar la web sin administradores.

**Socios que además son del equipo.** Un usuario puede ser socio (ficha en
`Member`) y tener rol `EDITOR`, `MEMBER_ADMIN` o `ADMIN`. Crear, editar o dar
de baja su ficha de socio **no** cambia esos roles; solo alterna entre `USER` y
`MEMBER` cuando el rol actual es uno de esos dos (`roleForMemberStatus`).

**Desde la terminal** (en local, con `.env.local`):

```bash
npx tsx --env-file=.env.local scripts/set-user-role.ts EDITOR persona@ejemplo.es
npx tsx --env-file=.env.local scripts/set-user-role.ts ADMIN otra@ejemplo.es --create
```

`--create` crea la cuenta si no existe, con una contraseña temporal que se
imprime una sola vez.
