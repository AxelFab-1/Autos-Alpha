// ============================================
// AUTOS ALPHA - FUNCIONES PRINCIPALES (MAIN)
// ============================================

// Función para Flip Cards (Girar tarjeta)
function toggleFlip(card) {
    // Remover la clase 'flipped' de todos los flip cards primero
    document.querySelectorAll('.imagen-auto').forEach(otherCard => {
        if (otherCard !== card) {
            otherCard.classList.remove('flipped');
        }
    });
  
    // Alternar la clase en el card clickeado
    card.classList.toggle('flipped');
}

// Ventana de bienvenida al cargar
window.addEventListener('load', function() {
    // Reemplazamos el 'alert' molesto por una notificación elegante
    setTimeout(() => {
        mostrarNotificacion('👋 ¡Bienvenido a Autos Alpha! Descubre nuestras ofertas.');
        
        // Hacemos scroll suave hacia el catálogo
        const primeraMarca = document.querySelector('.marca');
        if(primeraMarca) {
            primeraMarca.scrollIntoView({ behavior: 'smooth' });
        }
    }, 1000);
    
    inicializarFuncionalidades();
});

// =====================================================
// AQUÍ ESTÁ EL CAMBIO IMPORTANTE
// =====================================================
function inicializarFuncionalidades() {  
    // 1. PASO CRÍTICO: Generar el HTML de los autos primero
    if (typeof renderizarCatalogo === 'function') {
        renderizarCatalogo(); 
    } else {
        console.error("⚠️ Error: No se encontró la función renderizarCatalogo(). Verifica que importaste js/renderizador.js en el HTML.");
    }

    // 2. Una vez que el HTML existe, inicializamos lo demás
    if (typeof inicializarFiltros === 'function') inicializarFiltros();
    if (typeof inicializarFavoritos === 'function') inicializarFavoritos();
    if (typeof inicializarContadorOferta === 'function') inicializarContadorOferta();
    if (typeof inicializarCalendarioCitas === 'function') inicializarCalendarioCitas();
    if (typeof inicializarSistemaPagos === 'function') inicializarSistemaPagos();

    // 3. Inicializar el resto de herramientas
    inicializarModoOscuro();
    inicializarAnimacionesScroll();
    inicializarContadorVisitas();
    inicializarFormularioPruebaManejo();
    inicializarValidacionFormulario();
}

// Animaciones al scroll (Intersection Observer)
function inicializarAnimacionesScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                // Dejamos de observar para ahorrar recursos
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    // Aplicar a las marcas
    document.querySelectorAll('.marca').forEach(marca => {
        marca.style.opacity = '0';
        marca.style.transform = 'translateY(20px)';
        marca.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(marca);
    });
}

// Contador de visitas (LocalStorage)
function inicializarContadorVisitas() {
    let visitas = parseInt(localStorage.getItem('visitas-autos-alpha')) || 0;
    visitas++;
    localStorage.setItem('visitas-autos-alpha', visitas);
    
    const header = document.querySelector('.header-container');
    if (header) {
        // Verificar si ya existe el contador para no duplicarlo
        if(!document.getElementById('contador-visitas')) {
            const contadorHTML = `
                <div id="contador-visitas" style="position: absolute; top: 10px; right: 300px; background: #27ae60; color: white; 
                     padding: 5px 10px; border-radius: 10px; font-size: 12px; z-index: 100;">
                    👥 Visitantes: ${visitas}
                </div>
            `;
            header.insertAdjacentHTML('beforeend', contadorHTML);
        }
    }
}

// Sistema de Notificaciones (Toasts)
function mostrarNotificacion(mensaje) {
    const notificacion = document.createElement('div');
    notificacion.textContent = mensaje;
    notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        transform: translateX(120%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notificacion);
    
    // Animación de entrada
    setTimeout(() => {
        notificacion.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notificacion.style.transform = 'translateX(120%)';
        setTimeout(() => {
            if (notificacion.parentNode) {
                notificacion.parentNode.removeChild(notificacion);
            }
        }, 300);
    }, 4000);
}

// Modo Oscuro
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
    
    // Verificar preferencia guardada
    if (localStorage.getItem('modo-oscuro') === 'true') {
        activarModoOscuro();
    }
    
    document.getElementById('toggle-modo').addEventListener('click', toggleModoOscuro);
}

function toggleModoOscuro() {
    if (document.body.classList.contains('modo-oscuro')) {
        desactivarModoOscuro();
    } else {
        activarModoOscuro();
    }
}

function activarModoOscuro() {
    document.body.classList.add('modo-oscuro');
    const boton = document.getElementById('toggle-modo');
    if (boton) boton.textContent = '☀️ Modo Claro';
    localStorage.setItem('modo-oscuro', 'true');
}

function desactivarModoOscuro() {
    document.body.classList.remove('modo-oscuro');
    const boton = document.getElementById('toggle-modo');
    if (boton) boton.textContent = '🌙 Modo Oscuro';
    localStorage.setItem('modo-oscuro', 'false');
}

// Validación de Formulario de Contacto
function inicializarValidacionFormulario() {
    const form = document.getElementById('formulario-contacto');
    const feedbackDiv = document.getElementById('feedback-mensaje');
    
    if (!form) return;

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const nombreInput = document.getElementById('nombre-input');
        const emailInput = document.getElementById('email-input');

        // Limpiar estilos previos
        nombreInput.classList.remove('input-error');
        emailInput.classList.remove('input-error');
        feedbackDiv.textContent = '';
        feedbackDiv.className = ''; // Limpiar clases de feedback

        let esValido = true;

        if (nombreInput.value.trim() === '') {
            nombreInput.classList.add('input-error'); 
            esValido = false;
        }

        if (emailInput.value.trim() === '' || !emailInput.value.includes('@')) {
            emailInput.classList.add('input-error');
            esValido = false;
        }

        if (esValido) {
            feedbackDiv.textContent = '✅ Mensaje enviado. ¡Gracias por contactarnos!';
            feedbackDiv.classList.add('feedback-exito');
            form.reset();
            mostrarNotificacion('✅ Correo enviado exitosamente');
        } else {
            feedbackDiv.textContent = '❌ Por favor verifica los campos marcados en rojo.';
            feedbackDiv.classList.add('feedback-error');
        }
    });
}