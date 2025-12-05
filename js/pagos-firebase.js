// ============================================
// SISTEMA DE PAGOS (PRIVADO Y SEGURO) 💳
// ============================================

import { 
    db, auth, collection, addDoc, onSnapshot, deleteDoc, doc, query, where, onAuthStateChanged 
} from './firebase-config.js';

export function inicializarSistemaPagos() {
    const form = document.getElementById('formulario-tarjeta');
    const listaModal = document.getElementById('lista-tarjetas');
    const listaPrincipal = document.getElementById('lista-tarjetas-principal');

    // 1. ESCUCHADOR DE SESIÓN
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // === USUARIO CONECTADO ===
            console.log("Pagos: Cargando tarjetas de", user.email);
            
            // Cargar SUS tarjetas
            cargarTarjetasPrivadas(user);

            // Activar formulario de guardado
            if (form) {
                // Quitamos listeners anteriores para no duplicar
                const nuevoForm = form.cloneNode(true);
                form.parentNode.replaceChild(nuevoForm, form);
                
                nuevoForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    guardarTarjeta(user);
                });
                
                // Reactivar lógica visual de inputs (espacios en tarjeta, etc)
                activarFormatoInputs(); 
            }

        } else {
            // === USUARIO DESCONECTADO ===
            const mensaje = '<p style="text-align:center; padding:20px; color:#666;">🔒 Inicia sesión para ver tus tarjetas guardadas.</p>';
            if(listaModal) listaModal.innerHTML = mensaje;
            if(listaPrincipal) listaPrincipal.innerHTML = mensaje;
        }
    });
}

// --- CARGAR TARJETAS (Solo las mías) ---
function cargarTarjetasPrivadas(user) {
    // Query: Dame tarjetas donde 'uid' sea igual a MI ID
    const q = query(collection(db, "tarjetas"), where("uid", "==", user.uid));

    onSnapshot(q, (snapshot) => {
        const contenedores = ['lista-tarjetas', 'lista-tarjetas-principal'];
        
        // Preparamos el HTML de las tarjetas
        let htmlTarjetas = '';

        if (snapshot.empty) {
            htmlTarjetas = '<p style="text-align:center; color:#666; font-style:italic; padding:10px;">No tienes tarjetas guardadas.</p>';
        } else {
            snapshot.forEach((docSnap) => {
                const t = docSnap.data();
                
                // Icono según marca
                let icono = '💳';
                if(t.tipo === 'Visa') icono = '<span style="color:#1a1f71; font-weight:900; font-style:italic;">VISA</span>';
                if(t.tipo === 'Mastercard') icono = '<span style="color:#eb001b; font-weight:bold;">MC</span>';

                htmlTarjetas += `
                    <div class="tarjeta-item">
                        <div class="info-tarjeta">
                            <span class="icono-tarjeta" style="font-size:24px; width:50px; text-align:center;">${icono}</span>
                            <div>
                                <div style="font-weight:bold; color:#2c3e50;">${t.tipo}</div>
                                <div class="numero-tarjeta" style="font-family:monospace; letter-spacing:1px;">
                                    ${t.numeroOculto}
                                </div>
                                <small style="color:#7f8c8d; text-transform: uppercase;">${t.titular}</small>
                            </div>
                        </div>
                        <button class="boton-eliminar" onclick="window.borrarTarjeta('${docSnap.id}')">
                            Eliminar
                        </button>
                    </div>
                `;
            });
        }

        // Inyectar en ambos contenedores (Modal y Página Principal)
        contenedores.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.innerHTML = htmlTarjetas;
        });
    });
}

// --- GUARDAR TARJETA ---
async function guardarTarjeta(user) {
    const numeroInput = document.getElementById('numero-tarjeta');
    const titularInput = document.getElementById('nombre-titular');
    const tipoInput = document.getElementById('tipo-tarjeta');
    
    // Validaciones simples
    if(numeroInput.value.length < 16) return alert("Número de tarjeta inválido");

    try {
        await addDoc(collection(db, "tarjetas"), {
            uid: user.uid, // <--- LA LLAVE DE PRIVACIDAD
            titular: titularInput.value.toUpperCase(),
            tipo: tipoInput.value,
            // IMPORTANTE: Solo guardamos los últimos 4 dígitos por seguridad real
            numeroOculto: `•••• •••• •••• ${numeroInput.value.slice(-4)}`, 
            timestamp: new Date()
        });

        if(window.mostrarNotificacion) window.mostrarNotificacion("✅ Tarjeta guardada seguramente");
        else alert("Tarjeta guardada");
        
        // Limpiar form
        document.getElementById('formulario-tarjeta').reset();

    } catch (e) {
        console.error(e);
        alert("Error al guardar en la nube");
    }
}

// --- BORRAR TARJETA (Global) ---
window.borrarTarjeta = async (id) => {
    if(confirm("¿Seguro que deseas eliminar esta tarjeta?")) {
        try {
            await deleteDoc(doc(db, "tarjetas", id));
            if(window.mostrarNotificacion) window.mostrarNotificacion("🗑️ Tarjeta eliminada");
        } catch (e) { console.error(e); }
    }
};

// --- UTILIDADES VISUALES (Formato bonito al escribir) ---
function activarFormatoInputs() {
    const inputNumero = document.getElementById('numero-tarjeta');
    const inputCVV = document.getElementById('cvv');

    if (inputNumero) {
        inputNumero.addEventListener('input', function(e) {
            let val = e.target.value.replace(/\D/g, ''); // Solo números
            val = val.substring(0, 16); // Máximo 16
            val = val.replace(/(.{4})/g, '$1 ').trim(); // Espacios cada 4
            e.target.value = val;
        });
    }
    
    if (inputCVV) {
        inputCVV.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4);
        });
    }
    
    // Llenar select de años dinámicamente
    const selectAno = document.getElementById('ano-expiracion');
    if(selectAno && selectAno.options.length <= 1) {
        const year = new Date().getFullYear();
        for(let i=0; i<=10; i++) {
            const opt = document.createElement('option');
            opt.value = year + i;
            opt.innerText = year + i;
            selectAno.appendChild(opt);
        }
    }
}
