const STORAGE_KEY = "overlayData";
const bc = new BroadcastChannel('obs_overlay_channel');
const CONTROL_STATE_KEY = "bigTextNowControlState"; // Clave para guardar el estado de los controles

function enviar(datos){
    const payload = {
        ...datos,
        timestamp: Date.now()
    };

    // 1. Envío directo e instantáneo para OBS (BroadcastChannel)
    bc.postMessage(payload);

    // 2. Respaldo en disco para persistencia (LocalStorage)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function mostrar(){
    const texto = document.getElementById("texto").value.toUpperCase();
    if(!texto) return; // Validación básica

    enviar({
        texto: texto,
        entrada: document.getElementById("entrada").value,
        salida: document.getElementById("salida").value,
        permanente: document.getElementById("permanente").value,
        intensidad: document.getElementById("intensidad").value,
        tamano: document.getElementById("tamano").value,
        fuente: document.getElementById("fuente").value,
        color: document.getElementById("colorTexto").value,
        estilo: document.getElementById("estilo").value,
        accion: "mostrar"
    });
}

function ocultar(){
    enviar({
        accion: "ocultar"
    });
}

// --- Funciones Nuevas ---

function guardarEstado() {
    const estado = {
        texto: document.getElementById("texto").value,
        entrada: document.getElementById("entrada").value,
        salida: document.getElementById("salida").value,
        permanente: document.getElementById("permanente").value,
        intensidad: document.getElementById("intensidad").value,
        colorTexto: document.getElementById("colorTexto").value,
        estilo: document.getElementById("estilo").value,
        tamano: document.getElementById("tamano").value,
        fuente: document.getElementById("fuente").value,
        language: document.getElementById("language").value
    };
    localStorage.setItem(CONTROL_STATE_KEY, JSON.stringify(estado));
}

function cargarEstado() {
    const estadoGuardado = localStorage.getItem(CONTROL_STATE_KEY);
    if (estadoGuardado) {
        const estado = JSON.parse(estadoGuardado);
        
        const ids = ['texto', 'entrada', 'salida', 'permanente', 'intensidad', 'colorTexto', 'estilo', 'tamano', 'fuente', 'language'];
        
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (el && estado[id] !== undefined) {
                el.value = estado[id];
            }
        });

        cambiarIdioma(document.getElementById("language").value);
    }
}

function actualizarColorInput(input) {
    // Fuerza el cambio de fondo para que sea visible en OBS
    input.style.backgroundColor = input.value;
}

function guardarPreset(id) {
    const val = document.getElementById("preset" + id).value;
    localStorage.setItem("preset_" + id, val);
}

function cargarPreset(id) {
    const val = document.getElementById("preset" + id).value;
    if(val) {
        document.getElementById("texto").value = val;
    }
}

function resetearTodo() {
    const lang = document.getElementById("language").value;
    const msg = translations[lang].reset_confirm;
    
    if (confirm(msg)) {
        document.getElementById("texto").value = "";
        document.getElementById("entrada").value = "impacto";
        document.getElementById("salida").value = "fadeUp";
        document.getElementById("permanente").value = "ninguna";
        document.getElementById("intensidad").value = "1";
        
        const colorInput = document.getElementById("colorTexto");
        colorInput.value = "#ffffff";
        actualizarColorInput(colorInput);
        
        document.getElementById("estilo").value = "normal";
        document.getElementById("tamano").value = "auto";
        document.getElementById("fuente").value = "default";

        // Borrar la configuración guardada para que la próxima vez cargue los defaults del HTML
        localStorage.removeItem(CONTROL_STATE_KEY);
    }
}

// --- Sistema de Idiomas ---

const translations = {
    es: {
        title: "Control BIG TEXT NOW",
        text_label: "Texto",
        anim_in: "Animación Entrada",
        anim_out: "Animación Salida",
        anim_loop: "Animación Permanente (Loop)",
        intensity: "Intensidad Animación (1x - 3x)",
        more_opts: "Más Opciones (Color, Estilo, Fuente)",
        color_label: "Color Base",
        style_label: "Estilo Visual",
        size_label: "Tamaño Fuente",
        font_label: "Tipografía (Fuente)",
        btn_show: "Mostrar",
        btn_hide: "Ocultar",
        saved_phrases: "Frases Guardadas",
        btn_load: "Cargar",
        btn_reset: "Resetear Todo",
        reset_confirm: "¿Estás seguro de que quieres restablecer todas las opciones a sus valores por defecto?",
        footer: "Desarrollado por Un Tipo Azulado con asistencia de IA",
        // Opciones de Selects
        entrada: {
            impacto: "Impacto", fade: "Fade", zoom: "Zoom", caida: "Caída", disco: "Disco (Giro)", 
            glitch: "Glitch Digital", elastico: "Súper Elástico", maquina: "Máquina de Escribir", 
            remolino: "Remolino", enfoque: "Enfoque Suave"
        },
        salida: {
            fadeUp: "Fade Arriba", zoomOut: "Zoom Out", explode: "Explosión", deslizar: "Deslizar Rápido", 
            cortina: "Cortina", agujero: "Agujero Negro", cohete: "Cohete (Arriba)"
        },
        permanente: {
            ninguna: "Ninguna (Estático)", latido: "Latido (Pulse)", temblor: "Temblor (Shake)", 
            sacudir: "Sacudir (Terremoto)", onda: "Onda (Wave)", flotar: "Flotar Suave", 
            flotar_agresivo: "Flotar Agresivo (Estilo Canva)", giro3d: "Giro 3D Lento", balanceo: "Balanceo"
        },
        estilo: {
            normal: "Normal (Plano)", neon: "Neón Party (Brillo)", fuego: "Fuego Intenso", arcoiris: "Arcoíris", 
            tresd: "3D Pop", cyber: "Cyberpunk", comic: "Cómic (Borde Negro)", elegante: "Elegante (Dorado)", 
            metal: "Metálico", retro: "Retro (Vaporwave)", hielo: "Hielo (Frozen)", terror: "Terror (Sangre)"
        },
        tamano: {
            auto: "Automático (Ajustable)", "300": "Gigante (300px)", "200": "Grande (200px)", 
            "150": "Mediano (150px)", "100": "Pequeño (100px)", "60": "Texto Largo (60px)"
        },
        fuente: {
            default: "Por Defecto (Sistema)", "'Arial Black', Gadget, sans-serif": "Gruesa (Arial Black)", 
            "'Courier New', Courier, monospace": "Máquina (Courier)", "'Brush Script MT', cursive": "Manuscrita (Script)", 
            "'Times New Roman', Times, serif": "Clásica (Serif)", "Impact, Charcoal, sans-serif": "Impacto (Meme)",
            "'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', sans-serif": "Divertida (Comic)", "'Verdana', Geneva, sans-serif": "Ancha (Verdana)"
        }
    },
    en: {
        title: "BIG TEXT NOW Control",
        text_label: "Text",
        anim_in: "Entrance Animation",
        anim_out: "Exit Animation",
        anim_loop: "Permanent Animation (Loop)",
        intensity: "Animation Intensity (1x - 3x)",
        more_opts: "More Options (Color, Style, Font)",
        color_label: "Base Color",
        style_label: "Visual Style",
        size_label: "Font Size",
        font_label: "Typography (Font)",
        btn_show: "Show",
        btn_hide: "Hide",
        saved_phrases: "Saved Phrases",
        btn_load: "Load",
        btn_reset: "Reset All",
        reset_confirm: "Are you sure you want to reset all options to their default values?",
        footer: "Developed by Un Tipo Azulado with AI assistance",
        // Select Options
        entrada: {
            impacto: "Impact", fade: "Fade", zoom: "Zoom", caida: "Drop", disco: "Disco (Spin)", 
            glitch: "Digital Glitch", elastico: "Super Elastic", maquina: "Typewriter", 
            remolino: "Swirl", enfoque: "Soft Focus"
        },
        salida: {
            fadeUp: "Fade Up", zoomOut: "Zoom Out", explode: "Explosion", deslizar: "Fast Slide", 
            cortina: "Curtain", agujero: "Black Hole", cohete: "Rocket (Up)"
        },
        permanente: {
            ninguna: "None (Static)", latido: "Pulse", temblor: "Shake", 
            sacudir: "Earthquake", onda: "Wave", flotar: "Soft Float", 
            flotar_agresivo: "Aggressive Float (Canva Style)", giro3d: "Slow 3D Spin", balanceo: "Swing"
        },
        estilo: {
            normal: "Normal (Flat)", neon: "Neon Party (Glow)", fuego: "Intense Fire", arcoiris: "Rainbow", 
            tresd: "3D Pop", cyber: "Cyberpunk", comic: "Comic (Black Border)", elegante: "Elegant (Gold)", 
            metal: "Metallic", retro: "Retro (Vaporwave)", hielo: "Ice (Frozen)", terror: "Horror (Blood)"
        },
        tamano: {
            auto: "Automatic (Adjustable)", "300": "Giant (300px)", "200": "Large (200px)", 
            "150": "Medium (150px)", "100": "Small (100px)", "60": "Long Text (60px)"
        },
        fuente: {
            default: "Default (System)", "'Arial Black', Gadget, sans-serif": "Thick (Arial Black)", 
            "'Courier New', Courier, monospace": "Machine (Courier)", "'Brush Script MT', cursive": "Handwritten (Script)", 
            "'Times New Roman', Times, serif": "Classic (Serif)", "Impact, Charcoal, sans-serif": "Impact (Meme)",
            "'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', sans-serif": "Fun (Comic)", "'Verdana', Geneva, sans-serif": "Wide (Verdana)"
        }
    }
};

function cambiarIdioma(lang) {
    const t = translations[lang];
    
    // 1. Traducir etiquetas y textos estáticos
    document.querySelectorAll('[data-lang]').forEach(el => {
        const key = el.getAttribute('data-lang');
        if (t[key]) el.textContent = t[key];
    });

    // 2. Traducir opciones de los select
    const selects = ['entrada', 'salida', 'permanente', 'estilo', 'tamano', 'fuente'];
    selects.forEach(id => {
        const select = document.getElementById(id);
        if(select && t[id]) {
            Array.from(select.options).forEach(opt => {
                if(t[id][opt.value]) opt.text = t[id][opt.value];
            });
        }
    });
    
    // 3. Traducir placeholders de presets
    for(let i=1; i<=5; i++) {
        const input = document.getElementById("preset" + i);
        if(input) input.placeholder = lang === 'en' ? "Phrase " + i : "Frase " + i;
    }
}

// Inicialización al cargar
window.addEventListener("load", () => {
    // 1. Cargar el estado guardado de los controles
    cargarEstado();

    // Cargar presets guardados
    for(let i=1; i<=5; i++) {
        const val = localStorage.getItem("preset_" + i);
        if(val) document.getElementById("preset" + i).value = val;
    }

    // 2. Inicializar/actualizar visuales que no se restauran solo con .value
    actualizarColorInput(document.getElementById("colorTexto"));

    // 3. Añadir listeners para guardar automáticamente cualquier cambio
    const idsParaGuardar = ['texto', 'entrada', 'salida', 'permanente', 'intensidad', 'colorTexto', 'estilo', 'tamano', 'fuente', 'language'];
    idsParaGuardar.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            const eventType = (el.tagName === 'SELECT' || el.type === 'color') ? 'change' : 'input';
            el.addEventListener(eventType, guardarEstado);
        }
    });
});
