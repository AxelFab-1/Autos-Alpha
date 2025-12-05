// ============================================
// SISTEMA DE CITAS PRIVADAS (FIREBASE AUTH) 🔒
// ============================================

import { 
    db, auth, provider, 
    collection, addDoc, onSnapshot, deleteDoc, doc, 
    signInWithPopup, signOut, onAuthStateChanged,
    query, where 
} from './firebase-config.js';

let usuarioActual = null; // Aquí guardaremos quién está conectado
let escuchadorCitas = null; // Para apagar la conexión cuando te desconectas

function inicializarCalendarioCitas() {
    const btnLogin = document.getElementById('btn-login-google');
    const btnLogout = document.getElementById('btn-logout');
    
    // 1. EVENTOS DE LOGIN/LOGOUT
    if (btnLogin) btnLogin.addEventListener('click', iniciarSesion);
    if (btnLogout) btnLogout.addEventListener('click', cerrarSesion);

    // 2. DETECTAR CAMBIO DE ESTADO (¿Entró o salió alguien?)
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // -- USUARIO CONECTADO --
            usuarioActual = user;
            console.log("Usuario conectado:", user.email);
            
            // Mostrar interfaz
            document.getElementById('pantalla-login').style.display = 'none';
            document.getElementById('contenido-calendario').style.display = 'block';
            document.getElementById('usuario-info').style.display = 'flex';
            
            // Llenar datos del header
            document.getElementById('nombre-usuario').textContent = user.displayName.split(' ')[0]; // Solo primer nombre
            document.getElementById('foto-usuario').src = user.photoURL;

            // Pre-llenar el nombre en el formulario
            const inputNombre = document.getElementById('cita-nombre');
            if(inputNombre) inputNombre.value = user.displayName;

            // Cargar SUS citas
            cargarCitasPrivadas(user.uid);

        } else {
            // -- USUARIO DESCONECTADO --
            usuarioActual = null;
            console.log("Nadie conectado");

            // Ocultar interfaz
            document.getElementById('pantalla-login').style.display = 'block';
            document.getElementById('contenido-calendario').style.display = 'none';
            document.getElementById('usuario-info').style.display = 'none';

            // Dejar de escuchar citas (seguridad y rendimiento)
            if (escuchadorCitas) {
                escuchadorCitas(); // Esto "apaga" el onSnapshot anterior
                escuchadorCitas = null;
            }
        }
    });

    // Eventos del formulario (igual que antes)
    const fechaInput = document.getElementById('fecha-cita');
    if(fechaInput) {
        const hoy = new Date().toISOString().split('T')[0];
        fechaInput.min = hoy;
        fechaInput.addEventListener('change', function() { generarHorarios(this.value); });
    }

    const formCita = document.getElementById('formCita');
    if (formCita) {
        formCita.addEventListener('submit', function(e) {
            e.preventDefault();
            guardarCitaPrivada();
        });
    }
}

// --- FUNCIONES DE AUTH ---
async function iniciarSesion() {
    try {
        await signInWithPopup(auth, provider);
        // No hace falta hacer nada más, onAuthStateChanged se disparará solo
    } catch (error) {
        console.error("Error login:", error);
        alert("Error al iniciar sesión: " + error.message);
    }
}

async function cerrarSesion() {
    try {
        await signOut(auth);
        alert("Sesión cerrada correctamente 👋");
    } catch (error) {
        console.error("Error logout:", error);
    }
}

// --- CARGAR CITAS (CON FILTRO DE DUEÑO) ---
function cargarCitasPrivadas(uid) {
    const contenedor = document.getElementById('mis-citas-guardadas');
    
    // REFERENCIA A LA COLECCIÓN
    const citasRef = collection(db, "citas");
    
    // CREAMOS LA QUERY: "Solo dame las citas donde el campo 'uid' sea igual a MI ID"
    const q = query(citasRef, where("uid", "==", uid));

    // SUSCRIPCIÓN EN TIEMPO REAL
    escuchadorCitas = onSnapshot(q, (snapshot) => {
        contenedor.innerHTML = '';
        const citas = [];
        
        snapshot.forEach((doc) => {
            citas.push({ id: doc.id, ...doc.data() });
        });

        if (citas.length === 0) {
            contenedor.innerHTML = '<p style="color:#666; text-align:center; font-style:italic;">No tienes citas agendadas aún.</p>';
            return;
        }

        // Ordenar
        citas.sort((a, b) => new Date(a.fecha + 'T' + a.hora) - new Date(b.fecha + 'T' + b.hora));

        // Renderizar
        citas.forEach(cita => {
            const div = document.createElement('div');
            div.className = 'cita-card';
            div.innerHTML = `
                <div>
                    <div class="cita-texto">
                        📅 ${cita.fecha} <span style="color:#a83246; margin-left:5px;">⏰ ${cita.hora}</span>
                    </div>
                    <div class="cita-subtexto">
                        <strong>${cita.motivo}</strong> - ${cita.nombre}
                    </div>
                </div>
                <button onclick="borrarCita('${cita.id}')" 
                        style="background: #e74c3c; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">
                    Cancelar
                </button>
            `;
            contenedor.appendChild(div);
        });
    });
}

// --- GUARDAR CITA (CON MARCA DE DUEÑO) ---
async function guardarCitaPrivada() {
    if (!usuarioActual) {
        alert("Debes iniciar sesión para agendar.");
        return;
    }

    const form = document.getElementById('formCita');
    const fecha = form.dataset.fecha;
    const hora = form.dataset.hora;

    if (!fecha || !hora) {
        alert("Selecciona un horario primero.");
        return;
    }

    const nombre = document.getElementById('cita-nombre').value;
    const telefono = document.getElementById('cita-telefono').value;
    const motivo = document.getElementById('cita-motivo').value;

    try {
        await addDoc(collection(db, "citas"), {
            uid: usuarioActual.uid, // <--- ¡ESTO ES LO IMPORTANTE! LA MARCA DE PROPIEDAD
            email: usuarioActual.email, // Opcional: para que sepas quién fue en la consola
            fecha,
            hora,
            nombre,
            telefono,
            motivo,
            creadoEn: new Date()
        });

        alert("✅ Cita agendada exitosamente en tu cuenta.");
        
        // Limpiar
        form.reset();
        document.getElementById('formulario-cita').style.display = 'none';
        document.getElementById('horarios-disponibles').innerHTML = '';
        document.getElementById('fecha-cita').value = '';

    } catch (e) {
        console.error("Error guardando:", e);
        alert("Error al guardar cita.");
    }
}

// --- BORRAR ---
window.borrarCita = async (id) => {
    if(!confirm("¿Cancelar cita?")) return;
    try {
        await deleteDoc(doc(db, "citas", id));
    } catch (e) { console.error(e); }
};

// --- GENERADOR VISUAL (IGUAL QUE ANTES) ---
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
                formTag.dataset.fecha = fecha;
                formTag.dataset.hora = hora;
            };
        }
        contenedor.appendChild(btn);
    }
}

// Arrancar
inicializarCalendarioCitas();
