// ============================================
// SISTEMA DE AGENDAMIENTO DE CITAS (CORREGIDO)
// ============================================

function inicializarCalendarioCitas() {
    const fechaInput = document.getElementById('fecha-cita');
    if (!fechaInput) return;

    // Fecha mínima: Hoy
    const hoy = new Date().toISOString().split('T')[0];
    fechaInput.min = hoy;

    // Cargar citas existentes
    cargarCitasGuardadas();

    fechaInput.addEventListener('change', function() {
        generarHorarios(this.value);
    });

    const formCita = document.getElementById('formCita');
    if (formCita) {
        formCita.addEventListener('submit', function(e) {
            e.preventDefault();
            guardarCita();
        });
    }
}

function generarHorarios(fecha) {
    const contenedor = document.getElementById('horarios-disponibles');
    const formDiv = document.getElementById('formulario-cita'); // El contenedor visual
    const formTag = document.getElementById('formCita');       // La etiqueta <form> lógica
    
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
                // Visual: Marcar botón seleccionado
                document.querySelectorAll('.horario-btn').forEach(b => b.classList.remove('seleccionado'));
                btn.classList.add('seleccionado');
                
                // Visual: Mostrar formulario
                formDiv.style.display = 'block';
                formDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                
                // LÓGICA (CORRECCIÓN): Guardamos los datos en el <form> directamente
                formTag.dataset.fechaSeleccionada = fecha;
                formTag.dataset.horaSeleccionada = hora;
                
                console.log(`Hora seleccionada: ${fecha} a las ${hora}`); // Debug en consola
            };
        }
        contenedor.appendChild(btn);
    }
}

function guardarCita() {
    const formTag = document.getElementById('formCita');
    
    // LÓGICA (CORRECCIÓN): Leemos del mismo lugar donde guardamos
    const fecha = formTag.dataset.fechaSeleccionada;
    const hora = formTag.dataset.horaSeleccionada;
    
    // Si por alguna razón faltan datos, detenemos
    if (!fecha || !hora) {
        alert("Por favor selecciona una fecha y hora nuevamente.");
        return;
    }

    const nombre = document.getElementById('cita-nombre').value;
    const telefono = document.getElementById('cita-telefono').value;
    const motivo = document.getElementById('cita-motivo').value;

    const nuevaCita = {
        id: Date.now(),
        fecha: fecha,
        hora: hora,
        nombre: nombre,
        motivo: motivo,
        telefono: telefono
    };

    let citas = JSON.parse(localStorage.getItem('mis-citas-alpha')) || [];
    citas.push(nuevaCita);
    localStorage.setItem('mis-citas-alpha', JSON.stringify(citas));

    mostrarNotificacion('✅ Cita agendada con éxito');
    
    // Resetear todo
    formTag.reset();
    document.getElementById('formulario-cita').style.display = 'none';
    document.getElementById('horarios-disponibles').innerHTML = '';
    document.getElementById('fecha-cita').value = '';
    
    cargarCitasGuardadas();
}

function cargarCitasGuardadas() {
    const contenedor = document.getElementById('mis-citas-guardadas');
    if(!contenedor) return;

    const citas = JSON.parse(localStorage.getItem('mis-citas-alpha')) || [];
    contenedor.innerHTML = '';

    if (citas.length === 0) {
        // Ajustamos el estilo del mensaje "No tienes citas" para modo oscuro también
        contenedor.innerHTML = `
            <p style="color: var(--color-texto, #666); font-style: italic; font-size: 14px; text-align:center; opacity: 0.7;">
                No tienes citas programadas.
            </p>`;
        return;
    }

    citas.sort((a, b) => new Date(a.fecha + 'T' + a.hora) - new Date(b.fecha + 'T' + b.hora));

    citas.forEach(cita => {
        const div = document.createElement('div');
        
        // CORRECCIÓN CLAVE: Usamos clases CSS en vez de estilos en línea
        div.className = 'cita-card'; 
        
        div.innerHTML = `
            <div>
                <div class="cita-texto">
                    📅 ${cita.fecha} <span style="color:#a83246; margin-left:5px; background:rgba(168, 50, 70, 0.1); padding:2px 6px; border-radius:4px;">⏰ ${cita.hora}</span>
                </div>
                <div class="cita-subtexto">
                    <strong>${cita.motivo}</strong> - ${cita.nombre}
                </div>
            </div>
            <button onclick="cancelarCita(${cita.id})" 
                    style="background: #e74c3c; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer; font-size: 12px; font-weight:bold;">
                Cancelar
            </button>
        `;
        contenedor.appendChild(div);
    });
}

function cancelarCita(id) {
    if(!confirm('¿Estás seguro de cancelar esta cita?')) return;

    let citas = JSON.parse(localStorage.getItem('mis-citas-alpha')) || [];
    citas = citas.filter(c => c.id !== id);
    localStorage.setItem('mis-citas-alpha', JSON.stringify(citas));
    
    cargarCitasGuardadas();
    mostrarNotificacion('🗑️ Cita cancelada');
}