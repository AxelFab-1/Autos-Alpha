// ============================================
// CUESTIONARIO DE CONTACTO (CONECTADO A FIREBASE)
// ============================================

import { db, collection, addDoc, auth } from './firebase-config.js';

export function inicializarContacto() {
    const form = document.getElementById('formulario-contacto');
    const feedbackDiv = document.getElementById('feedback-mensaje');
    
    if (!form) return;

    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        // 1. VALIDAR SI HAY SESIÓN INICIADA
        const user = auth.currentUser;
        if (!user) {
            alert("Para enviar el cuestionario, por favor inicia sesión.");
            document.querySelector('.header-container').scrollIntoView({ behavior: 'smooth' });
            return;
        }

        // 2. VALIDACIÓN VISUAL (Tu código original)
        const nombreInput = document.getElementById('nombre-input');
        const emailInput = document.getElementById('email-input');
        const marcaSelect = document.querySelector('[name="marca"]');
        const presupuestoSelect = document.querySelector('[name="presupuesto"]');
        const comentariosInput = document.querySelector('[name="comentarios"]');

        // Limpiar estilos previos
        nombreInput.classList.remove('input-error');
        emailInput.classList.remove('input-error');
        if(feedbackDiv) { feedbackDiv.textContent = ''; feedbackDiv.className = ''; }

        let esValido = true;

        if (nombreInput.value.trim() === '') { 
            nombreInput.classList.add('input-error'); 
            esValido = false; 
        }
        if (emailInput.value.trim() === '' || !emailInput.value.includes('@')) { 
            emailInput.classList.add('input-error'); 
            esValido = false; 
        }

        // 3. SI ES VÁLIDO, ENVIAR A FIREBASE
        if (esValido) {
            try {
                // Feedback de "Cargando..."
                const btnSubmit = form.querySelector('button');
                const textoOriginal = btnSubmit.textContent;
                btnSubmit.textContent = "Enviando...";
                btnSubmit.disabled = true;

                // Guardar en Firestore
                await addDoc(collection(db, "mensajes"), {
                    uid: user.uid, // Quién lo envió
                    nombre: nombreInput.value,
                    email: emailInput.value,
                    marcaInteres: marcaSelect.value,
                    presupuesto: presupuestoSelect.value,
                    comentario: comentariosInput.value,
                    fecha: new Date(), 
                    estado: "Nuevo"
                });

                // Éxito
                if(feedbackDiv) {
                    feedbackDiv.textContent = '✅ ¡Mensaje recibido! Nos pondremos en contacto.';
                    feedbackDiv.classList.add('feedback-exito');
                }
                form.reset();
                if(window.mostrarNotificacion) window.mostrarNotificacion('✅ Cuestionario enviado a la nube');

            } catch (error) {
                console.error("Error al enviar mensaje:", error);
                if(feedbackDiv) {
                    feedbackDiv.textContent = '❌ Error al conectar con el servidor.';
                    feedbackDiv.classList.add('feedback-error');
                }
            } finally {
                // Restaurar botón
                const btnSubmit = form.querySelector('button');
                btnSubmit.textContent = "Enviar";
                btnSubmit.disabled = false;
            }

        } else {
            // Error de validación local
            if(feedbackDiv) {
                feedbackDiv.textContent = '❌ Por favor corrige los campos marcados.';
                feedbackDiv.classList.add('feedback-error');
            }
        }
    });
}
