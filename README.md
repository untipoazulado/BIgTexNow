# BIG TEXT NOW

Una herramienta de overlay para OBS Studio diseñada para fiestas y eventos en vivo. Muestra textos gigantes con animaciones llamativas, efectos de neón, fuego, y más, todo controlado desde un panel integrado en OBS.

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
    *   Establece el Ancho en `1920` y Alto en `1080` (o la resolución base de tu lienzo) aunque aquí te recomiendo probar el que mejor se adapte a lo que suele hacer.
    *   Borra todo el contenido del campo "CSS personalizado".
    *   Haz clic en "Aceptar".

> **Nota:** Es crucial desmarcar "Archivo local" y usar la ruta `file:///` en la fuente de navegador para que el panel de control pueda comunicarse con la pantalla.

## Uso

Desde el panel "Controlador" que acabas de instalar:

1.  **Escribir:** Escribe tu mensaje en el campo de texto.
2.  **Personalizar:**
    *   Elige animaciones de entrada y salida.
    *   Selecciona animaciones permanentes (loops) como "Latido" o "Sacudir".
    *   Abre "Más Opciones" para cambiar colores, estilos (Neón, Cyberpunk, Fuego...) y fuentes.
3.  **Mostrar:** Haz clic en "Mostrar" para lanzar el texto a la pantalla.
4.  **Ocultar:** Haz clic en "Ocultar" para sacarlo con la animación de salida seleccionada.

### Características Extra
*   **Frases Guardadas:** Tienes 5 espacios para guardar frases recurrentes. Escribe y se guardan solas.
*   **Reset:** Botón de pánico al final para volver a la configuración por defecto.
*   **Idiomas:** Cambia entre Español e Inglés desde la esquina superior derecha.

---
Desarrollado por Un Tipo Azulado.
Licencia MIT.