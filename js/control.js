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

    const fuenteSeleccionada = document.getElementById("fuente").value;

    enviar({
        texto: texto,
        entrada: document.getElementById("entrada").value,
        salida: document.getElementById("salida").value,
        permanente: document.getElementById("permanente").value,
        intensidad: document.getElementById("intensidad").value,
        tamano: document.getElementById("tamano").value,
        fuente: fuenteSeleccionada,
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

// --- Funciones del Selector de Emojis ---

function toggleEmojiPicker(event) {
    if (event) event.stopPropagation();
    const picker = document.getElementById("emoji-picker");
    picker.classList.toggle("hidden");
}

function switchEmojiTab(event, tabId) {
    if (event) event.stopPropagation();
    // Ocultar todas las cuadrículas
    document.querySelectorAll(".emoji-grid").forEach(grid => grid.classList.add("hidden"));
    // Mostrar la seleccionada
    document.getElementById("tab-" + tabId).classList.remove("hidden");
    
    // Desactivar todas las pestañas
    document.querySelectorAll(".emoji-picker-tabs .tab-btn").forEach(btn => btn.classList.remove("active"));
    // Activar la pestaña clicada
    if (event) event.currentTarget.classList.add("active");
}

function insertEmoji(emoji) {
    const input = document.getElementById("texto");
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const text = input.value;
    input.value = text.substring(0, start) + emoji + text.substring(end);
    input.focus();
    
    // Posicionar el cursor justo después del emoji insertado
    const newPos = start + emoji.length;
    input.setSelectionRange(newPos, newPos);
    
    // Disparar eventos de input y change para guardar estado
    input.dispatchEvent(new Event('input'));
    guardarEstado();
}



// --- Detección de fuentes instaladas en el sistema ---
const FONTS_CACHE_KEY = "bigTextNowInstalledFonts";

const FONTS_TO_TEST = [
    // Windows - Sans Serif
    "Agency FB", "Algerian", "Arial", "Arial Black",
    "Arial Narrow", "Arial Rounded MT Bold",
    "Bahnschrift", "Calibri", "Calibri Light",
    "Century Gothic", "Corbel", "Franklin Gothic Book",
    "Franklin Gothic Demi", "Franklin Gothic Demi Cond",
    "Franklin Gothic Heavy", "Franklin Gothic Medium",
    "Gadugi", "Haettenschweiler", "Impact",
    "Leelawadee", "Leelawadee UI",
    "Lucida Sans", "Lucida Sans Unicode",
    "Malgun Gothic", "Microsoft JhengHei",
    "Microsoft Sans Serif", "Microsoft Tai Le",
    "Microsoft YaHei", "Microsoft Yi Baiti",
    "Microsoft Himalaya", "Microsoft New Tai Lue",
    "Microsoft PhagsPa", "Microsoft Uighur",
    "MingLiU", "MingLiU-ExtB",
    "MS Gothic", "MS Mincho", "MS PGothic", "MS PMincho",
    "MS Reference Sans Serif", "MS Reference Specialty",
    "Myanmar Text", "Nirmala UI",
    "PMingLiU", "PMingLiU-ExtB",
    "Segoe MDL2 Assets", "Segoe Print", "Segoe Script",
    "Segoe UI", "Segoe UI Emoji", "Segoe UI Historic",
    "Segoe UI Light", "Segoe UI Semibold",
    "Segoe UI Semilight", "Segoe UI Symbol",
    "SimSun", "SimSun-ExtB",
    "Sylfaen", "Tahoma",
    "Trebuchet MS", "Tw Cen MT",
    "Tw Cen MT Condensed", "Tw Cen MT Condensed Extra Bold",
    "Verdana",
    // Windows - Serif
    "Baskerville Old Face", "Bell MT", "Book Antiqua",
    "Bookman Old Style", "Californian FB",
    "Cambria", "Castellar", "Century Schoolbook",
    "Constantia", "Ebrima",
    "Garamond", "Georgia",
    "Gloucester MT Extra Condensed", "Goudy Old Style",
    "Goudy Stout", "High Tower Text",
    "Lucida Bright", "Palatino Linotype",
    "Perpetua", "Perpetua Titling MT",
    "Rockwell", "Rockwell Condensed", "Rockwell Extra Bold",
    "Sitka Banner", "Sitka Display", "Sitka Heading",
    "Sitka Small", "Sitka Subheading", "Sitka Text",
    "Times New Roman",
    // Windows - Mono
    "Consolas", "Courier New", "Lucida Console",
    "Lucida Sans Typewriter", "OCR A Extended",
    // Windows - Script / Handwriting
    "Blackadder ITC", "Bradley Hand ITC",
    "Brush Script MT", "Curlz MT",
    "Edwardian Script ITC", "Freestyle Script",
    "French Script MT", "Harlow Solid Italic",
    "Jokerman", "Juice ITC", "Kristen ITC",
    "Kunstler Script", "Lucida Calligraphy",
    "Lucida Handwriting", "Magneto",
    "Matura MT Script Capitals", "Mistral",
    "Monotype Corsiva", "Old English Text MT",
    "Palace Script MT", "Pristina",
    "Rage Italic", "Ravie", "Script MT Bold",
    "Snap ITC", "Viner Hand ITC", "Vivaldi",
    "Vladimir Script",
    // Windows - Display / Decorative
    "Bauhaus 93", "Berlin Sans FB", "Berlin Sans FB Demi",
    "Bernard MT Condensed", "Bodoni MT",
    "Bodoni MT Black", "Bodoni MT Condensed",
    "Bodoni MT Poster Compressed", "Britannic Bold",
    "Broadway", "Colonna MT", "Cooper Black",
    "Copperplate Gothic Bold", "Copperplate Gothic Light",
    "Desdemona", "Elephant", "Engravers MT",
    "Eras Bold ITC", "Eras Demi ITC",
    "Eras Light ITC", "Eras Medium ITC",
    "Felix Titling", "Footlight MT Light", "Forte",
    "Gabriola", "Gill Sans MT",
    "Gill Sans MT Condensed", "Gill Sans MT Ext Condensed Bold",
    "Harrington", "Hobo Std",
    "Imprint MT Shadow", "Informal Roman",
    "Javanese Text", "Maiandra GD",
    "Niagara Engraved", "Niagara Solid",
    "Onyx", "Papyrus", "Parchment",
    "Playbill", "Poor Richard",
    "Sakkal Majalla", "Showcard Gothic",
    "Stencil", "Tempus Sans ITC", "Wingdings",
    "Wingdings 2", "Wingdings 3",
    "Yu Gothic", "Yu Gothic Light", "Yu Gothic Medium",
    "Yu Mincho", "Yu Mincho Demibold", "Yu Mincho Light",
    // macOS
    "Apple Color Emoji", "Apple SD Gothic Neo",
    "Apple Chancery", "Apple Symbols",
    "Ayuthaya", "Beirut",
    "Bodoni 72", "Bradley Hand",
    "Chalkboard", "Chalkboard SE", "Charter",
    "Copperplate", "Didot",
    "Futura", "Geneva", "Gill Sans",
    "Helvetica", "Helvetica Neue",
    "Hiragino Kaku Gothic ProN", "Hiragino Mincho ProN",
    "Hiragino Sans", "Hoefler Text",
    "Krungthep", "Lucida Grande",
    "Marker Felt", "Menlo", "Monaco",
    "Noteworthy", "Optima", "Palatino",
    "Phosphate", "PingFang HK", "PingFang SC",
    "PingFang TC", "Plantagenet Cherokee",
    "Savoye LET", "Seravek", "Silom",
    "Skia", "Snell Roundhand", "Sukhumvit Set",
    "Thonburi", "Trattatello",
    "Waseem", "Zapf Dingbats", "Zapfino",
    // Linux / Multiplataforma
    "Ubuntu", "Ubuntu Mono",
    "Liberation Mono", "Liberation Sans", "Liberation Serif",
    "DejaVu Sans Mono", "DejaVu Sans", "DejaVu Serif",
    "Noto Mono", "Noto Sans", "Noto Serif",
    "Noto Kufi Arabic", "Noto Naskh Arabic",
    "Droid Sans Mono", "Droid Sans", "Droid Serif",
    "FreeMono", "FreeSans", "FreeSerif",
    "Open Sans", "Roboto", "Roboto Condensed",
    "Roboto Mono", "Lato", "Montserrat",
    "Oswald", "Raleway", "Merriweather",
    "Playfair Display", "Source Sans Pro",
    "Source Serif Pro", "Source Code Pro",
    "Lora", "Inconsolata", "Poppins",
    "Work Sans", "Exo", "Exo 2",
    "Fira Sans", "Fira Mono", "Fira Code",
    "Avenir", "Avenir Next", "DIN",
    "DIN Condensed", "Eurostile", "Frutiger",
    "Gotham", "Helvetica Now", "Minion Pro",
    "Myriad Pro", "Optima", "Proxima Nova",
    "Trade Gothic", "Univers", "Whitney"
];

function detectarFuentesInstaladas() {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const testStr = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    ctx.font = "72px monospace";
    const baseWidth = ctx.measureText(testStr).width;

    const disponibles = [];
    for (const fontName of FONTS_TO_TEST) {
        try {
            ctx.font = '72px "' + fontName + '", monospace';
            const w = ctx.measureText(testStr).width;
            if (w !== baseWidth) {
                disponibles.push(fontName);
            }
        } catch (e) {
            // Ignorar errores con nombres no válidos
        }
    }

    localStorage.setItem(FONTS_CACHE_KEY, JSON.stringify(disponibles));
    return disponibles;
}

function poblarSelectorFuentes() {
    const select = document.getElementById("fuente");
    if (!select) return;

    // Obtener las fuentes ya representadas en las opciones hardcodeadas
    const existentes = new Set();
    Array.from(select.options).forEach(opt => {
        if (opt.value && opt.value !== "default") {
            const name = opt.value.replace(/['"]/g, "").split(",")[0].trim();
            existentes.add(name.toLowerCase());
        }
    });

    // Remover opciones de detección previa (las que NO contienen coma en su value)
    const optionsToRemove = [];
    Array.from(select.options).forEach(opt => {
        if (opt.value && opt.value !== "default" && !opt.value.includes(",")) {
            optionsToRemove.push(opt);
        }
    });
    optionsToRemove.forEach(opt => opt.remove());

    // Usar detección por lista predefinida
    let fuentes = [];
    const cached = localStorage.getItem(FONTS_CACHE_KEY);
    if (cached) {
        try { fuentes = JSON.parse(cached); } catch (e) { }
    }
    if (fuentes.length === 0) {
        fuentes = detectarFuentesInstaladas();
    }

    // Filtrar fuentes que ya están en el select hardcodeado
    const nuevas = fuentes.filter(f => !existentes.has(f.toLowerCase())).sort();

    if (nuevas.length === 0) return;

    // Separador visual (solo si hay fuentes hardcodeadas además de default)
    if (select.options.length > 1) {
        const sep = document.createElement("option");
        sep.disabled = true;
        sep.textContent = "─── Fuentes detectadas ───";
        select.appendChild(sep);
    }

    // Agregar cada fuente detectada
    for (const fontName of nuevas) {
        const opt = document.createElement("option");
        opt.value = '"' + fontName + '"';
        opt.textContent = fontName;
        select.appendChild(opt);
    }
}

// Cerrar selector al hacer clic fuera
document.addEventListener("click", (event) => {
    const picker = document.getElementById("emoji-picker");
    const trigger = document.getElementById("emoji-trigger-btn");
    if (picker && !picker.classList.contains("hidden") && !picker.contains(event.target) && event.target !== trigger) {
        picker.classList.add("hidden");
    }
});

// Inicialización al cargar
window.addEventListener("load", () => {
    // 0. Poblar selector con fuentes del sistema detectadas
    poblarSelectorFuentes();

    // 1. Cargar el estado guardado de los controles
    cargarEstado();

    // Cargar presets guardados
    for(let i=1; i<=5; i++) {
        const val = localStorage.getItem("preset_" + i);
        if(val) document.getElementById("preset" + i).value = val;
    }

    // 2. Inicializar/actualizar visuales que no se restauran solo con .value
    actualizarColorInput(document.getElementById("colorTexto"));

    const idsParaGuardar = ['texto', 'entrada', 'salida', 'permanente', 'intensidad', 'colorTexto', 'estilo', 'tamano', 'fuente', 'language'];
    idsParaGuardar.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            const eventType = (el.tagName === 'SELECT' || el.type === 'color') ? 'change' : 'input';
            el.addEventListener(eventType, guardarEstado);
        }
    });
});
