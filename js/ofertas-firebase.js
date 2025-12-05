// ============================================
// CONTADOR DE OFERTA FLASH (MÓDULO) ⚡
// ============================================

export function inicializarContadorOferta() {
    const contenedor = document.querySelector('.contador-tiempo');
    if (!contenedor) return; // Si no existe el HTML, no hacemos nada

    // Calculamos el último día del mes actual automáticamente
    const ahora = new Date();
    const finDeMes = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0);
    finDeMes.setHours(23, 59, 59, 999);

    function actualizar() {
        const actual = new Date();
        const diferencia = finDeMes - actual;

        if (diferencia <= 0) {
            // Si la oferta terminó
            document.getElementById('dias').innerText = "00";
            document.getElementById('horas').innerText = "00";
            document.getElementById('minutos').innerText = "00";
            document.getElementById('segundos').innerText = "00";
            return;
        }

        const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
        const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

        // Actualizamos el DOM con ceros a la izquierda (padding)
        const elDias = document.getElementById('dias');
        const elHoras = document.getElementById('horas');
        const elMin = document.getElementById('minutos');
        const elSeg = document.getElementById('segundos');

        if(elDias) elDias.innerText = dias.toString().padStart(2, '0');
        if(elHoras) elHoras.innerText = horas.toString().padStart(2, '0');
        if(elMin) elMin.innerText = minutos.toString().padStart(2, '0');
        if(elSeg) elSeg.innerText = segundos.toString().padStart(2, '0');
    }

    // Actualizar cada segundo
    setInterval(actualizar, 1000);
    actualizar(); // Ejecutar inmediatamente para no esperar 1 seg
}
