const STORAGE_KEY = "overlayData";
const bc = new BroadcastChannel('obs_overlay_channel');
const CONTROL_STATE_KEY = "bigTextNowControlState"; // Clave para guardar el estado de los controles
let overlayVisible = false;

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
    overlayVisible = true;
}

function ocultar(){
    enviar({
        accion: "ocultar"
    });
    overlayVisible = false;
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
        toggleEnter: document.getElementById("toggleEnter") ? document.getElementById("toggleEnter").checked : false,
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

        const toggleCheckbox = document.getElementById("toggleEnter");
        if (toggleCheckbox && estado.toggleEnter !== undefined) {
            toggleCheckbox.checked = estado.toggleEnter;
        }

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
        
        const toggleCheckbox = document.getElementById("toggleEnter");
        if (toggleCheckbox) {
            toggleCheckbox.checked = false;
        }

        // Borrar la configuración guardada para que la próxima vez cargue los defaults del HTML
        localStorage.removeItem(CONTROL_STATE_KEY);
        localStorage.removeItem(FONTS_CACHE_KEY);
        poblarSelectorFuentes();
    }
}

// --- Sistema de Idiomas ---

const translations = {
    es: {
        title: "Control BIG TEXT NOW",
        text_label: "Texto",
        toggle_enter_label: "Mostrar u ocultar presionando Enter",
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
        add_font_placeholder: "Nombre de fuente instalada...",
        btn_delete_title: "Eliminar fuente manual seleccionada",
        only_manual_delete_msg: "Solo puedes eliminar fuentes agregadas manualmente.",
        font_exists_msg: "Esta fuente ya está en la lista.",
        font_tip: "⚠️ Para añadir una fuente del sistema, escribe su nombre exacto y asegúrate de tenerla instalada para que se renderice correctamente.",
        reset_confirm: "¿Estás seguro de que quieres restablecer todas las opciones a sus valores por defecto?",
        footer: "v2.0.0 | Desarrollado por Un Tipo Azulado con asistencia de IA",
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
            metal: "Metálico", retro: "Retro (Vaporwave)", hielo: "Hielo (Frozen)", terror: "Terror (Sangre)",
            dance: "Sombra Danzante (Dancing Shadow)", melting: "Texto Derretido (Melting Text)", 
            matrix: "Matriz (Matrix)", glow3d: "3D Brillante (Glowing 3D)"
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
        toggle_enter_label: "Show or hide by pressing Enter",
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
        add_font_placeholder: "Installed font name...",
        btn_delete_title: "Delete selected manual font",
        only_manual_delete_msg: "You can only delete manually added fonts.",
        font_exists_msg: "This font is already in the list.",
        font_tip: "⚠️ To add a system font, write its exact name and make sure you have it installed for it to render correctly.",
        reset_confirm: "Are you sure you want to reset all options to their default values?",
        footer: "v2.0.0 | Developed by Un Tipo Azulado with AI assistance",
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
            metal: "Metallic", retro: "Retro (Vaporwave)", hielo: "Ice (Frozen)", terror: "Horror (Blood)",
            dance: "Dancing Shadow", melting: "Melting Text", 
            matrix: "Matrix", glow3d: "Glowing 3D"
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
    },
    pt: {
        title: "Controle BIG TEXT NOW",
        text_label: "Texto",
        toggle_enter_label: "Mostrar ou ocultar pressionando Enter",
        anim_in: "Animação de Entrada",
        anim_out: "Animação de Saída",
        anim_loop: "Animação Permanente (Loop)",
        intensity: "Intensidade da Animação (1x - 3x)",
        more_opts: "Mais Opções (Cor, Estilo, Fonte)",
        color_label: "Cor Base",
        style_label: "Estilo Visual",
        size_label: "Tamanho da Fonte",
        font_label: "Tipografía (Fonte)",
        btn_show: "Mostrar",
        btn_hide: "Ocultar",
        saved_phrases: "Frases Salvas",
        btn_load: "Carregar",
        btn_reset: "Redefinir Tudo",
        add_font_placeholder: "Nome da fonte instalada...",
        btn_delete_title: "Excluir fonte manual selecionada",
        only_manual_delete_msg: "Você só pode excluir fontes adicionadas manualmente.",
        font_exists_msg: "Esta fonte já está na lista.",
        font_tip: "⚠️ Para adicionar uma fonte do sistema, escreva o nome exato dela e certifique-se de tê-la instalada para que seja renderizada corretamente.",
        reset_confirm: "Tem certeza que deseja redefinir todas as opções para os valores padrão?",
        footer: "v2.0.0 | Desenvolvido por Un Tipo Azulado com assistência de IA",
        // Opções de Selects
        entrada: {
            impacto: "Impacto", fade: "Fade", zoom: "Zoom", caida: "Queda", disco: "Disco (Giro)", 
            glitch: "Glitch Digital", elastico: "Super Elástico", maquina: "Máquina de Escrever", 
            remolino: "Redemoinho", enfoque: "Foco Suave"
        },
        salida: {
            fadeUp: "Fade para Cima", zoomOut: "Zoom Out", explode: "Explosão", deslizar: "Deslizar Rápido", 
            cortina: "Cortina", agujero: "Buraco Negro", cohete: "Foguete (Para Cima)"
        },
        permanente: {
            ninguna: "Nenhuma (Estático)", latido: "Pulsar", temblor: "Tremor", 
            sacudir: "Sacudir (Terremoto)", onda: "Onda", flotar: "Flutuar Suave", 
            flotar_agresivo: "Flutuar Agressivo (Estilo Canva)", giro3d: "Giro 3D Lento", balanceo: "Balanço"
        },
        estilo: {
            normal: "Normal (Plano)", neon: "Neon Party (Brilho)", fuego: "Fogo Intenso", arcoiris: "Arco-íris", 
            tresd: "3D Pop", cyber: "Cyberpunk", comic: "Comic (Borda Preta)", elegante: "Elegante (Dourado)", 
            metal: "Metálico", retro: "Retro (Vaporwave)", hielo: "Gelo (Frozen)", terror: "Terror (Sangre)",
            dance: "Sombra Dançante (Dancing Shadow)", melting: "Texto Derretido (Melting Text)", 
            matrix: "Matrix", glow3d: "3D Brilhante (Glowing 3D)"
        },
        tamano: {
            auto: "Automático (Ajustável)", "300": "Gigante (300px)", "200": "Grande (200px)", 
            "150": "Médio (150px)", "100": "Pequeno (100px)", "60": "Texto Longo (60px)"
        },
        fuente: {
            default: "Padrão (Sistema)", "'Arial Black', Gadget, sans-serif": "Grossa (Arial Black)", 
            "'Courier New', Courier, monospace": "Máquina (Courier)", "'Brush Script MT', cursive": "Manuscrita (Script)", 
            "'Times New Roman', Times, serif": "Clássica (Serif)", "Impact, Charcoal, sans-serif": "Impacto (Meme)",
            "'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', sans-serif": "Divertida (Comic)", "'Verdana', Geneva, sans-serif": "Larga (Verdana)"
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
    for(let i=1; i<=10; i++) {
        const input = document.getElementById("preset" + i);
        if(input) input.placeholder = lang === 'en' ? "Phrase " + i : "Frase " + i;
    }

    // 4. Traducir placeholder, título y tip de fuente manual
    const inputNuevaFuente = document.getElementById("nuevaFuente");
    if(inputNuevaFuente) {
        inputNuevaFuente.placeholder = t.add_font_placeholder;
    }
    const btnEliminarFuente = document.getElementById("btn-eliminar-fuente");
    if(btnEliminarFuente) {
        btnEliminarFuente.title = t.btn_delete_title;
    }
    const fontTip = document.querySelector(".font-tip");
    if(fontTip) {
        fontTip.textContent = t.font_tip;
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

async function detectarFuentesInstaladas() {
    let disponibles = [];

    // 1. Intentar usar la API moderna de acceso a fuentes locales (obtiene todas las fuentes instaladas en el equipo, incluidas las descargadas a mano)
    if (window.queryLocalFonts) {
        try {
            const localFonts = await window.queryLocalFonts();
            const uniqueFamilies = new Set();
            for (const font of localFonts) {
                uniqueFamilies.add(font.family);
            }
            disponibles = Array.from(uniqueFamilies);
            localStorage.setItem(FONTS_CACHE_KEY, JSON.stringify(disponibles));
            return disponibles;
        } catch (e) {
            console.warn("No se pudo usar queryLocalFonts (permiso denegado o error):", e);
        }
    }

    // 2. Si la API no está disponible o falla, usar el método tradicional de comprobación de Canvas
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const testStr = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    ctx.font = "72px monospace";
    const baseWidth = ctx.measureText(testStr).width;

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

async function poblarSelectorFuentes(forzar = false) {
    const select = document.getElementById("fuente");
    if (!select) return;

    // Guardar la selección actual para no perderla al repoblar
    const valorSeleccionado = select.value;

    // Remover TODAS las opciones creadas dinámicamente en ejecuciones anteriores
    select.querySelectorAll(".dynamic-font-option").forEach(opt => opt.remove());

    // Obtener las fuentes ya representadas en las opciones fijas (hardcodeadas) para no duplicarlas
    const existentes = new Set();
    Array.from(select.options).forEach(opt => {
        if (opt.value && opt.value !== "default") {
            const name = opt.value.replace(/['"]/g, "").split(",")[0].trim();
            existentes.add(name.toLowerCase());
        }
    });

    // 1. Obtener Fuentes Agregadas Manualmente
    let manuales = [];
    const cachedManual = localStorage.getItem("bigTextNowManualFonts");
    if (cachedManual) {
        try { manuales = JSON.parse(cachedManual); } catch (e) {}
    }
    // Filtrar duplicados con las fijas
    const manualesFiltradas = manuales.filter(f => !existentes.has(f.toLowerCase())).sort();

    // 2. Obtener Fuentes Detectadas Automáticamente (API / Canvas)
    let detectadas = [];
    if (!forzar) {
        const cachedDetectadas = localStorage.getItem(FONTS_CACHE_KEY);
        if (cachedDetectadas) {
            try { detectadas = JSON.parse(cachedDetectadas); } catch (e) { }
        }
    }
    if (detectadas.length === 0) {
        detectadas = await detectarFuentesInstaladas();
    }
    // Filtrar duplicados con las fijas y las manuales
    const detectadasFiltradas = detectadas.filter(f => {
        const lower = f.toLowerCase();
        return !existentes.has(lower) && !manualesFiltradas.some(m => m.toLowerCase() === lower);
    }).sort();

    // 3. Añadir al Dropdown
    // A) Fuentes Manuales
    if (manualesFiltradas.length > 0) {
        const sep = document.createElement("option");
        sep.disabled = true;
        sep.textContent = "─── Fuentes añadidas ───";
        sep.classList.add("dynamic-font-option");
        select.appendChild(sep);

        for (const fontName of manualesFiltradas) {
            const opt = document.createElement("option");
            opt.value = '"' + fontName + '"';
            opt.textContent = fontName;
            opt.classList.add("dynamic-font-option");
            select.appendChild(opt);
        }
    }

    // B) Fuentes Detectadas
    if (detectadasFiltradas.length > 0) {
        const sep = document.createElement("option");
        sep.disabled = true;
        sep.textContent = "─── Fuentes detectadas ───";
        sep.classList.add("dynamic-font-option");
        select.appendChild(sep);

        for (const fontName of detectadasFiltradas) {
            const opt = document.createElement("option");
            opt.value = '"' + fontName + '"';
            opt.textContent = fontName;
            opt.classList.add("dynamic-font-option");
            select.appendChild(opt);
        }
    }

    // Restaurar selección previa si aún existe
    if (valorSeleccionado) {
        select.value = valorSeleccionado;
    }
}

async function escanearFuentes() {
    await poblarSelectorFuentes(true);
}

function agregarFuenteManual() {
    const input = document.getElementById("nuevaFuente");
    if (!input) return;

    const fontName = input.value.trim();
    if (!fontName) return;

    const lang = document.getElementById("language").value;
    const select = document.getElementById("fuente");

    // Comprobar si ya existe en las fijas
    const fijas = new Set();
    if (select) {
        Array.from(select.options).forEach(opt => {
            if (opt.value && opt.value !== "default" && !opt.classList.contains("dynamic-font-option")) {
                const name = opt.value.replace(/['"]/g, "").split(",")[0].trim();
                fijas.add(name.toLowerCase());
            }
        });
    }

    if (fijas.has(fontName.toLowerCase())) {
        alert(translations[lang].font_exists_msg);
        return;
    }

    // Leer manuales
    let manuales = [];
    const cached = localStorage.getItem("bigTextNowManualFonts");
    if (cached) {
        try { manuales = JSON.parse(cached); } catch (e) {}
    }

    // Comprobar si ya está en las manuales
    if (manuales.some(m => m.toLowerCase() === fontName.toLowerCase())) {
        alert(translations[lang].font_exists_msg);
        return;
    }

    // Guardar
    manuales.push(fontName);
    localStorage.setItem("bigTextNowManualFonts", JSON.stringify(manuales));

    // Limpiar input y actualizar dropdown
    input.value = "";
    poblarSelectorFuentes().then(() => {
        // Seleccionar la nueva fuente automáticamente
        if (select) {
            select.value = '"' + fontName + '"';
            guardarEstado();
        }
    });
}

function eliminarFuenteManual() {
    const select = document.getElementById("fuente");
    if (!select) return;

    const valorSeleccionado = select.value;
    if (!valorSeleccionado || valorSeleccionado === "default") return;

    // Extraer el nombre de la fuente de las comillas
    const fontName = valorSeleccionado.replace(/['"]/g, "").trim();
    const lang = document.getElementById("language").value;

    // Leer manuales
    let manuales = [];
    const cached = localStorage.getItem("bigTextNowManualFonts");
    if (cached) {
        try { manuales = JSON.parse(cached); } catch (e) {}
    }

    const index = manuales.findIndex(m => m.toLowerCase() === fontName.toLowerCase());
    if (index > -1) {
        manuales.splice(index, 1);
        localStorage.setItem("bigTextNowManualFonts", JSON.stringify(manuales));

        // Regresar a la fuente por defecto y repoblar
        select.value = "default";
        poblarSelectorFuentes().then(() => {
            guardarEstado();
        });
    } else {
        alert(translations[lang].only_manual_delete_msg);
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
window.addEventListener("load", async () => {
    // 0. Poblar selector con fuentes del sistema detectadas
    await poblarSelectorFuentes();

    // 1. Cargar el estado guardado de los controles
    cargarEstado();

    // Cargar presets guardados
    for(let i=1; i<=10; i++) {
        const val = localStorage.getItem("preset_" + i);
        if(val) document.getElementById("preset" + i).value = val;
    }

    // 2. Inicializar/actualizar visuales que no se restauran solo con .value
    actualizarColorInput(document.getElementById("colorTexto"));

    // 3. Registrar listener para la tecla Enter en el cuadro de texto
    const textoInput = document.getElementById("texto");
    if (textoInput) {
        textoInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                const toggleCheckbox = document.getElementById("toggleEnter");
                if (toggleCheckbox && toggleCheckbox.checked) {
                    e.preventDefault();
                    if (overlayVisible) {
                        ocultar();
                    } else {
                        mostrar();
                    }
                }
            }
        });
    }

    const idsParaGuardar = ['texto', 'entrada', 'salida', 'permanente', 'intensidad', 'colorTexto', 'estilo', 'tamano', 'fuente', 'language', 'toggleEnter'];
    idsParaGuardar.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            const eventType = (el.tagName === 'SELECT' || el.type === 'color' || el.type === 'checkbox') ? 'change' : 'input';
            el.addEventListener(eventType, guardarEstado);
        }
    });
});
