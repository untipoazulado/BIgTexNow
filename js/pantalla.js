const STORAGE_KEY = "overlayData";
const bc = new BroadcastChannel('obs_overlay_channel');
let animacionSalida = "fadeUp";
let lastTimestamp = 0;
let loopAnimation = null; // Variable para controlar el inicio del loop

// Configuración GSAP para evitar warnings en OBS
gsap.config({ nullTargetWarn: false });

function ajustarTamano(tamanoFijo){
    const texto = document.getElementById("texto");
    
    // Si se seleccionó un tamaño específico, lo aplicamos y salimos
    if (tamanoFijo && tamanoFijo !== "auto") {
        texto.style.fontSize = tamanoFijo + "px";
        texto.style.lineHeight = "1.1";
        return;
    }
    
    // Reiniciar a un tamaño grande base
    let size = 200;
    texto.style.fontSize = size + "px";
    texto.style.lineHeight = "1.1";

    // Ajustar mientras el texto se salga del contenedor (alto o ancho)
    // Usamos un bucle seguro para evitar bloqueos
    while(
        (texto.scrollHeight > window.innerHeight * 0.9 || texto.scrollWidth > window.innerWidth * 0.95) && 
        size > 40
    ){
        size -= 5;
        texto.style.fontSize = size + "px";
    }
}

function renderTexto(data){
    const cont = document.getElementById("texto");
    
    // Limpiar animaciones previas para evitar conflictos
    gsap.killTweensOf(cont);
    gsap.killTweensOf(".letra");
    
    // Cancelar cualquier loop pendiente
    if (loopAnimation) loopAnimation.kill();
    
    cont.innerHTML = "";
    
    // Aplicar estilos visuales
    cont.className = ""; // Limpiar clases anteriores
    if(data.estilo && data.estilo !== "normal") cont.classList.add(data.estilo);
    cont.style.color = data.color || "#ffffff";
    
    // Aplicar fuente
    if (data.fuente && data.fuente !== "default") {
        cont.style.fontFamily = data.fuente;
    } else {
        cont.style.fontFamily = ""; // Restaurar por defecto
    }

    // Restaurar propiedades del contenedor
    gsap.set(cont, { opacity: 1, clearProps: "transform" });

    // Dividir por palabras para respetar el wrapping
    const palabras = data.texto.split(" ");
    palabras.forEach((palabra, index) => {
        const wordSpan = document.createElement("span");
        wordSpan.classList.add("palabra");
        
        palabra.split("").forEach(char => {
            const span = document.createElement("span");
            span.classList.add("letra");
            span.textContent = char;
            wordSpan.appendChild(span);
        });
        
        cont.appendChild(wordSpan);
        
        // Añadir espacio real entre palabras (si no es la última)
        if (index < palabras.length - 1) {
            cont.appendChild(document.createTextNode(" "));
        }
    });

    ajustarTamano(data.tamano);
}

function animarEntrada(tipo){
    const letras = document.querySelectorAll(".letra");
    
    // Asegurar estado inicial limpio
    gsap.set(letras, { clearProps: "all" });

    switch(tipo){
        case "impacto":
            gsap.fromTo(letras,
                {scale: 2, opacity: 0, z: 100},
                {scale: 1, opacity: 1, z: 0, duration: 0.6, ease: "elastic.out(1, 0.5)", stagger: 0.05}
            );
        break;

        case "fade":
            gsap.fromTo(letras,
                {opacity: 0, y: 20},
                {opacity: 1, y: 0, duration: 0.8, ease: "power2.out", stagger: 0.03}
            );
        break;

        case "zoom":
            gsap.fromTo(letras,
                {scale: 0, opacity: 0},
                {scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)", stagger: 0.05}
            );
        break;

        case "caida":
            gsap.fromTo(letras,
                {y: -150, opacity: 0},
                {y: 0, opacity: 1, duration: 0.8, ease: "bounce.out", stagger: 0.03}
            );
        break;

        case "disco":
            gsap.fromTo(letras,
                {scale: 0, rotation: 180, opacity: 0},
                {scale: 1, rotation: 0, opacity: 1, duration: 0.7, ease: "back.out(1.7)", stagger: 0.05}
            );
        break;

        case "glitch":
            gsap.fromTo(letras,
                {opacity: 0, skewX: 45},
                {opacity: 1, skewX: 0, duration: 0.4, ease: "steps(5)", stagger: {amount: 0.3, from: "random"}}
            );
        break;

        case "elastico":
            gsap.fromTo(letras,
                {scaleY: 0.1, scaleX: 2, opacity: 0},
                {scaleY: 1, scaleX: 1, opacity: 1, duration: 1, ease: "elastic.out(1, 0.3)", stagger: 0.03}
            );
        break;

        case "maquina":
            gsap.fromTo(letras,
                {opacity: 0},
                {opacity: 1, duration: 0.05, stagger: 0.1}
            );
        break;

        case "remolino":
            gsap.fromTo(letras,
                {scale: 0, rotation: 720, opacity: 0},
                {scale: 1, rotation: 0, opacity: 1, duration: 1, ease: "power3.out", stagger: 0.05}
            );
        break;

        case "enfoque":
            gsap.fromTo(letras,
                {filter: "blur(20px)", opacity: 0, scale: 1.5},
                {filter: "blur(0px)", opacity: 1, scale: 1, duration: 1, ease: "power2.out", stagger: 0.05}
            );
        break;
    }
}

function animarPermanente(tipo, intensidad = 1){
    const letras = document.querySelectorAll(".letra");
    const cont = document.getElementById("texto");
    
    // Convertir intensidad a número por seguridad
    const int = parseFloat(intensidad) || 1;

    switch(tipo){
        case "latido":
            // Escala base 1 + (0.05 * intensidad)
            const scale = 1 + (0.05 * int);
            gsap.to(cont, {scale: scale, duration: 0.4, repeat: -1, yoyo: true, ease: "sine.inOut"});
        break;

        case "temblor":
            // Aumenta el rango de movimiento aleatorio
            const range = 2 * int;
            gsap.to(letras, {x: `random(-${range}, ${range})`, y: `random(-${range}, ${range})`, duration: 0.1, repeat: -1, yoyo: true, ease: "none"});
        break;

        case "sacudir":
            // Movimiento violento de todo el contenedor + rotación
            const shake = 10 * int;
            const rot = 2 * int;
            gsap.to(cont, {x: `random(-${shake}, ${shake})`, y: `random(-${shake}, ${shake})`, rotation: `random(-${rot}, ${rot})`, duration: 0.06, repeat: -1, yoyo: true, ease: "none"});
        break;

        case "onda":
            gsap.to(letras, {y: -20 * int, duration: 0.5, repeat: -1, yoyo: true, ease: "sine.inOut", stagger: {each: 0.1, from: "start"}});
        break;

        case "flotar":
            gsap.to(cont, {y: -15 * int, duration: 1.5, repeat: -1, yoyo: true, ease: "sine.inOut"});
        break;

        case "flotar_agresivo":
            const rangeA = 20 * int;
            const rotA = 7 * int;
            gsap.to(cont, {
                x: `random(-${rangeA}, ${rangeA})`,
                y: `random(-${rangeA}, ${rangeA})`,
                rotation: `random(-${rotA}, ${rotA})`,
                duration: 2 / int,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                repeatRefresh: true
            });
        break;

        case "giro3d":
            // A mayor intensidad, menor duración (más rápido)
            gsap.to(cont, {rotationY: 360, duration: 8 / int, repeat: -1, ease: "linear"});
        break;

        case "balanceo":
            gsap.to(cont, {rotation: 5 * int, duration: 1, repeat: -1, yoyo: true, ease: "sine.inOut"});
        break;
    }
}

function animarSalida(){
    const letras = document.querySelectorAll(".letra");
    const cont = document.getElementById("texto");

    // Si no hay letras, animamos el contenedor para asegurar que se oculte
    const targets = letras.length > 0 ? letras : cont;

    // Detener animaciones permanentes antes de salir
    if (loopAnimation) loopAnimation.kill();
    gsap.killTweensOf(cont);
    gsap.killTweensOf(letras);

    switch(animacionSalida){
        case "fadeUp":
            gsap.to(targets,
                {opacity: 0, y: -50, duration: 0.4, stagger: 0.02, ease: "power2.in"}
            );
        break;

        case "zoomOut":
            gsap.to(targets,
                {scale: 0, opacity: 0, duration: 0.4, stagger: 0.02, ease: "back.in(1.5)"}
            );
        break;

        case "explode":
            gsap.to(targets,
                {
                    x: () => (Math.random() - 0.5) * 400,
                    y: () => (Math.random() - 0.5) * 400,
                    opacity: 0,
                    scale: 0,
                    duration: 0.6,
                    ease: "power3.out"
                }
            );
        break;

        case "deslizar":
            gsap.to(targets,
                {x: 1000, opacity: 0, duration: 0.5, ease: "power2.in", stagger: 0.02}
            );
        break;

        case "cortina":
            gsap.to(targets,
                {scaleY: 0, transformOrigin: "top", opacity: 0, duration: 0.4, stagger: 0.02}
            );
        break;

        case "agujero":
            gsap.to(targets,
                {scale: 0, rotation: 180, opacity: 0, duration: 0.6, ease: "back.in(1)", stagger: 0.02}
            );
        break;

        case "cohete":
            gsap.to(targets,
                {y: -1000, opacity: 0, duration: 0.6, ease: "power3.in", stagger: 0.02}
            );
        break;
    }
}

function procesarDatos(data) {
    if (!data || !data.timestamp) return;

    // Solo procesar si el timestamp es más nuevo que el último procesado
    if (data.timestamp <= lastTimestamp) return;
    
    lastTimestamp = data.timestamp;

    if (data.accion === "mostrar") {
        animacionSalida = data.salida;
        renderTexto(data);
        animarEntrada(data.entrada);
        
        // Programar animación permanente para que inicie después de la entrada (1.2s después)
        if(data.permanente && data.permanente !== "ninguna"){
            loopAnimation = gsap.delayedCall(1.2, animarPermanente, [data.permanente, data.intensidad]);
        }
    } else if (data.accion === "ocultar") {
        animarSalida();
    }
}

function checkStorage() {
    try {
        const item = localStorage.getItem(STORAGE_KEY);
        if (item) {
            procesarDatos(JSON.parse(item));
        }
    } catch (e) {
        console.error("Error leyendo localStorage en OBS:", e);
    }
}

// Inicialización Híbrida para OBS
window.addEventListener("load", () => {
    // 0. Listener de BroadcastChannel (Comunicación Instantánea en OBS)
    bc.onmessage = (event) => {
        procesarDatos(event.data);
    };

    // 1. Listener de evento estándar (rápido si funciona)
    window.addEventListener("storage", (e) => {
        if (e.key === STORAGE_KEY) checkStorage();
    });

    // 2. Polling de respaldo (Robustez para OBS/File Protocol)
    // Revisa cada 500ms si hay cambios que el evento no capturó
    setInterval(checkStorage, 500);
    
    // Chequeo inicial
    checkStorage();
});
