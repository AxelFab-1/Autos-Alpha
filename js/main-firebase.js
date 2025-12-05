// ============================================
// MAIN.JS - CEREBRO CENTRAL (CON CONTADOR GLOBAL)
// ============================================

// 1. IMPORTACIONES DE FIREBASE
import { 
    auth, provider, signInWithPopup, signOut, onAuthStateChanged,
    db, doc, updateDoc, setDoc, increment, onSnapshot 
} from './firebase-config.js';

import { inicializarFavoritos } from './favoritos-firebase.js';

// ============================================
// FUNCIONES GLOBALES
// ============================================

window.toggleFlip = function(card) {
    document.querySelectorAll('.imagen-auto').forEach(other => {
        if (other !== card) other.classList.remove('flipped');
    });
    card.classList.toggle('flipped');
};

window.mostrarNotificacion = function(mensaje) {
    const notificacion = document.createElement('div');
    notificacion.textContent = mensaje;
    notificacion.style.cssText = `
        position: fixed; top: 20px; right: 20px; background: #27ae60;
        color: white; padding: 15px 20px; border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 10000;
        transform: translateX(120%); transition: transform 0.3s ease;
    `;
    document.body.appendChild(notificacion);
    setTimeout(() => { notificacion.style.transform = 'translateX(0)'; }, 100);
    setTimeout(() => {
        notificacion.style.transform = 'translateX(120%)';
        setTimeout(() => { if (notificacion.parentNode) notificacion.parentNode.removeChild(notificacion); }, 300);
    }, 4000);
};

// ============================================
// INICIO
// ============================================

window.addEventListener('load', function() {
    if (typeof renderizarCatalogo === 'function') renderizarCatalogo();
    else if(window.renderizarCatalogo) window.renderizarCatalogo();

    setTimeout(() => {
        window.mostrarNotificacion('👋 ¡Bienvenido a Autos Alpha!');
    }, 1000);
    
    inicializarFuncionalidades();
});

function inicializarFuncionalidades() {  
    // Herramientas visuales
    if (typeof inicializarFiltros === 'function') inicializarFiltros();
    inicializarModoOscuro();
    inicializarAnimacionesScroll();
    inicializarValidacionFormulario();
    inicializarFormularioPruebaManejo();
    inicializarFavoritos();

    // Firebase
    configurarLoginGlobal();
    
    // --- AQUÍ ESTÁ EL NUEVO CONTADOR GLOBAL ---
    inicializarContadorGlobal(); 
}

// ============================================
// NUEVO: CONTADOR DE VISITAS GLOBAL (EN LA NUBE) ☁️
// ============================================
async function inicializarContadorGlobal() {
    const docRef = doc(db, "estadisticas", "visitas"); // Ruta: estadisticas/visitas

    // 1. Sumar visita (Solo una vez por sesión del navegador)
    if (!sessionStorage.getItem('visita_registrada')) {
        try {
            await updateDoc(docRef, { total: increment(1) });
            sessionStorage.setItem('visita_registrada', 'true');
            console.log("Visita +1 enviada a la nube");
        } catch (error) {
            // Si el documento no existe (primera vez en la historia), lo creamos
            if (error.code === 'not-found' || error.message.includes('No document')) {
                await setDoc(docRef, { total: 1 });
            }
        }
    }

    // 2. Escuchar cambios en tiempo real (Para todos)
    onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
            const total = docSnap.data().total;
            actualizarContadorUI(total);
        }
    });
}

function actualizarContadorUI(numero) {
    const header = document.querySelector('.header-container');
    let div = document.getElementById('contador-visitas');

    // Si por error borraste el HTML, JS lo crea con TU diseño original (Respaldo)
    if (!div && header) {
        div = document.createElement('div');
        div.id = 'contador-visitas';
        // AQUÍ ESTÁN TUS ESTILOS ORIGINALES RESTAURADOS:
        div.style.cssText = `
            position: absolute; 
            top: 10px; 
            right: 300px; 
            background: #27ae60; 
            color: white; 
            padding: 5px 10px; 
            border-radius: 10px; 
            font-size: 12px; 
            z-index: 90;
        `;
        header.appendChild(div);
    }

    // Solo actualizamos el texto
    if (div) {
        div.innerHTML = `👥 Visitantes: ${numero.toLocaleString()}`;
    }
}

// ============================================
// GESTIÓN DE SESIÓN
// ============================================
function configurarLoginGlobal() {
    const btnLogin = document.getElementById('btn-login-global');
    const btnLogout = document.getElementById('btn-logout-global');
    const perfil = document.getElementById('perfil-usuario');

    if (btnLogin) {
        btnLogin.addEventListener('click', async () => {
            try { await signInWithPopup(auth, provider); } catch (e) { console.error(e); }
        });
    }

    if (btnLogout) {
        btnLogout.addEventListener('click', async () => {
            if(confirm("¿Cerrar sesión?")) {
                await signOut(auth);
                window.location.reload();
            }
        });
    }

    onAuthStateChanged(auth, (user) => {
        if (user) {
            if(btnLogin) btnLogin.style.display = 'none';
            if(perfil) {
                perfil.style.display = 'flex';
                document.getElementById('nombre-global').textContent = user.displayName.split(' ')[0];
                document.getElementById('foto-global').src = user.photoURL;
            }
        } else {
            if(btnLogin) btnLogin.style.display = 'flex';
            if(perfil) perfil.style.display = 'none';
        }
    });
}

// ============================================
// FUNCIONES VISUALES LEGACY
// ============================================

function inicializarAnimacionesScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.marca').forEach(marca => {
        marca.style.opacity = '0';
        marca.style.transform = 'translateY(20px)';
        marca.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(marca);
    });
}

function inicializarModoOscuro() {
    const header = document.querySelector('.header-container');
    if (!header || document.getElementById('toggle-modo')) return;
    
    const botonModoHTML = `
        <button id="toggle-modo" style="position: absolute; top: 10px; right: 150px; background: #2c3e50; 
                color: white; border: none; padding: 8px 15px; border-radius: 20px; cursor: pointer; 
                font-size: 14px; z-index: 100;">
            🌙 Modo Oscuro
        </button>
    `;
    header.insertAdjacentHTML('beforeend', botonModoHTML);
    
    if (localStorage.getItem('modo-oscuro') === 'true') activarModoOscuro();
    
    document.getElementById('toggle-modo').addEventListener('click', () => {
        document.body.classList.contains('modo-oscuro') ? desactivarModoOscuro() : activarModoOscuro();
    });
}

function activarModoOscuro() {
    document.body.classList.add('modo-oscuro');
    const btn = document.getElementById('toggle-modo');
    if(btn) btn.textContent = '☀️ Modo Claro';
    localStorage.setItem('modo-oscuro', 'true');
}

function desactivarModoOscuro() {
    document.body.classList.remove('modo-oscuro');
    const btn = document.getElementById('toggle-modo');
    if(btn) btn.textContent = '🌙 Modo Oscuro';
    localStorage.setItem('modo-oscuro', 'false');
}

function inicializarValidacionFormulario() {
    const form = document.getElementById('formulario-contacto');
    const feedbackDiv = document.getElementById('feedback-mensaje');
    if (!form) return;

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const nombreInput = document.getElementById('nombre-input');
        const emailInput = document.getElementById('email-input');

        nombreInput.classList.remove('input-error');
        emailInput.classList.remove('input-error');
        if(feedbackDiv) { feedbackDiv.textContent = ''; feedbackDiv.className = ''; }

        let esValido = true;
        if (nombreInput.value.trim() === '') { nombreInput.classList.add('input-error'); esValido = false; }
        if (emailInput.value.trim() === '' || !emailInput.value.includes('@')) { emailInput.classList.add('input-error'); esValido = false; }

        if (esValido) {
            if(feedbackDiv) {
                feedbackDiv.textContent = '✅ Mensaje enviado.';
                feedbackDiv.classList.add('feedback-exito');
            }
            form.reset();
            window.mostrarNotificacion('✅ Correo enviado');
        } else {
            if(feedbackDiv) {
                feedbackDiv.textContent = '❌ Corrige los errores.';
                feedbackDiv.classList.add('feedback-error');
            }
        }
    });
}

function inicializarFormularioPruebaManejo() {
    const form = document.getElementById('formPruebaManejo');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            window.mostrarNotificacion('✅ ¡Prueba de manejo agendada!');
            if(window.cerrarModal) window.cerrarModal();
            this.reset();
        });
    }

}

