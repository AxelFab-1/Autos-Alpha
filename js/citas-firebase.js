// ============================================
// SISTEMA DE CITAS (CONECTADO A FIREBASE) 🔥
// ============================================

// 1. Importamos la conexión que creamos en firebase-config.js
import { db, collection, addDoc, onSnapshot, deleteDoc, doc } from './firebase-config.js';

// --- INICIALIZACIÓN ---
function inicializarCalendarioCitas() {
    const fechaInput = document.getElementById('fecha-cita');
    if (!fechaInput) return;

    // Fecha mínima: Hoy
    const hoy = new Date().toISOString().split('T')[0];
    fechaInput.min = hoy;

    // --- ESCUCHADOR EN TIEMPO REAL (La Magia) ---
    // En lugar de "cargar" una vez, nos "suscribimos" a cambios en la colección "citas"
    onSnapshot(collection(db, "citas"), (snapshot) => {
        const contenedor = document.getElementById('mis-citas-guardadas');
        contenedor.innerHTML = '';
        
        const citas = [];
        snapshot.forEach((documento) => {
            // Unimos el ID de firebase con los datos de la cita
            citas.push({ id: documento.id, ...documento.data() });
        });

        // Si no hay citas
        if (citas.length === 0) {
            contenedor.innerHTML = `
                <p style="color: var(--color-texto, #666); font-style: italic; font-size: 14px; text-align:center; opacity: 0.7;">
                    No hay citas agendadas en la nube.
                </p>`;
            return;
        }

        // Ordenar por fecha y hora
        citas.sort((a, b) => new Date(a.fecha + 'T' + a.hora) - new Date(b.fecha + 'T' + b.hora));
        
        // Renderizar (Dibujar) las citas
        citas.forEach(cita => {
            const div = document.createElement('div');
            div.className = 'cita-card'; // Usamos la clase CSS para que funcione el Modo Oscuro
            
            div.innerHTML = `
                <div>
                    <div class="cita-texto">
                        📅 ${cita.fecha} <span style="color:#a83246; margin-left:5px; background:rgba(168, 50, 70, 0.1); padding:2px 6px; border-radius:4px;">⏰ ${cita.hora}</span>
                    </div>
                    <div class="cita-subtexto">
                        <strong>${cita.motivo}</strong> - ${cita.nombre}
                    </div>
                </div>
                <button class="btn-borrar-nube" data-id="${cita.id}" 
                        style="background: #e74c3c; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer; font-size: 12px; font-weight:bold;">
                    Cancelar
                </button>
            `;
            contenedor.appendChild(div);
        });

        // Asignar eventos a los botones de borrar (Necesario al usar type="module")
        document.querySelectorAll('.btn-borrar-nube').forEach(btn => {
            btn.addEventListener('click', () => cancelarCitaNube(btn.dataset.id));
        });
    });

    // Eventos del formulario
    fechaInput.addEventListener('change', function() {
        generarHorarios(this.value);
    });

    const formCita = document.getElementById('formCita');
    if (formCita) {
        formCita.addEventListener('submit', function(e) {
            e.preventDefault();
            guardarCitaNube();
        });
    }
}

// --- GUARDAR EN FIREBASE ---
async function guardarCitaNube() {
    const form = document.getElementById('formCita');
    
    // Validar que se seleccionó hora (usando los dataset que guardamos al hacer click en el botón de hora)
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
        // Enviar a la nube
        await addDoc(collection(db, "citas"), {
            fecha: fecha,
            hora: hora,
            nombre: nombre,
            telefono: telefono,
            motivo: motivo,
            creadoEn: new Date() // Para tener registro de cuándo se creó
        });

        mostrarNotificacion("✅ ¡Cita guardada en la nube con éxito!");
        
        // Limpiar formulario
        form.reset();
        document.getElementById('formulario-cita').style.display = 'none';
        document.getElementById('horarios-disponibles').innerHTML = '';
        document.getElementById('fecha-cita').value = '';

    } catch (e) {
        console.error("Error al guardar: ", e);
        alert("❌ Error al conectar con Firebase. Revisa la consola.");
    }
}

// --- BORRAR DE FIREBASE ---
async function cancelarCitaNube(id) {
    if(!confirm('¿Estás seguro de cancelar esta cita de la base de datos?')) return;
    
    try {
        await deleteDoc(doc(db, "citas", id));
        mostrarNotificacion('🗑️ Cita eliminada de la nube');
        // No hace falta recargar la lista, el onSnapshot lo hace solo :)
    } catch (e) {
        console.error("Error borrando: ", e);
        alert("Error al borrar.");
    }
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
        const ocupado = Math.random() < 0.3; // Simulación visual de ocupados
        
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
                
                // Guardamos los datos en el formulario para usarlos al enviar
                formTag.dataset.fecha = fecha;
                formTag.dataset.hora = hora;
            };
        }
        contenedor.appendChild(btn);
    }
}

// Función auxiliar para notificaciones (si no está disponible globalmente por ser módulo)
function mostrarNotificacion(mensaje) {
    // Intentamos usar la global si existe, sino creamos una simple
    if (window.mostrarNotificacion) {
        window.mostrarNotificacion(mensaje);
    } else {
        alert(mensaje);
    }
}

// Iniciar automáticamente
inicializarCalendarioCitas();