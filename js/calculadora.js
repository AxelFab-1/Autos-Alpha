// ============================================
// CALCULADORA DE FINANCIAMIENTO
// ============================================

// Calculadora principal
function calcularFinanciamiento() {
    const precio = parseFloat(document.getElementById('precio-vehiculo').value);
    const enganchePorcentaje = parseFloat(document.getElementById('enganche-porcentaje').value);
    const plazo = parseInt(document.getElementById('plazo-meses').value);
    const tasaAnual = parseFloat(document.getElementById('tasa-interes').value);
    
    const enganche = precio * (enganchePorcentaje / 100);
    const montoFinanciar = precio - enganche;
    const tasaMensual = (tasaAnual / 100) / 12;
    
    // Fórmula para calcular la mensualidad
    const mensualidad = montoFinanciar * (tasaMensual * Math.pow(1 + tasaMensual, plazo)) / 
                       (Math.pow(1 + tasaMensual, plazo) - 1);
    
    const resultado = document.getElementById('resultado-financiamiento');
    resultado.innerHTML = `
        <div style="background: #e6f7ee; padding: 20px; border-radius: 8px; color: #27ae60; border-left: 4px solid #27ae60;">
            <h3 style="margin-top: 0; color: #1e7e34;" class="resultado-titulo">Resultado del Financiamiento</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div>
                    <p style="margin: 8px 0;"><strong>Enganche:</strong><br>$${enganche.toLocaleString()}</p>
                    <p style="margin: 8px 0;"><strong>Monto a financiar:</strong><br>$${montoFinanciar.toLocaleString()}</p>
                </div>
                <div>
                    <p style="margin: 8px 0;"><strong>Mensualidad:</strong><br>$${mensualidad.toFixed(2)}</p>
                    <p style="margin: 8px 0;"><strong>Total a pagar:</strong><br>$${(enganche + (mensualidad * plazo)).toLocaleString()}</p>
                </div>
            </div>
        </div>
    `;
}

// Configurar eventos para la calculadora mini en detalle
function configurarCalculadoraMini() {
    // Slider de enganche
    const slider = document.querySelector('.slider-enganche');
    const valorSpan = document.querySelector('.valor-enganche');
    
    if (slider && valorSpan) {
        slider.addEventListener('input', function() {
            valorSpan.textContent = this.value + '%';
        });
    }
}

// Calculadora para autos específicos en la página de detalle
function calcularFinanciamientoAuto(autoId) {
    const auto = catalogoAutos[autoId];
    const precio = parseFloat(auto.precio.replace('$', '').replace(',', ''));
    const enganchePorcentaje = parseInt(document.querySelector('.slider-enganche').value);
    const plazo = parseInt(document.querySelector('.select-plazo').value);
    const tasaAnual = 8; // Tasa fija para simplificar
    
    const enganche = precio * (enganchePorcentaje / 100);
    const montoFinanciar = precio - enganche;
    const tasaMensual = (tasaAnual / 100) / 12;
    
    const mensualidad = montoFinanciar * (tasaMensual * Math.pow(1 + tasaMensual, plazo)) / 
                       (Math.pow(1 + tasaMensual, plazo) - 1);
    
    const resultadoDiv = document.querySelector('.resultado-mini');
    resultadoDiv.innerHTML = `
        <div style="background: #e6f7ee; padding: 15px; border-radius: 8px; color: #27ae60; border-left: 4px solid #27ae60;">
            <div style="font-size: 18px; margin-bottom: 8px;"><strong>Mensualidad: $${mensualidad.toFixed(2)}</strong></div>
            <div style="font-size: 14px;">
                Enganche: $${enganche.toLocaleString()} (${enganchePorcentaje}%)<br>
                Total financiado: $${montoFinanciar.toLocaleString()}<br>
                Plazo: ${plazo} meses
            </div>
        </div>
    `;
}