// ============================================
// SISTEMA DE CITAS (CONECTADO Y PRIVADO) 📅
// ============================================

import { 
    db, auth, collection, addDoc, onSnapshot, deleteDoc, doc, query, where, onAuthStateChanged 
} from './firebase-config.js';

// --- INICIALIZACIÓN ---
function inicializarCalendarioCitas() {
    const fechaInput = document.getElementById('fecha-cita');
    const contenedorPrincipal = document.getElementById('contenido-calendario'); // El div que oculta todo
    const avisoLogin = document.getElementById('pantalla-login'); // El aviso de "Inicia sesión"

    if (!fechaInput) return;

    // Configuración básica de fecha
    const hoy = new Date().toISOString().split('T')[0];
    fechaInput.min = hoy;

    // 1. ESCUCHADOR DE SESIÓN (El Cerebro)
    // Este código se ejecuta automáticamente cuando detecta que entraste con Google
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // === USUARIO CONECTADO ===
            console.log("Citas: Usuario detectado, cargando datos...");
            
            // Mostrar la interfaz del calendario
            if(contenedorPrincipal) contenedorPrincipal.style.display = 'block';
            if(avisoLogin) avisoLogin.style.display = 'none';

            // Pre-llenar el nombre en el formulario (UX Pro)
            const inputNombre = document.getElementById('cita-nombre');
            if(inputNombre && user.displayName) inputNombre.value = user.displayName;

            // CARGAR SUS CITAS
            cargarCitasPrivadas(user.uid);

            // Activar el botón de guardar
            const formCita = document.getElementById('formCita');
            if (formCita) {
                formCita.onsubmit = (e) => {
                    e.preventDefault();
                    guardarCitaNube(user); // Pasamos el usuario para usar su ID
                };
            }

        } else {
            // === USUARIO DESCONECTADO ===
            console.log("Citas: No hay usuario.");
            
            // Ocultar calendario y mostrar aviso
            if(contenedorPrincipal) contenedorPrincipal.style.display = 'none';
            if(avisoLogin) avisoLogin.style.display = 'block';
            
            // Limpiar la lista visual por seguridad
            document.getElementById('mis-citas-guardadas').innerHTML = '';
        }
    });

    // Evento visual de cambio de fecha
    fechaInput.addEventListener('change', function() {
        generarHorarios(this.value);
    });
}

// --- CARGAR CITAS (Solo las mías) ---
function cargarCitasPrivadas(uid) {
    const contenedor = document.getElementById('mis-citas-guardadas');
    if(!contenedor) return;

    // QUERY: Dame las citas donde el campo "uid" sea igual a MI ID
    const q = query(collection(db, "citas"), where("uid", "==", uid));

    // Suscripción en tiempo real
    onSnapshot(q, (snapshot) => {
        contenedor.innerHTML = '';
        const citas = [];
        
        snapshot.forEach((doc) => {
            citas.push({ id: doc.id, ...doc.data() });
        });

        if (citas.length === 0) {
            contenedor.innerHTML = `
                <p style="color: var(--color-texto, #666); font-style: italic; font-size: 14px; text-align:center; opacity: 0.7;">
                    No tienes citas programadas.
                </p>`;
            return;
        }

        // Ordenar por fecha
        citas.sort((a, b) => new Date(a.fecha + 'T' + a.hora) - new Date(b.fecha + 'T' + b.hora));
        
        citas.forEach(cita => {
            const div = document.createElement('div');
            div.className = 'cita-card'; // Clase CSS para modo oscuro
            
            div.innerHTML = `
                <div>
                    <div class="cita-texto">
                        📅 ${cita.fecha} <span style="color:#a83246; margin-left:5px; background:rgba(168, 50, 70, 0.1); padding:2px 6px; border-radius:4px;">⏰ ${cita.hora}</span>
                    </div>
                    <div class="cita-subtexto">
                        <strong>${cita.motivo}</strong> - ${cita.nombre}
                    </div>
                </div>
                <button class="btn-borrar-cita" data-id="${cita.id}" 
                        style="background: #e74c3c; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer; font-size: 12px; font-weight:bold;">
                    Cancelar
                </button>
            `;
            contenedor.appendChild(div);
        });

        // Eventos de borrar
        document.querySelectorAll('.btn-borrar-cita').forEach(btn => {
            btn.addEventListener('click', () => cancelarCitaNube(btn.dataset.id));
        });
    });
}

// --- GUARDAR CITA ---
async function guardarCitaNube(user) {
    const form = document.getElementById('formCita');
    
    // Leer los datos que guardamos temporalmente en el formulario
    const fecha = form.dataset.fecha; 
    const hora = form.dataset.hora;

    if (!fecha || !hora) {
        alert("⚠️ Por favor selecciona un horario primero.");
        return;
    }

    const nombre = document.getElementById('cita-nombre').value;
    const telefono = document.getElementById('cita-telefono').value;
    const motivo = document.getElementById('cita-motivo').value;

    try {
        await addDoc(collection(db, "citas"), {
            uid: user.uid, // <--- LA LLAVE DE LA PRIVACIDAD
            email: user.email, // Opcional, útil para debug
            fecha: fecha,
            hora: hora,
            nombre: nombre,
            telefono: telefono,
            motivo: motivo,
            timestamp: new Date()
        });

        // Usamos window.mostrarNotificacion porque está en main.js
        if(window.mostrarNotificacion) window.mostrarNotificacion("✅ ¡Cita agendada!");
        else alert("✅ Cita agendada");
        
        // Limpiar
        form.reset();
        document.getElementById('formulario-cita').style.display = 'none';
        document.getElementById('horarios-disponibles').innerHTML = '';
        document.getElementById('fecha-cita').value = '';

    } catch (e) {
        console.error("Error al guardar: ", e);
        alert("❌ Error al guardar.");
    }
}

// --- BORRAR CITA ---
async function cancelarCitaNube(id) {
    if(!confirm('¿Cancelar esta cita?')) return;
    try {
        await deleteDoc(doc(db, "citas", id));
        if(window.mostrarNotificacion) window.mostrarNotificacion('🗑️ Cita eliminada');
    } catch (e) { console.error(e); }
}

// --- GENERAR HORARIOS (VISUAL) ---
function generarHorarios(fecha) {
    const contenedor = document.getElementById('horarios-disponibles');
    const formDiv = document.getElementById('formulario-cita');
    const formTag = document.getElementById('formCita');
    
    contenedor.innerHTML = '';
    formDiv.style.display = 'none';

    for (let i = 9; i <= 18; i++) {
        const hora = `${i}:00`;
        const ocupado = Math.random() < 0.3; 
        
        const btn = document.createElement('button');
        btn.className = `horario-btn ${ocupado ? 'ocupado' : ''}`;
        btn.innerHTML = `${hora} ${ocupado ? '❌' : ''}`;
        btn.disabled = ocupado;
        
        if (!ocupado) {
            btn.onclick = () => {
                document.querySelectorAll('.horario-btn').forEach(b => b.classList.remove('seleccionado'));
                btn.classList.add('seleccionado');
                
                formDiv.style.display = 'block';
                formDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                
                // Guardamos en el dataset del FORMULARIO (que es el que leemos al guardar)
                formTag.dataset.fecha = fecha;
                formTag.dataset.hora = hora;
            };
        }
        contenedor.appendChild(btn);
    }
}

// Iniciar script
inicializarCalendarioCitas();
