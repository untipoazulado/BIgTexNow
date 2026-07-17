# BIG TEXT NOW (v2.0.0)

[English Version Below](#english-version)

Una herramienta de overlay para OBS Studio diseñada para fiestas y eventos en vivo. Muestra textos gigantes con animaciones llamativas, efectos visuales avanzados, control de tipografías y soporte multi-idioma, todo controlado en tiempo real desde un panel integrado en OBS.

![Vista previa del controlador y el overlay](https://obsproject.com/forum/attachments/captura-de-pantalla-2026-02-15-205224-png.118436/)
![Ejemplo de uso de estilos visuales](https://obsproject.com/forum/attachments/captura-de-pantalla-2026-02-15-205308-png.118437/)

## Novedades de la Versión 2.0 🚀
* **Gestión de Fuentes del Sistema:** Añade y elimina cualquier tipografía local instalada en tu sistema de manera manual sin restricciones de seguridad de OBS.
* **10 Espacios de Frases Guardadas:** Duplicamos el almacenamiento de presets para que tengas más frases rápidas a la mano.
* **Efectos Visuales Premium Dinámicos:** Nuevos estilos avanzados (*Sombra Danzante*, *Texto Derretido*, *Matrix* y *3D Brillante*) adaptables en tiempo real al color y texto seleccionados.
* **Presiona Enter para Mostrar/Ocultar:** Envía o retira el overlay con solo presionar Enter en tu teclado de forma rápida.
* **Selector de Emojis Ampliado:** Repertorio expandido con los emojis más utilizados organizados por categorías.
* **Soporte de Portugués (PT):** Panel completamente traducido a Español, Inglés y Português.

## Instalación

1.  **Ubicación:** Descomprime la carpeta del proyecto en una ubicación fija de tu disco duro (ej: `D:\OBS_Assets\BigTextNow`). No muevas los archivos una vez configurado.

2.  **Configurar el Panel de Control (Dock):**
    *   Abre OBS Studio.
    *   Ve al menú `Paneles` > `Paneles de navegador personalizados...`.
    *   En "Nombre del panel", escribe: `Controlador`.
    *   En "URL", escribe la ruta local al archivo `control.html`.
        *   *Ejemplo:* `file:///D:/OBS_Assets/BigTextNow/control.html`
    *   Haz clic en "Aplicar". Aparecerá el panel, puedes acoplarlo donde quieras en la interfaz de OBS.

3.  **Configurar la Pantalla (Overlay):**
    *   En tu escena, añade una nueva fuente: `Navegador`.
    *   Nómbrala "Big Text Overlay".
    *   **IMPORTANTE:** Desmarca la casilla "Archivo local" (Local file).
    *   En el campo "URL", pega la ruta local al archivo `pantalla.html`.
        *   *Ejemplo:* `file:///D:/OBS_Assets/BigTextNow/pantalla.html`
    *   Establece el Ancho en `1920` y Alto en `1080` (o la resolución base de tu lienzo).
    *   Borra todo el contenido del campo "CSS personalizado".
    *   Haz clic en "Aceptar".

> **Nota:** Es crucial desmarcar "Archivo local" y usar la ruta `file:///` en la fuente de navegador para que el panel de control pueda comunicarse con la pantalla a través del canal de comunicación del navegador.

## Uso

Desde el panel "Controlador" que acabas de instalar:

1.  **Escribir:** Escribe tu mensaje en el campo de texto. Puedes enviar/ocultar marcando la opción *"Mostrar u ocultar presionando Enter"*.
2.  **Personalizar:**
    *   Elige animaciones de entrada y salida.
    *   Selecciona animaciones permanentes (loops) como "Latido" o "Sacudir".
    *   Abre "Más Opciones" para cambiar colores, estilos visuales e instalar tus tipografías favoritas del sistema.
3.  **Mostrar/Ocultar:** Haz clic en los botones respectivos o presiona Enter para cambiar el estado de la palabra en pantalla.

### Características Extra
*   **Frases Guardadas:** Tienes 10 espacios para guardar frases recurrentes de acceso rápido.
*   **Selector de Emojis integrado:** Inserta emojis fácilmente con el botón de carita.
*   **Reset:** Botón al final para restablecer todas las opciones a los valores por defecto.
*   **Multilenguaje:** Cambia entre Español, Inglés y Portugués desde la esquina superior derecha.

---

Desarrollado por Un Tipo Azulado.  
Licencia MIT.

---

<a name="english-version"></a>
# BIG TEXT NOW (v2.0.0) - English Version

An overlay tool for OBS Studio designed for live parties and events. Display giant texts with eye-catching animations, advanced visual effects, custom font control, and multi-language support, all controlled in real-time from an integrated panel in OBS.

![Control panel and overlay preview](https://obsproject.com/forum/attachments/captura-de-pantalla-2026-02-15-205224-png.118436/)
![Example of visual styles usage](https://obsproject.com/forum/attachments/captura-de-pantalla-2026-02-15-205308-png.118437/)

## What's New in Version 2.0 🚀
* **System Font Management:** Manually add and remove any local font installed on your system without OBS security restrictions.
* **10 Saved Phrase Slots:** We doubled the preset storage so you have more quick-access phrases at hand.
* **Dynamic Premium Visual Effects:** New advanced styles (*Dancing Shadow*, *Melting Text*, *Matrix*, and *Glowing 3D*) that adapt in real-time to selected colors and text.
* **Press Enter to Show/Hide:** Quickly toggle the overlay on and off by just pressing Enter on your keyboard.
* **Expanded Emoji Selector:** Expanded selection of the most used emojis organized by categories.
* **Portuguese (PT) Support:** Panel fully translated into Spanish, English, and Portuguese.

## Installation

1. **Location:** Extract the project folder to a fixed location on your hard drive (e.g., `D:\OBS_Assets\BigTextNow`). Do not move the files once configured.

2. **Configure the Control Panel (Dock):**
   * Open OBS Studio.
   * Go to `Docks` > `Custom Browser Docks...`.
   * Under "Dock Name", type: `Control`.
   * Under "URL", type the local path to the `control.html` file.
     * *Example:* `file:///D:/OBS_Assets/BigTextNow/control.html`
   * Click "Apply". The panel will appear; you can dock it anywhere in the OBS interface.

3. **Configure the Screen (Overlay):**
   * In your scene, add a new source: `Browser`.
   * Name it "Big Text Overlay".
   * **IMPORTANT:** Uncheck the "Local file" checkbox.
   * Under "URL", paste the local path to the `pantalla.html` file.
     * *Example:* `file:///D:/OBS_Assets/BigTextNow/pantalla.html`
   * Set Width to `1920` and Height to `1080` (or your base canvas resolution).
   * Clear all content from the "Custom CSS" field.
   * Click "OK".

> **Note:** It is crucial to uncheck "Local file" and use the `file:///` path in the browser source for the control panel to communicate with the screen using the browser's communication channels.

## Usage

From the "Control" panel you just installed:

1. **Type:** Enter your message in the text field. You can show/hide by checking the *"Show or hide by pressing Enter"* option.
2. **Customize:**
   * Choose entrance and exit animations.
   * Select permanent animations (loops) like "Pulse" or "Shake".
   * Open "More Options" to change colors, visual styles, and add your favorite system fonts.
3. **Show/Hide:** Click the respective buttons or press Enter to toggle the overlay state on screen.

### Extra Features
* **Saved Phrases:** You have 10 slots to save recurring phrases for quick access.
* **Integrated Emoji Picker:** Insert emojis easily using the smiley face button.
* **Reset:** Panic button at the bottom to reset all options to defaults.
* **Multi-language:** Switch between Spanish, English, and Portuguese from the top right corner.

---

Developed by Un Tipo Azulado.  
MIT License.