const { jsPDF } = window.jspdf;

// Diccionario de procedimientos e indicaciones
const guias = {
    "extraccion": "1. No escupir ni usar pitillos.\n2. Dieta blanda y fría las primeras 24h.\n3. Tomar analgésicos cada 8 horas.\n4. Mantener higiene suave en la zona.",
    "endodoncia": "1. Evitar masticar alimentos duros con esa pieza.\n2. Es normal sentir sensibilidad al presionar.\n3. Si hay inflamación severa, contactar al consultorio.",
    "limpieza": "1. Evitar alimentos con colorantes por 24h.\n2. Usar enjuague bucal sin alcohol.\n3. Sensibilidad térmica normal por 48h."
};

// Evento para autocompletar
document.getElementById('procedimiento').addEventListener('change', (e) => {
    const seleccion = e.target.value;
    if(guias[seleccion]) {
        document.getElementById('indicaciones').value = guias[seleccion];
    }
});

function generarPDF() {
    const doc = new jsPDF();
    
    // Configuración de Estilo (Colores de la imagen)
    const azulClaro = [224, 242, 241]; // Color del pie de página
    
    // Encabezado
    doc.setFontSize(22);
    doc.text("DR. PEDRO FERNÁNDEZ", 20, 30);
    doc.setFontSize(12);
    doc.text("Médico General | C.P. 132456789", 20, 38);

    // Datos de contacto (derecha)
    doc.setFontSize(9);
    doc.text("Cel: (316) 212-3456", 140, 25);
    doc.text("Dirección: Calle Cualquiera 123", 140, 33);
    
    // Cuerpo del formulario
    doc.setFontSize(11);
    doc.text(`Nombre: ${document.getElementById('nombre').value}`, 20, 60);
    doc.text(`Edad: ${document.getElementById('edad').value}`, 120, 60);
    doc.text(`Fecha: ${document.getElementById('fecha').value}`, 160, 60);
    
    doc.line(20, 65, 190, 65); // Línea divisoria

    doc.setFont("helvetica", "bold");
    doc.text("RX:", 20, 80);
    doc.setFont("helvetica", "normal");
    
    // Texto de las indicaciones
    const splitText = doc.splitTextToSize(document.getElementById('indicaciones').value, 160);
    doc.text(splitText, 20, 90);

    // Pie de página decorativo
    doc.setFillColor(210, 235, 235);
    doc.rect(0, 250, 210, 50, 'F');
    doc.setTextColor(0, 0, 0);
    doc.text("Horarios: Lunes a Viernes 10 a.m. a 5 p.m.", 20, 270);
    doc.text("Dr. Pedro Fernández - Médico General", 120, 280);

    doc.save(`Receta_${document.getElementById('nombre').value}.pdf`);
}