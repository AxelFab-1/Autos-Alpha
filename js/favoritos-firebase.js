// ============================================
// SISTEMA DE FAVORITOS (AUTÓNOMO E INYECTABLE) ❤️
// ============================================

import { db, auth, collection, addDoc, onSnapshot, deleteDoc, doc, query, where, onAuthStateChanged } from './firebase-config.js';

// Esta función se llama desde main.js
export function inicializarFavoritos() {
    // 1. INYECCIÓN DE UI (DOM)
    // Si el módulo falla o se quita, esto no ocurre y la web queda limpia
    inyectarSeccionFavoritos();
    inyectarBotonesCorazon();

    // 2. LÓGICA DE FIREBASE
    onAuthStateChanged(auth, (user) => {
        const seccion = document.getElementById('seccion-favoritos');
        const aviso = document.getElementById('aviso-favoritos');
        const lista = document.getElementById('lista-favoritos');

        // Mostrar la sección inyectada
        if(seccion) seccion.style.display = 'block';

        if (user) {
            // == CONECTADO ==
            if(aviso) aviso.style.display = 'none';
            if(lista) lista.style.display = 'flex';
            
            // Cargar datos
            cargarFavoritosDeUsuario(user);
            
            // Definir qué hace el clic (Guardar)
            window.manejarClickCorazon = (modelo) => guardarFavorito(modelo, user);

        } else {
            // == DESCONECTADO ==
            if(aviso) aviso.style.display = 'block';
            if(lista) lista.style.display = 'none';
            
            // Resetear visuales
            limpiarCorazones();
            
            // Definir qué hace el clic (Pedir login)
            window.manejarClickCorazon = () => alert("🔒 Inicia sesión arriba para agregar favoritos.");
        }
    });
}

// --- FUNCIONES DE INYECCIÓN DOM (LO NUEVO) ---

function inyectarSeccionFavoritos() {
    // Buscamos dónde insertarlo (después del índice es un buen lugar)
    const indice = document.querySelector('.indice');
    if (!indice || document.getElementById('seccion-favoritos')) return; // Ya existe o no hay indice

    const htmlSeccion = `
        <div class="favoritos-section" id="seccion-favoritos" style="margin: 30px 0; display: none;">
            <h2 style="color: #a83246;">❤️ Mis Vehículos Favoritos</h2>
            <div id="aviso-favoritos" style="text-align: center; color: #666; padding: 20px;">
                🔒 Inicia sesión para ver y guardar tus favoritos.
            </div>
            <div id="lista-favoritos" style="display: none; flex-wrap: wrap; gap: 15px; padding: 15px; background: #f8f9fa; border-radius: 5px; min-height: 50px;">
                </div>
        </div>
    `;
    
    // Insertar después del índice
    indice.insertAdjacentHTML('afterend', htmlSeccion);
}

function inyectarBotonesCorazon() {
    // Buscamos todas las partes frontales de las tarjetas
    const cardsFront = document.querySelectorAll('.flip-card-front');

    cardsFront.forEach(front => {
        // Verificar si ya tiene corazón para no repetir
        if (front.querySelector('.boton-favorito')) return;

        // Crear el botón manualmente
        const btn = document.createElement('button');
        btn.className = 'boton-favorito';
        btn.innerHTML = '🤍';
        
        // Estilos necesarios para que flote (aunque ya están en CSS, esto asegura posición)
        // Nota: Mejor si los estilos complejos están en CSS (.boton-favorito)
        
        // Obtener el nombre del modelo para el evento
        const nombreModelo = front.querySelector('.nombre-auto').textContent;

        // Evento Click
        btn.onclick = (e) => {
            e.stopPropagation(); // Evitar que gire la tarjeta
            if(window.manejarClickCorazon) window.manejarClickCorazon(nombreModelo);
        };

        // Insertar al principio del div front
        front.insertBefore(btn, front.firstChild);
    });
}

// --- LÓGICA DE DATOS (IGUAL QUE ANTES) ---

function cargarFavoritosDeUsuario(user) {
    const lista = document.getElementById('lista-favoritos');
    const q = query(collection(db, "favoritos"), where("uid", "==", user.uid));

    onSnapshot(q, (snapshot) => {
        lista.innerHTML = '';
        const modelosFavoritos = [];

        if (snapshot.empty) {
            lista.innerHTML = '<p style="color:#666; width:100%; text-align:center;">No tienes favoritos aún.</p>';
        }

        snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            modelosFavoritos.push(data.modelo);

            const item = document.createElement('div');
            item.style.cssText = `background: white; padding: 10px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); display: flex; align-items: center; gap: 10px; border-left: 3px solid #a83246;`;
            item.innerHTML = `
                <strong>${data.modelo}</strong>
                <button onclick="window.borrarFavorito('${docSnap.id}')" style="color:#e74c3c; background:none; border:none; cursor:pointer; font-weight:bold;">X</button>
            `;
            lista.appendChild(item);
        });

        actualizarCorazonesCatalogo(modelosFavoritos);
    });
}

async function guardarFavorito(modelo, user) {
    // Verificación visual simple para no duplicar llamadas
    const cards = document.querySelectorAll('.imagen-auto');
    let yaExiste = false;
    cards.forEach(card => {
        if(card.querySelector('.nombre-auto').textContent === modelo) {
            if(card.querySelector('.boton-favorito').textContent === '❤️') yaExiste = true;
        }
    });

    if(yaExiste) {
        alert("Ya está en favoritos. Bórralo de la lista de abajo si deseas quitarlo.");
        return;
    }

    try {
        await addDoc(collection(db, "favoritos"), {
            uid: user.uid,
            modelo: modelo,
            timestamp: new Date()
        });
        if(window.mostrarNotificacion) window.mostrarNotificacion(`❤️ ${modelo} agregado`);
    } catch (e) { console.error(e); }
}

function actualizarCorazonesCatalogo(modelosFavoritos) {
    document.querySelectorAll('.imagen-auto').forEach(card => {
        const nombreModelo = card.querySelector('.nombre-auto').textContent;
        const boton = card.querySelector('.boton-favorito');
        
        if (boton) {
            if (modelosFavoritos.includes(nombreModelo)) {
                boton.textContent = '❤️';
                boton.style.transform = "scale(1.2)";
            } else {
                boton.textContent = '🤍';
                boton.style.transform = "scale(1)";
            }
        }
    });
}

function limpiarCorazones() {
    document.querySelectorAll('.boton-favorito').forEach(btn => btn.textContent = '🤍');
}

window.borrarFavorito = async (id) => {
    if(confirm("¿Quitar de favoritos?")) {
        try { await deleteDoc(doc(db, "favoritos", id)); } catch(e) { console.error(e); }
    }
};
