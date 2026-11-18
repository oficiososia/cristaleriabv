# Sistema de diseño · Cristalería Baix Vinalopó

Generado con **UI UX Pro Max** (`--design-system`, consulta «glass glazing company local service premium craftsmanship», dials variance 6 / motion 6 / density 3) y adaptado a la estructura de **Formis** y a los colores del logo.

## Dirección

- **Patrón:** narrativa con scroll (scroll-triggered storytelling) y un CTA al final de cada bloque.
- **Estilo:** *Liquid Glass*, vidrio esmerilado sobre fotografía grande (backdrop-blur 9–16 px, bordes blancos translúcidos, reflejo que cruza la superficie). Encaja con el producto: una cristalería.
- **Estructura (Formis):** barra superior → cabecera con teléfono → hero con cuadrícula → quiénes somos con estadísticas → servicios con barras de vidrio → proceso con tarjetas apiladas → portfolio → garantías en sección oscura → FAQ → contacto en tarjeta oscura → pie con cajas.

## Color

| Token | Hex | Uso |
| --- | --- | --- |
| `navy-950` | `#061A2E` | Secciones oscuras, pie |
| `navy-900` | `#0A2A48` | Marca (logo), títulos, botones primarios |
| `navy-700` | `#1D4A75` | Acentos en cursiva, foco |
| `cream-100` | `#F8F5EE` | Fondo de página |
| `cream-50` | `#FFFDF8` | Tarjetas |
| `cream-200` | `#F2E8C8` | Crema del logo: texto sobre marino, insignias |
| `gold-600` | `#8A6428` | Etiquetas sobre fondo claro |
| `gold-300` | `#D9B76E` | Acentos sobre fondo oscuro |
| `ink` / `ink-soft` | `#14263B` / `#5B6673` | Texto / texto secundario |

Contrastes verificados (WCAG AA): navy-900 sobre fondo 13,4:1 · ink-soft 5,4:1 · gold-600 4,9:1 · cream-200 sobre navy-950 14,3:1.

## Tipografía

- **Títulos:** Cabinet Grotesk 400–800 (Fontshare, alojada en `src/fonts`).
- **Texto:** Instrument Sans.
- **Acentos y pasos del proceso:** Fraunces en cursiva.
- Base de 16 px, interlineado 1,5–1,7 y titulares con `text-wrap: balance`.

## Movimiento (estilo 21st.dev / Magic UI, hecho con Motion)

| Componente | Archivo |
| --- | --- |
| Aparición con desenfoque y escalonado | `src/components/motion/reveal.tsx` |
| Titulares palabra a palabra | `text-reveal.tsx` |
| Contadores animados | `number-ticker.tsx` |
| Cinta infinita de servicios | `marquee.tsx` |
| Cristal esmerilado que se aclara bajo el cursor (y solo en móvil) | `glass-reveal.tsx` |

Duraciones de 0,3 a 0,7 s con la curva `cubic-bezier(0.22, 1, 0.36, 1)`. Todo respeta `prefers-reduced-motion` (`MotionConfig reducedMotion="user"` y reglas CSS).

## Checklist de entrega

- [x] Iconos SVG (Lucide), sin emojis.
- [x] Áreas táctiles de 44 px o más.
- [x] Foco visible y etiquetas visibles en todos los campos.
- [x] Sin scroll horizontal en 390 px (verificado con Playwright).
- [x] Imágenes con `next/image`, `sizes` y texto alternativo en español.
