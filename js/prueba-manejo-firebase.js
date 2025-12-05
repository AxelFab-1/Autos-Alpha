// ============================================
// PRUEBA DE MANEJO (CONECTADO A FIREBASE)
// ============================================

import { db, collection, addDoc, auth } from './firebase-config.js';

export function inicializarPruebaManejo() {
    const form = document.getElementById('formPruebaManejo');
    if (!form) return;

    // Configurar fecha mínima hoy (UX)
    const fechaInput = document.getElementById('pm-fecha');
    if(fechaInput) fechaInput.min = new Date().toISOString().split('T')[0];

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // 1. VALIDAR SESIÓN
        const user = auth.currentUser;
        if (!user) {
            alert("🔒 Debes iniciar sesión para agendar una prueba.");
            if(window.cerrarModal) window.cerrarModal();
            // Scroll al login
            const header = document.querySelector('.header-container');
            if(header) header.scrollIntoView({ behavior: 'smooth' });
            return;
        }

        // 2. OBTENER DATOS
        const nombre = document.getElementById('pm-nombre').value;
        const telefono = document.getElementById('pm-telefono').value;
        const vehiculo = document.getElementById('pm-vehiculo').value;
        const fecha = document.getElementById('pm-fecha').value;

        const btn = form.querySelector('button');
        const textoOriginal = btn.textContent;

        try {
            btn.textContent = "Procesando...";
            btn.disabled = true;

            // 3. GUARDAR EN FIREBASE
            await addDoc(collection(db, "solicitudes_prueba"), {
                uid: user.uid, // Propiedad del usuario
                email: user.email, // Contacto
                nombre: nombre,
                telefono: telefono,
                vehiculo: vehiculo,
                fechaSolicitada: fecha,
                estado: "Pendiente", // Para gestión interna
                timestamp: new Date()
            });

            // 4. ÉXITO
            if(window.mostrarNotificacion) window.mostrarNotificacion('✅ Solicitud enviada exitosamente');
            else alert("Solicitud enviada");
            
            form.reset();
            if(window.cerrarModal) window.cerrarModal();

        } catch (error) {
            console.error("Error al solicitar prueba:", error);
            alert("❌ Hubo un error al conectar con el servidor.");
        } finally {
            btn.textContent = textoOriginal;
            btn.disabled = false;
        }
    });
}
