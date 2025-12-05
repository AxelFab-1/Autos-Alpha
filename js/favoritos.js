// ============================================
// SISTEMA DE FAVORITOS
// ============================================

function inicializarFavoritos() {
    // Agregamos botones de favoritos a cada vehículo
    document.querySelectorAll('.flip-card-front').forEach(card => {
        const botonFavorito = document.createElement('button');
        botonFavorito.innerHTML = '🤍';
        botonFavorito.classList.add('boton-favorito');
        botonFavorito.style.cssText = `
            background: transparent;
            border: none;
            font-size: 20px;
            cursor: pointer;
            position: absolute;
            top: 10px;
            right: 10px;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.2s ease;
            z-index: 10;
        `;
        botonFavorito.onclick = function(e) {
            e.stopPropagation();
            toggleFavorito(card, botonFavorito);
        };
        
        card.style.position = 'relative';
        card.appendChild(botonFavorito);
        
        // Verificamos si ya es favorito
        const nombre = card.querySelector('.nombre-auto').textContent;
        if (localStorage.getItem(`favorito-${nombre}`)) {
            botonFavorito.innerHTML = '❤️';
        }
    });
    
    // Crear sección de favoritos
    const favoritosHTML = `
        <div class="favoritos-section" style="margin: 30px 0;">
            <h2 style="color: #a83246;">Mis Vehículos Favoritos</h2>
            <div id="lista-favoritos" style="display: flex; flex-wrap: wrap; gap: 15px; min-height: 50px; 
                 padding: 15px; background: #f8f9fa; border-radius: 5px;">
                <p style="color: #666; margin: 0;">Aún no tienes vehículos favoritos</p>
            </div>
        </div>
    `;
    
    const indice = document.querySelector('.indice');
    if (indice) {
        indice.insertAdjacentHTML('afterend', favoritosHTML);
    }
    actualizarFavoritos();
}

function toggleFavorito(card, boton) {
    const nombre = card.querySelector('.nombre-auto').textContent;
    const esFavorito = localStorage.getItem(`favorito-${nombre}`);
    
    if (esFavorito) {
        localStorage.removeItem(`favorito-${nombre}`);
        boton.innerHTML = '🤍';
        mostrarNotificacion(`❌ ${nombre} removido de favoritos`);
    } else {
        localStorage.setItem(`favorito-${nombre}`, 'true');
        boton.innerHTML = '❤️';
        mostrarNotificacion(`✅ ${nombre} agregado a favoritos`);
    }
    
    actualizarFavoritos();
}

function actualizarFavoritos() {
    const lista = document.getElementById('lista-favoritos');
    if (!lista) return;
    
    lista.innerHTML = '';
    
    let tieneFavoritos = false;
    
    // Buscar todos los vehículos en favoritos
    document.querySelectorAll('.flip-card-front').forEach(card => {
        const nombre = card.querySelector('.nombre-auto').textContent;
        
        if (localStorage.getItem(`favorito-${nombre}`)) {
            tieneFavoritos = true;
            const favoritoItem = document.createElement('div');
            favoritoItem.style.cssText = `
                background: white;
                padding: 10px;
                border-radius: 5px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                text-align: center;
                min-width: 150px;
            `;
            favoritoItem.innerHTML = `
                <strong>${nombre}</strong>
                <button onclick="removerFavorito('${nombre}')" 
                        style="background: #e74c3c; color: white; border: none; padding: 3px 8px; 
                               border-radius: 3px; cursor: pointer; margin-top: 5px; font-size: 12px;">
                    Eliminar
                </button>
            `;
            lista.appendChild(favoritoItem);
        }
    });
    
    if (!tieneFavoritos) {
        lista.innerHTML = '<p style="color: #666; margin: 0;">Aún no tienes vehículos favoritos</p>';
    }
}

// EN js/favoritos.js

function removerFavorito(nombre) {
    // 1. Borramos del almacenamiento
    localStorage.removeItem(`favorito-${nombre}`);
    
    // 2. Actualizamos la lista visual de abajo
    actualizarFavoritos();

    // 3. Buscamos todas las tarjetas en la pantalla
    document.querySelectorAll('.flip-card-front').forEach(card => {
        // Obtenemos el nombre del auto de esa tarjeta
        const nombreEnTarjeta = card.querySelector('.nombre-auto').textContent;
        
        // Si el nombre coincide con el que acabamos de borrar
        if (nombreEnTarjeta === nombre) {
            // Buscamos el botón de corazón dentro de esa tarjeta
            const boton = card.querySelector('.boton-favorito');
            if (boton) {
                boton.innerHTML = '🤍'; // Lo volvemos blanco
            }
        }
    });
    
    mostrarNotificacion(`❌ ${nombre} removido de favoritos`);

}
