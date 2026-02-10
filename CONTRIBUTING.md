# Contribuir

Gracias por tu interés en contribuir a este proyecto educativo.

## Desarrollo local

```bash
npm run setup   # Instala dependencias + pre-commit hook (solo la primera vez)
npm start       # Servidor local en http://localhost:3000
```

Alternativamente, abre `index.html` directamente en el navegador o usa `python3 -m http.server 8000`.

## Cómo agregar una nueva slide

1. Crea un archivo `slides/nombre-de-slide.html` usando una slide existente como plantilla
2. Sigue la estructura estándar:
   - `<head>`: meta tags SEO, CDN links, `slides-base.css`, bloque `<style>` inline
   - `<body>`: `.page-container` > `main.viz-container` > `.viz-content`
   - Footer: `.brand-footer` con atribución
   - Nav: `<nav class="slide-nav">` con prev/next y 20+ dots
   - Scripts: `slide-nav.css` y `slide-nav.js` al final del `<body>`
3. **Actualiza la navegación en TODOS los archivos**: cada slide tiene links prev/next hardcodeados y una lista de dots con el `.active` correspondiente. Al agregar una slide, hay que actualizar `index.html` y las 20+ slides existentes
4. **Ejecuta `npm run validate:nav`** para verificar que la navegación es consistente en todos los archivos. El pre-commit hook también lo verifica automáticamente

## Linting y validación

```bash
npm run lint           # HTMLHint + Stylelint + JS syntax check
npm run validate:nav   # Consistencia de navegación entre slides
npm run validate       # Todo junto (lint + nav)
```

El pre-commit hook ejecuta estas verificaciones automáticamente sobre los archivos staged. Si el hook bloquea un commit, corrige los errores reportados y vuelve a intentar.

## Convenciones de estilo

### CSS Variables

Usa las variables definidas en `css/slides-base.css`:

| Variable | Valor | Uso |
|----------|-------|-----|
| `--clover-purple` | `#3c78fd` | Color primario (azul) |
| `--petal-accent` | `#7200fc` | Acento (púrpura) |
| `--law-navy` | `#1A2332` | Fondo oscuro |
| `--paper-white` | `#F8F9FA` | Texto claro |
| `--success-green` | `#10B981` | Estados positivos |
| `--warning-amber` | `#F59E0B` | Advertencias |
| `--danger-red` | `#EF4444` | Estados negativos |
| `--viz-max-width` | `1000px` | Ancho máximo del contenido (override por slide) |

### Tipografía

- **Títulos**: `"Libre Baskerville", Georgia, serif`
- **Texto general**: `"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- **Código**: `"JetBrains Mono", monospace`

### Accesibilidad

- Incluye `@media (prefers-reduced-motion: reduce)` para anular animaciones
- Usa `aria-label` en elementos de navegación
- Asegura contraste suficiente (el esquema de colores del proyecto ya cumple WCAG AA)

### Slides interactivas

Si tu slide tiene JavaScript interactivo, registra el handler para evitar que Space/Enter naveguen antes de tiempo:

```javascript
window.slideInteraction.register(function() {
    // Tu lógica aquí
    // Retorna true para permitir navegación, false para quedarse
    return false;
});
```

## Estructura de una slide

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <!-- Meta tags, CDN links, slides-base.css -->
    <style>
        /* Estilos específicos de esta slide */
    </style>
</head>
<body>
    <div class="page-container">
        <main class="viz-container">
            <div class="corner-top-left"></div>
            <div class="corner-bottom-right"></div>
            <div class="viz-content">
                <header class="viz-header">
                    <h1 class="viz-title">
                        Título con <span class="highlight">acento</span>
                    </h1>
                </header>
                <!-- Contenido de la slide -->
            </div>
        </main>
        <footer class="brand-footer">...</footer>
    </div>
    <!-- Nav bar, hint, progress, slide-nav.css, slide-nav.js -->
</body>
</html>
```

## Modo presentación

Presiona **P** para alternar el modo presentación (16:9, referencia 1280x720). Si tu slide necesita ajustes visuales en este modo, agrega reglas bajo `body.fullscreen-mode`.
