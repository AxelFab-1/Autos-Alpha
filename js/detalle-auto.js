// ============================================
// PÁGINAS DE DETALLE DE AUTOS
// ============================================

let scrollPosition = 0;
let currentAutoId = null;

function mostrarDetalleAuto(autoId) {
    // Guardar posición actual del scroll
    scrollPosition = window.pageYOffset;
    currentAutoId = autoId;

    const auto = catalogoAutos[autoId];
    if (!auto) return;

    // Ocultar catálogo principal
    document.querySelector('.container').style.display = 'none';
    
    // Mostrar sección de detalle
    const detalleSection = document.getElementById('detalle-auto');
    const contenidoDetalle = document.getElementById('contenido-detalle');
    
    detalleSection.style.display = 'block';
    
    // Construir contenido del detalle
    contenidoDetalle.innerHTML = `
        <div class="detalle-container">
            <!-- Columna de Imagen -->
            <div class="detalle-imagen">
                <img src="${auto.imagen}" alt="${auto.modelo}">
                <div style="text-align: center; margin-top: 20px;">
                    <button class="boton-modal" onclick="solicitarPruebaManejoDesdeDetalle('${auto.modelo}')" style="margin: 5px;">
                        🚗 Solicitar Prueba de Manejo
                    </button>
                    <button class="boton-modal" onclick="cotizarAuto('${auto.modelo}')" style="margin: 5px; background: #27ae60;">
                        💰 Solicitar Cotización
                    </button>
                </div>
            </div>
            
            <!-- Columna de Información -->
            <div class="detalle-info">
                <h1>${auto.modelo}</h1>
                <div class="precio-detalle">${auto.precio}</div>
                
                <p style="font-size: 16px; line-height: 1.6; color: #555; margin-bottom: 25px;">
                    ${auto.descripcion}
                </p>
                
                <!-- Especificaciones Técnicas -->
                <div class="especificaciones">
                    <h3 style="color: #a83246; border-bottom: 2px solid #a83246; padding-bottom: 8px;">
                        📊 Especificaciones Técnicas
                    </h3>
                    <div class="especificaciones-grid">
                        ${Object.entries(auto.especificaciones).map(([key, value]) => `
                            <div class="especificacion-item">
                                <strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong><br>
                                <span style="color: #666;">${value}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Características -->
                <div class="caracteristicas" style="margin-top: 30px;">
                    <h3 style="color: #a83246; border-bottom: 2px solid #a83246; padding-bottom: 8px;">
                        ⭐ Características Principales
                    </h3>
                    <div class="caracteristicas-grid">
                        ${auto.caracteristicas.map(caracteristica => `
                            <div class="caracteristica-item">
                                <span style="color: #27ae60; margin-right: 10px; font-size: 18px;">✓</span>
                                <span>${caracteristica}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Calculadora para este auto específico -->
                <div class="calculadora-mini">
                    <h4 style="margin-top: 0; color: #a83246;">💳 Calcula tu financiamiento</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0;">
                        <div>
                            <label style="font-size: 14px; font-weight: bold; display: block; margin-bottom: 8px;">Enganche (%):</label>
                            <input type="range" min="10" max="50" value="20" class="slider-enganche" 
                                   style="width: 100%; margin: 5px 0;">
                            <span class="valor-enganche" style="font-size: 14px; font-weight: bold;">20%</span>
                        </div>
                        <div>
                            <label style="font-size: 14px; font-weight: bold; display: block; margin-bottom: 8px;">Plazo (meses):</label>
                            <select class="select-plazo" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; font-size: 14px;">
                                <option value="12">12 meses</option>
                                <option value="24">24 meses</option>
                                <option value="36" selected>36 meses</option>
                                <option value="48">48 meses</option>
                                <option value="60">60 meses</option>
                            </select>
                        </div>
                    </div>
                    <button onclick="calcularFinanciamientoAuto('${autoId}')" 
                            style="background: #a83246; color: white; border: none; padding: 12px 20px; border-radius: 5px; cursor: pointer; width: 100%; font-size: 16px; font-weight: bold;">
                        Calcular Mensualidad
                    </button>
                    <div class="resultado-mini" style="margin-top: 15px; font-weight: bold; text-align: center;"></div>
                </div>
            </div>
        </div>
    `;
    
    // Configurar eventos para la calculadora mini
    configurarCalculadoraMini();
    
    // Scroll to top del detalle
    window.scrollTo(0, 0);
}

function cerrarDetalle() {
    document.getElementById('detalle-auto').style.display = 'none';
    document.querySelector('.container').style.display = 'block';
    
    // Restaurar posición del scroll
    window.scrollTo(0, scrollPosition);
    currentAutoId = null;
}