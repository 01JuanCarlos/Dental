$(document).ready(function () {
    // Inicializar Selects
    $('#selTipoPaciente').select2({
        minimumResultsForSearch: Infinity,
        width: '100%'
    });

    $('#selProc').select2({
        placeholder: "Seleccionar procedimiento...",
        allowClear: true,
        width: '100%'
    });

    // --- RE-CONECTAR LA REACTIVIDAD ---

    // Escuchar cambio en Tipo de Paciente (vía Select2)
    $('#selTipoPaciente').on('change', function () {
        const value = $(this).val();
        const divRango = document.getElementById('divRangoNino');

        if (value === 'nino') {
            divRango.classList.remove('hidden');
        } else {
            divRango.classList.add('hidden');
        }
        actualizarContenido();
    });

    // Escuchar cambio en Procedimiento (vía Select2)
    $('#selProc').on('change', function () {
        actualizarContenido();
    });

    // Escuchar cambio en Rango Niño
    $('#selRangoNino').on('change', function () {
        actualizarContenido();
    });
    // Inicializar iconos de Lucide
    lucide.createIcons();
    // --- LÓGICA DE INTERFAZ ---
    function ajustarEscala() {
        const container = document.getElementById('recetaContainer');
        const content = document.getElementById('receta');
        const escala = container.offsetWidth / 1122;
        content.style.transform = `scale(${escala})`;
    }

    window.addEventListener('resize', ajustarEscala);
    
    function ponerFechaActual() {
        // 1. Obtener fecha (Manual para evitar bugs de localización en Safari)
        const ahora = new Date();
        const dia = String(ahora.getDate()).padStart(2, '0');
        const mes = String(ahora.getMonth() + 1).padStart(2, '0');
        const anio = ahora.getFullYear();
        const fechaFinal = `${dia}/${mes}/${anio}`;

        const inputFecha = document.getElementById('inFecha');
        const previewFecha = document.getElementById('pvFecha');

        if (inputFecha) {
            // Rompemos el cache de Safari/iOS
            inputFecha.value = "";
            inputFecha.defaultValue = fechaFinal;
            inputFecha.value = fechaFinal;
            // Forzamos el atributo visual en el HTML
            inputFecha.setAttribute('value', fechaFinal);
        }

        if (previewFecha) {
            previewFecha.innerText = fechaFinal;
        }

        // 2. Ejecutar escala después de asignar la fecha
        if (typeof ajustarEscala === 'function') {
            ajustarEscala();
        }
    }

    // Eventos de ejecución
    document.addEventListener('DOMContentLoaded', ponerFechaActual);

    // Este es el más importante para que no falle al recargar en móviles
    window.addEventListener('pageshow', function (event) {
        ponerFechaActual();
    });

    const recetasData = {
        "periodoncia": { p: "", i: "Realizar enjuagues con 5 ml de VITIS sin diluir, durante 30 segundos, como mínimo 2 veces al día después de cada cepillado.\n\nPara una mayor eficacia es recomendable no mezclar con agua y evitar comer o beber inmediatamente después de su uso." },
        "alveolitis": { p: "-Amoxicilina 500 mg más acido clavulánico 125 mg x 5 días.\n15 tabletas cada 8 horas \n\n- Etoricoxib 120 mg  una vez al día x 3 días.\n- Después de cada comida.", i: "" },
        "extraccion_adulto": { p: "- Amoxicilina 500 mg x 5 días # 15 tabletas cada 8 horas \n\n- Dolocordralan extraforte x 2 días # 6 tabletas cada 8 horas.\n\n Después de cada comida ", i: "Evitar:\n- Fumar\n- Escupir las primeras 24 hrs.\n- Actividad física por 3 días.\n- Sol y comidas picantes.\n\nDieta:\n- Helado.\n- Verduras al vapor.\n- Dieta blanda." },
        "extraccion_nino_5-6": { p: "- Jarabe Amoxicilina 250 mg x 5 días: 7 ml cada 8 horas.\n\n- Jarabe Ibuprofeno 100 mg x 2 días: 7 ml cada 8 horas.\n\n Las dos juntas después de cada comida.", i: "" },
        "extraccion_nino_2": { p: "- Amoxicilina 250 mg x 5 días: 5 ml cada 8 horas.\n- Ibuprofeno 100 mg x 2 días: 5 ml cada 8 horas.\n\n Las dos juntas después de cada comida.", i: "" }
    };

    document.getElementById('selTipoPaciente').addEventListener('change', function () {
        const divRango = document.getElementById('divRangoNino');
        this.value === 'nino' ? divRango.classList.remove('hidden') : divRango.classList.add('hidden');
        actualizarContenido();
    });

    document.getElementById('selRangoNino').addEventListener('change', actualizarContenido);
    document.getElementById('selProc').addEventListener('change', actualizarContenido);

    function actualizarContenido() {
        const proc = document.getElementById('selProc').value;
        const tipo = document.getElementById('selTipoPaciente').value;
        const rango = document.getElementById('selRangoNino').value;
        let clave = proc === 'extraccion' ? (tipo === 'adulto' ? 'extraccion_adulto' : `extraccion_nino_${rango}`) : proc;
        if (recetasData[clave]) {
            document.getElementById('inPres').value = recetasData[clave].p;
            document.getElementById('inInd').value = recetasData[clave].i;
            document.getElementById('pvPres').innerText = recetasData[clave].p;
            document.getElementById('pvInd').innerText = recetasData[clave].i;
        }
    }

    ['inPaciente', 'inEdad', 'inPres', 'inInd'].forEach(id => {
        document.getElementById(id).addEventListener('input', (e) => {
            document.getElementById(id.replace('in', 'pv')).innerText = e.target.value;
        });
    });



    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('Registro de SW exitoso', reg))
            .catch(err => console.warn('Error al registrar SW', err));
    }
});