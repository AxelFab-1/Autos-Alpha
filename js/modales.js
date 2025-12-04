// ============================================
// MODALES - VENTANAS FLOTANTES
// ============================================

let modalAbierto = false;

// Función para abrir ventanas flotantes
function abrirModal(modalId) {
    const modal = document.getElementById(modalId);
    const backdrop = document.getElementById('modalBackdrop');
    
    if (modal && backdrop) {
        modal.style.display = 'block';
        backdrop.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevenir scroll
        modalAbierto = true;
    }
}

// Función para cerrar ventanas flotantes
function cerrarModal() {
    const modales = document.querySelectorAll('.modal');
    const backdrop = document.getElementById('modalBackdrop');
    
    modales.forEach(modal => {
        modal.style.display = 'none';
    });
    
    if (backdrop) {
        backdrop.style.display = 'none';
    }
    
    document.body.style.overflow = 'auto'; // Restaurar scroll
    modalAbierto = false;
}

// Cerrar modal con tecla ESC
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        // Si hay un modal abierto, cerrarlo primero
        if (modalAbierto) {
            cerrarModal();
        } 
        // Si no hay modal abierto pero estamos en detalle, cerrar detalle
        else if (document.getElementById('detalle-auto').style.display === 'block') {
            cerrarDetalle();
        }
        // Si estamos en catálogo normal, cerrar cualquier modal que pueda estar abierto
        else {
            cerrarModal();
        }
    }
});

// Formulario de prueba de manejo
function inicializarFormularioPruebaManejo() {
    const form = document.getElementById('formPruebaManejo');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            mostrarNotificacion('✅ ¡Prueba de manejo agendada! Te contactaremos pronto.');
            cerrarModal();
            this.reset();
        });
    }
}

// Función para solicitar prueba de manejo desde detalle
function solicitarPruebaManejoDesdeDetalle(modeloAuto) {
    // Llenar automáticamente el formulario de prueba de manejo
    const selectVehiculo = document.querySelector('#modalPruebaManejo select');
    if (selectVehiculo) {
        // Buscar la opción que coincida con el modelo
        for (let option of selectVehiculo.options) {
            if (option.text.toLowerCase().includes(modeloAuto.toLowerCase())) {
                option.selected = true;
                break;
            }
        }
    }
    
    // Abrir modal sin cerrar el detalle
    abrirModal('modalPruebaManejo');
}

// Función para cotizar auto
function cotizarAuto(modeloAuto) {
    mostrarNotificacion(`📧 Hemos recibido tu solicitud de cotización para el ${modeloAuto}. Te contactaremos pronto.`);
}