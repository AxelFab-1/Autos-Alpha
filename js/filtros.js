// ============================================
// FILTROS INTERACTIVOS PARA TABLAS
// ============================================

function inicializarFiltros() {
    const marcas = document.querySelectorAll('.marca');
    
    marcas.forEach(marca => {
        const tabla = marca.querySelector('table');
        const titulo = marca.querySelector('.marca-titulo').textContent;
        
        // Crear contenedor de filtros
        const filtroHTML = `
            <div class="filtro-container" style="margin: 15px 0; display: flex; gap: 10px; align-items: center;">
                <input type="text" id="filtro-${titulo.toLowerCase()}" placeholder="Filtrar modelos de ${titulo}..." 
                       style="padding: 8px; border: 1px solid #ddd; border-radius: 5px; flex: 1;">
                <button onclick="limpiarFiltro('${titulo.toLowerCase()}')" 
                        style="background: #7a1724; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">
                    Limpiar
                </button>
            </div>
        `;
        
        tabla.insertAdjacentHTML('beforebegin', filtroHTML);
        
        // Agregar evento de filtrado
        const inputFiltro = document.getElementById(`filtro-${titulo.toLowerCase()}`);
        inputFiltro.addEventListener('input', function() {
            filtrarTabla(tabla, this.value);
        });
    });
}

function filtrarTabla(tabla, texto) {
    const filas = tabla.querySelectorAll('tr');
    texto = texto.toLowerCase();
    
    // Empezar desde la fila 1 para saltar los encabezados
    for (let i = 1; i < filas.length; i++) {
        const fila = filas[i];
        const celdas = fila.querySelectorAll('td');
        let mostrar = false;
        
        // Buscar en todas las celdas de la fila
        celdas.forEach(celda => {
            if (celda.textContent.toLowerCase().includes(texto)) {
                mostrar = true;
            }
        });
        
        fila.style.display = mostrar ? '' : 'none';
    }
}

function limpiarFiltro(marca) {
    const input = document.getElementById(`filtro-${marca}`);
    input.value = '';
    
    // Encontrar la tabla correspondiente y mostrar todas las filas
    const marcaElement = document.getElementById(marca);
    if (marcaElement) {
        const tabla = marcaElement.querySelector('table');
        const filas = tabla.querySelectorAll('tr');
        filas.forEach(fila => fila.style.display = '');
    }
}