# 🎮 GitItUp — Git Gamification (v0.0.1)

A minimalist, high-aesthetic desktop overlay that gamifies your Git workflow. Earn XP and level up with every commit you make!

---

## ✨ Features

- **🔄 Dual Layouts** — Minimalist circular ring o barra horizontal clásica.
- **🎨 Visual Themes** — 10 degradados premium para tu escritorio.
- **🎚️ Transparencia** — Slider para ajustar la opacidad en reposo.
- **📍 Snap Zones** — Se ancla a cualquier esquina de la pantalla.
- **Git Integration** — Seguimiento en tiempo real de XP mediante Git hooks.
- **🕹️ Subida de Nivel** — Los requisitos de XP crecen con cada nivel (x1.5).
- **Persistent Progress** — Tus estadísticas se guardan automáticamente.

---

## 🚀 Requisitos
Asegúrate de tener instalado **[Node.js](https://nodejs.org/)** (v16+) y **Git**. 

---

## 📥 Instalación (MUY IMPORTANTE)

Para que el programa funcione, sigue estos pasos exactamente:

1.  **Entra** en la carpeta `XPBar_Release`.
2.  Haz doble clic en **`instalar.bat`**. 
    *   **NO cierres la ventana negra**. Se pondrá a descargar las librerías necesarias.
    *   Tardará unos **40-60 segundos** en terminar.
    *   Cuando salga el mensaje de **"[OK] Shortcut created"**, ya puedes cerrar la ventana.
3.  Haz doble clic en **`install-hook.bat`**.
    *   *Esto activa el XP para todos tus repositorios de Git.*

---

## 🕹️ Cómo usarlo

1.  Abre el icono de **GitItUp** en tu escritorio.
2.  **Configura tu estilo**: Haz clic derecho en el icono del engranaje (⚙️) que aparece al pasar el ratón para cambiar el color o la transparencia.
3.  **Ganar XP**: Simplemente haz un `git commit` en cualquier proyecto. Verás cómo sube la barra en tiempo real.
4.  **Bandeja del Sistema**: Usa el icono de la bandeja (al lado de la hora) para mover la barra de esquina o salir.

---

## 🔧 Configuración Técnica

Si quieres ajustar la velocidad de subida, edita los valores en `/App/main.js`:

| Constante | Default | Descripción |
|---|---|---|
| `BASE_XP` | `100` | XP para subir del nivel 1 al 2 |
| `XP_PER_COMMIT` | `25` | XP que ganas por cada commit |
| `GROWTH_FACTOR` | `1.5` | Multiplicador de dificultad por nivel |

---

## 📁 Estructura del Proyecto

```text
XPBar_Release/
├── README.md           # Estas instrucciones
├── instalar.bat        # INSTALADOR (Único clic - descarga todo)
├── install-hook.bat    # ACTIVADOR de XP
└── App/                # Código interno (no borrar)
    ├── main.js         # Servidor y Electron
    ├── index.html/css  # Interfaz y Estilos
    └── assets/         # Iconos oficiales
```

---

## ⚖️ License
Distributed under the ISC License.
