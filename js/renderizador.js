
function renderizarCatalogo() {
    console.log("Generando catálogo dinámicamente...");

    Object.entries(catalogoAutos).forEach(([idAuto, auto]) => {
        
        // --- GENERACION DE TARJETAS ---
        const idGrid = `grid-${auto.marca.toLowerCase()}`;
        const contenedorGrid = document.getElementById(idGrid);

        if (contenedorGrid) {
            const tarjetaHTML = `
                <div class="imagen-auto" onclick="toggleFlip(this)" data-id="${idAuto}">
                    <div class="flip-card-inner">
                        <div class="flip-card-front">
                            <img src="${auto.imagen}" alt="${auto.modelo}" width="300" height="200" loading="lazy">
                            <p class="nombre-auto">${auto.modelo}</p>
                            <p class="click-hint">Click para más info</p>
                        </div>

                        <div class="flip-card-back">
                            <div class="info-titulo">${auto.modelo}</div>
                            <div class="info-item"><span class="info-label">Motor:</span> ${auto.especificaciones.motor}</div>
                            <div class="info-item"><span class="info-label">Potencia:</span> ${auto.especificaciones.potencia}</div>
                            <div class="info-item"><span class="info-label">Transmisión:</span> ${auto.especificaciones.transmision}</div>
                            <div class="info-item"><span class="info-label">Precio:</span> ${auto.precio}</div>
                            
                            <button onclick="event.stopPropagation(); mostrarDetalleAuto('${idAuto}')" 
                                    style="margin-top: 15px; background: white; color: #a83246; border: none; padding: 5px 15px; border-radius: 20px; font-weight: bold; cursor: pointer;">
                                + Ver Detalle
                            </button>
                        </div>
                    </div>
                </div>
            `;
            contenedorGrid.innerHTML += tarjetaHTML;
        }

        // --- GENERAR FILAS DE TABLA ---
        const idTabla = `tabla-${auto.marca.toLowerCase()}`;
        const contenedorTabla = document.getElementById(idTabla);

        if (contenedorTabla) {
            // Extraemos el año del nombre (ejemplo: "Toyota Corolla 2024" -> "2024")
            const añoMatch = auto.modelo.match(/\d{4}/);
            const año = añoMatch ? añoMatch[0] : '2024';
            
            // Limpiamos el nombre para que no se repita la marca (ejemplo: "Toyota Corolla" -> "Corolla")
            let nombreLimpio = auto.modelo.replace(auto.marca, '').replace(año, '').trim();
            if(!nombreLimpio) nombreLimpio = auto.modelo; 

            const filaHTML = `
                <tr>
                    <td>${nombreLimpio}</td>
                    <td>${año}</td>
                    <td>${auto.especificaciones.motor}</td>
                    <td class="precio">${auto.precio}</td>
                    <td><a href="javascript:void(0)" onclick="mostrarDetalleAuto('${idAuto}')" class="enlace-detalle">Más info</a></td>
                </tr>
            `;
            contenedorTabla.innerHTML += filaHTML;
        }
    });

}




