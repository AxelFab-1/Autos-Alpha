// ============================================
// GESTIÓN DE FORMAS DE PAGO (MEJORADO)
// ============================================

function inicializarSistemaPagos() {
    cargarTarjetas();
    generarOpcionesAno(); // Llenar select de años
    
    const form = document.getElementById('formulario-tarjeta');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            agregarTarjeta();
        });
    }

    // Formatear input de tarjeta visualmente (espacios cada 4 números)
    const inputNumero = document.getElementById('numero-tarjeta');
    if (inputNumero) {
        inputNumero.addEventListener('input', function(e) {
            let val = e.target.value.replace(/\D/g, ''); // Solo números
            val = val.substring(0, 16); // Máximo 16 números
            val = val.replace(/(.{4})/g, '$1 ').trim(); // Espacios
            e.target.value = val;
        });
    }
    
    // Limitar CVV a solo números
    const inputCVV = document.getElementById('cvv');
    if (inputCVV) {
        inputCVV.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4);
        });
    }
}

// Generar opciones para el select de Año (Año actual + 10)
function generarOpcionesAno() {
    const select = document.getElementById('ano-expiracion');
    if (!select) return;
    
    const anoActual = new Date().getFullYear();
    select.innerHTML = '<option value="">Año</option>';
    
    for (let i = 0; i <= 10; i++) {
        const ano = anoActual + i;
        const option = document.createElement('option');
        option.value = ano;
        option.textContent = ano;
        select.appendChild(option);
    }
}

function agregarTarjeta() {
    // 1. Capturar todos los datos
    const titular = document.getElementById('nombre-titular').value;
    const numero = document.getElementById('numero-tarjeta').value;
    const tipo = document.getElementById('tipo-tarjeta').value;
    // Capturamos Exp y CVV para validar, pero NO los mostraremos
    const mes = document.getElementById('mes-expiracion').value;
    const ano = document.getElementById('ano-expiracion').value;
    const cvv = document.getElementById('cvv').value;

    // 2. Crear objeto tarjeta (Simulando encriptación: no guardamos CVV real)
    const nuevaTarjeta = {
        id: Date.now(),
        titular: titular.toUpperCase(),
        numeroOculto: `•••• ${numero.slice(-5)}`, // Solo guardamos el final para mostrar
        tipo: tipo,
        // Guardamos fecha solo por si se necesitara lógica futura, pero no se mostrará
        expiracion: `${mes}/${ano.slice(-2)}` 
    };

    // 3. Guardar en LocalStorage
    let tarjetas = JSON.parse(localStorage.getItem('mis-tarjetas')) || [];
    tarjetas.push(nuevaTarjeta);
    localStorage.setItem('mis-tarjetas', JSON.stringify(tarjetas));

    mostrarNotificacion('🔒 Tarjeta guardada exitosamente');
    document.getElementById('formulario-tarjeta').reset();
    
    // Recargar ambas listas (modal y principal)
    cargarTarjetas();
}

function cargarTarjetas() {
    const contenedores = ['lista-tarjetas', 'lista-tarjetas-principal'];
    const tarjetas = JSON.parse(localStorage.getItem('mis-tarjetas')) || [];

    contenedores.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;

        el.innerHTML = '';
        if (tarjetas.length === 0) {
            el.innerHTML = '<p style="text-align:center; color:#666; font-style:italic; padding:10px;">No tienes tarjetas guardadas.</p>';
            return;
        }

        tarjetas.forEach(t => {
            const div = document.createElement('div');
            div.className = 'tarjeta-item';
            
            // Icono según tipo
            let icono = '💳';
            if(t.tipo === 'Visa') icono = '<span style="color:#1a1f71; font-weight:900; font-style:italic;">VISA</span>';
            if(t.tipo === 'Mastercard') icono = '<span style="color:#eb001b; font-weight:bold;">MC</span>';

            // AQUÍ ESTÁ LA CLAVE: No mostramos ni CVV ni Fecha, solo Titular y Últimos dígitos
            div.innerHTML = `
                <div class="info-tarjeta">
                    <span class="icono-tarjeta" style="font-size:20px; width:40px;">${icono}</span>
                    <div>
                        <div class="numero-tarjeta" style="font-family:monospace; font-size:16px; color:#2c3e50;">
                            ${t.numeroOculto}
                        </div>
                        <small style="color:#7f8c8d; text-transform: uppercase;">${t.titular}</small>
                    </div>
                </div>
                <button class="boton-eliminar" onclick="eliminarTarjeta(${t.id})">Eliminar</button>
            `;
            el.appendChild(div);
        });
    });
}

function eliminarTarjeta(id) {
    if(!confirm("¿Seguro que deseas eliminar esta tarjeta?")) return;

    let tarjetas = JSON.parse(localStorage.getItem('mis-tarjetas')) || [];
    tarjetas = tarjetas.filter(t => t.id !== id);
    localStorage.setItem('mis-tarjetas', JSON.stringify(tarjetas));
    
    cargarTarjetas();
    mostrarNotificacion('🗑️ Tarjeta eliminada');
}