# Fundamentos Técnicos de IA para Abogados

[![CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)

Serie educativa de visualizaciones interactivas sobre inteligencia artificial diseñada para profesionales del derecho.

![Fundamentos Técnicos de IA para Abogados](images/og-cover.png)

> **Demo en vivo**: [educacion.trifolia.cl](https://educacion.trifolia.cl)

## Contenido

20 slides que cubren:

1. **Introducción** - ¿Qué hay detrás del chat?
2. **Taxonomía de IA** - De la Inteligencia Artificial a los LLMs
3. **Ecosistema de IA** - Empresas, Modelos y Apps
4. **Autocompletado** - Cómo predicen los LLMs
5. **Ventana de Contexto** - El contexto en una conversación con IA
6. **¿IA Inteligente?** - Una pregunta filosófica con implicaciones prácticas
7. **Capacidades** - Lo que los LLMs pueden y no pueden hacer
8. **Consejos Prácticos** - Primera pausa
9. **Trade-offs de Modelos** - Calidad, velocidad y costo
10. **Prompts Efectivos** - Cómo comunicarte con IA
11. **Alucinaciones** - Cuando la IA inventa información
12. **Problema del Conocimiento** - El límite temporal de los LLMs
13. **Trifolia en Acción** - Demo de una conversación real
14. **Herramientas y Contexto** - Cómo las herramientas inyectan información real
15. **Fuentes Consultadas** - Transparencia total con enlaces verificables
16. **Trifolia** - Qué impulsa la precisión (informativo)
17. **Conclusiones** - Lo que aprendimos
18. **Privacidad: Datos** - El recorrido de tus datos en aplicaciones de IA
19. **Privacidad: Protección** - Modelo de seguridad en capas
20. **Privacidad: On-Premise** - Despliegue en tu propia infraestructura

## Uso local

Todo es HTML/CSS/JS vanilla con dependencias externas vía CDN.

### Opción 1: npm (recomendado)

```bash
npm run setup   # Instala dependencias + pre-commit hook
npm start       # Servidor local en http://localhost:3000
```

### Opción 2: Servidor local sin npm

Con Python (incluido en macOS/Linux):

```bash
python3 -m http.server 8000
# Luego abre http://localhost:8000
```

Con Node.js:

```bash
npx serve .
# Luego abre http://localhost:3000
```

### Opción 3: Abrir directamente

Abre `index.html` en tu navegador (doble clic o arrastrar al navegador).

### Navegación

- Flechas del teclado (← →)
- Botones de navegación
- Swipe en mobile
- Presiona **P** para modo presentación (16:9)

## Desarrollo

### Linting

```bash
npm run lint           # HTML + CSS + JS
npm run lint:html      # Solo HTMLHint
npm run lint:css       # Solo Stylelint
```

### Validación de navegación

```bash
npm run validate:nav   # Verifica dots, prev/next, progress bar en las 20 slides
npm run validate       # Lint + validación de navegación
```

### Pre-commit hook

`npm run setup` instala un hook que ejecuta automáticamente antes de cada commit:

1. Detecta marcadores de conflicto de merge
2. Verifica sintaxis JS (`node --check`)
3. Lint HTML (HTMLHint) y CSS (Stylelint) de archivos staged
4. Validación de consistencia de navegación

## Despliegue

### GitHub Pages

1. Ve a **Settings > Pages** en tu repositorio
2. En **Source**, selecciona la rama `main` y la carpeta `/ (root)`
3. Guarda y espera unos minutos
4. Tu sitio estará disponible en `https://<usuario>.github.io/<repo>/`

El sitio está publicado en `https://educacion.trifolia.cl`.

## Estructura del proyecto

```
├── index.html              # Landing page con tabla de contenidos
├── slides/                 # 20 slides individuales (HTML autocontenido)
│   ├── intro.html
│   ├── ai-taxonomy.html
│   ├── ai-ecosystem.html
│   └── ...
├── css/
│   ├── slides-base.css     # Estilos base, variables CSS, layout, modo presentación
│   └── slide-nav.css       # Barra de navegación, indicadores de progreso
├── js/
│   ├── slide-nav.js        # Navegación por teclado, touch, modo presentación
│   └── llm-context-viz.js  # Visualización interactiva de ventana de contexto
├── images/
│   ├── logo.svg            # Logo Trifolia
│   └── og-cover.png        # Imagen para previsualizaciones sociales
├── scripts/
│   ├── validate-nav.js     # Validador de consistencia de navegación entre slides
│   ├── pre-commit          # Git pre-commit hook
│   └── install-hooks.sh    # Instalador del hook (symlink a .git/hooks/)
├── package.json            # Scripts npm y devDependencies
├── .htmlhintrc             # Configuración HTMLHint
├── .stylelintrc.json       # Configuración Stylelint
├── CONTRIBUTING.md         # Guía para contribuir
└── CLAUDE.md               # Instrucciones para Claude Code
```

## Contribuir

Las contribuciones son bienvenidas. Consulta [CONTRIBUTING.md](CONTRIBUTING.md) para las convenciones del proyecto y cómo agregar slides.

## Licencia

Este contenido está licenciado bajo [Creative Commons Atribución-NoComercial-CompartirIgual 4.0 Internacional (CC BY-NC-SA 4.0)](https://creativecommons.org/licenses/by-nc-sa/4.0/).

### Puedes:
- Compartir las slides libremente
- Adaptarlas para tus propias presentaciones educativas

### Condiciones:
- **Atribución**: Menciona a Trifolia (trifolia.cl) como autor original
- **No Comercial**: No uses el material con fines comerciales
- **Compartir Igual**: Si adaptas el material, usa la misma licencia

### No incluido en la licencia:
- Las marcas registradas de Trifolia (nombre, logo, wordmark)
- Los logos y marcas de terceros (OpenAI, Google, Anthropic, etc.)

## Atribución

Al compartir o adaptar este material:

> "Fundamentos Técnicos de IA para Abogados" por [Trifolia](https://trifolia.cl), licenciado bajo [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/).

## Tecnologías

- HTML5, CSS3, JavaScript (vanilla)
- [Bootstrap 5](https://getbootstrap.com/) (MIT License)
- [Google Fonts](https://fonts.google.com/) - Inter, Libre Baskerville, JetBrains Mono
- [Bootstrap Icons](https://icons.getbootstrap.com/) (MIT License)
- Dev: [HTMLHint](https://htmlhint.com/), [Stylelint](https://stylelint.io/)
