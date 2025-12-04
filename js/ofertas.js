// ============================================
// CONTADOR DE OFERTA FLASH (Fin de mes)
// ============================================

function inicializarContadorOferta() {
    const contenedor = document.querySelector('.contador-tiempo');
    if (!contenedor) return;

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
        document.getElementById('dias').innerText = dias.toString().padStart(2, '0');
        document.getElementById('horas').innerText = horas.toString().padStart(2, '0');
        document.getElementById('minutos').innerText = minutos.toString().padStart(2, '0');
        document.getElementById('segundos').innerText = segundos.toString().padStart(2, '0');
    }

    setInterval(actualizar, 1000);
    actualizar(); // Ejecutar inmediatamente
}