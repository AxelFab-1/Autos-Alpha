// ============================================
// CATÁLOGO DE AUTOS - DATOS
// ============================================

const catalogoAutos = {
    // TOYOTA
    'corolla': {
        marca: 'Toyota',
        modelo: 'Corolla 2024',
        precio: '$85,000',
        imagen: 'Carros/Toyota Corolla.png',
        especificaciones: {
            motor: '1.8L de 4 cilindros',
            potencia: '139 HP',
            transmision: 'CVT Automática',
            combustible: 'Gasolina',
            traccion: 'Delantera',
            consumo: '15 km/L ciudad, 18 km/L carretera',
            capacidad: '5 pasajeros',
            aceleracion: '0-100 km/h en 8.7 segundos'
        },
        caracteristicas: [
            'Sistema Toyota Safety Sense 3.0',
            'Pantalla táctil de 8"',
            'Apple CarPlay y Android Auto',
            'Cámara de visión trasera',
            'Control crucero adaptativo',
            'Asistente de mantenimiento de carril',
            'Faros LED',
            'Llave inteligente'
        ],
        descripcion: 'El Toyota Corolla 2024 combina eficiencia de combustible, tecnología avanzada y confiabilidad en un sedán compacto elegante. Perfecto para uso urbano y viajes largos.'
    },
    'camry': {
        marca: 'Toyota',
        modelo: 'Camry 2024',
        precio: '$120,000',
        imagen: 'Carros/Toyota Camry.png',
        especificaciones: {
            motor: '2.5L de 4 cilindros',
            potencia: '203 HP',
            transmision: 'Automática de 8 velocidades',
            combustible: 'Gasolina',
            traccion: 'Delantera',
            consumo: '13 km/L ciudad, 16 km/L carretera',
            capacidad: '5 pasajeros',
            aceleracion: '0-100 km/h en 7.9 segundos'
        },
        caracteristicas: [
            'Asientos de cuero premium',
            'Techo panorámico',
            'Sistema de audio JBL premium',
            'Pantalla de 9"',
            'Carga inalámbrica',
            'Asientos calefaccionados',
            'Control crucero dinámico',
            'Sistema de estacionamiento asistido'
        ],
        descripcion: 'El Toyota Camry 2024 redefine el lujo en su categoría con un interior espacioso, tecnología de vanguardia y un rendimiento excepcional.'
    },
    'rav4': {
        marca: 'Toyota',
        modelo: 'RAV4 2024',
        precio: '$145,000',
        imagen: 'Carros/Toyota RAV4.png',
        especificaciones: {
            motor: '2.5L de 4 cilindros',
            potencia: '203 HP',
            transmision: 'Automática de 8 velocidades',
            combustible: 'Gasolina',
            traccion: 'AWD (4x4)',
            consumo: '12 km/L ciudad, 15 km/L carretera',
            capacidad: '5 pasajeros',
            aceleracion: '0-100 km/h en 8.2 segundos'
        },
        caracteristicas: [
            'Sistema AWD dinámico',
            'Pantalla táctil de 8"',
            'Apple CarPlay y Android Auto',
            'Control de tracción multi-terreno',
            'Sistema de audio premium',
            'Portón trasero eléctrico',
            'Asistente de estacionamiento',
            'Faros LED automáticos'
        ],
        descripcion: 'El Toyota RAV4 2024 ofrece versatilidad y capacidad todo terreno en un SUV compacto, perfecto para aventuras urbanas y fuera de carretera.'
    },
    'highlander': {
        marca: 'Toyota',
        modelo: 'Highlander 2024',
        precio: '$175,000',
        imagen: 'Carros/Toyota Highlander.png',
        especificaciones: {
            motor: '3.5L V6',
            potencia: '295 HP',
            transmision: 'Automática de 8 velocidades',
            combustible: 'Gasolina',
            traccion: 'AWD',
            consumo: '10 km/L ciudad, 13 km/L carretera',
            capacidad: '8 pasajeros',
            aceleracion: '0-100 km/h en 7.3 segundos'
        },
        caracteristicas: [
            'Sistema de entretenimiento trasero',
            'Tercera fila de asientos',
            'Sistema de audio JBL',
            'Pantalla de 12.3"',
            'Control crucero adaptativo',
            'Asistente de punto ciego',
            'Sistema de estacionamiento automático',
            'Capacidad de remolque: 2,000 kg'
        ],
        descripcion: 'El Toyota Highlander 2024 es el SUV familiar perfecto, combinando espacio, confort y potencia para toda la familia.'
    },
    'tacoma': {
        marca: 'Toyota',
        modelo: 'Tacoma 2024',
        precio: '$155,000',
        imagen: 'Carros/Toyota Tacoma.png',
        especificaciones: {
            motor: '3.5L V6',
            potencia: '278 HP',
            transmision: 'Automática de 6 velocidades',
            combustible: 'Gasolina',
            traccion: '4x4',
            consumo: '9 km/L ciudad, 11 km/L carretera',
            capacidad: '5 pasajeros',
            carga: '680 kg'
        },
        caracteristicas: [
            'Sistema Multi-Terrain Select',
            'Cámara de visión periférica',
            'Control de descenso en pendientes',
            'Suspensión TRD',
            'Cabina doble',
            'Sistema de audio premium',
            'Asistente de punto ciego',
            'Capacidad de remolque: 3,000 kg'
        ],
        descripcion: 'La Toyota Tacoma 2024 es la pickup mediana más confiable del mercado, diseñada para el trabajo duro y la aventura.'
    },
    '4runner': {
        marca: 'Toyota',
        modelo: '4Runner 2024',
        precio: '$165,000',
        imagen: 'Carros/Toyota 4Runner.png',
        especificaciones: {
            motor: '4.0L V6',
            potencia: '270 HP',
            transmision: 'Automática de 5 velocidades',
            combustible: 'Gasolina',
            traccion: '4x4',
            consumo: '8 km/L ciudad, 10 km/L carretera',
            capacidad: '7 pasajeros',
            aceleracion: '0-100 km/h en 8.5 segundos'
        },
        caracteristicas: [
            'Sistema Kinetic Dynamic Suspension',
            'Control de tracción multi-terreno',
            'Tercera fila de asientos',
            'Sistema de audio premium',
            'Faros LED',
            'Asistente de punto ciego',
            'Sistema de navegación',
            'Capacidad de remolque: 2,270 kg'
        ],
        descripcion: 'El Toyota 4Runner 2024 es un SUV robusto y capaz, diseñado para los amantes de la aventura y el off-road.'
    },

    // HONDA
    'civic': {
        marca: 'Honda',
        modelo: 'Civic 2024',
        precio: '$95,000',
        imagen: 'Carros/Honda Civic.png',
        especificaciones: {
            motor: '1.5L Turbo',
            potencia: '180 HP',
            transmision: 'CVT o manual 6 velocidades',
            combustible: 'Gasolina',
            traccion: 'Delantera',
            consumo: '14 km/L ciudad, 17 km/L carretera',
            capacidad: '5 pasajeros',
            aceleracion: '0-100 km/h en 7.5 segundos'
        },
        caracteristicas: [
            'Sistema Honda Sensing',
            'Pantalla táctil de 7"',
            'Apple CarPlay y Android Auto',
            'Asientos deportivos',
            'Faros LED',
            'Control de crucero adaptativo',
            'Asistente de mantenimiento de carril',
            'Modo Econ para ahorro de combustible'
        ],
        descripcion: 'El Honda Civic 2024 combina deportividad y eficiencia con un diseño aerodinámico y tecnología avanzada de seguridad.'
    },
    'accord': {
        marca: 'Honda',
        modelo: 'Accord 2024',
        precio: '$135,000',
        imagen: 'Carros/Honda Accord.png',
        especificaciones: {
            motor: '2.0L Turbo',
            potencia: '252 HP',
            transmision: 'Automática de 10 velocidades',
            combustible: 'Gasolina',
            traccion: 'Delantera',
            consumo: '12 km/L ciudad, 15 km/L carretera',
            capacidad: '5 pasajeros',
            aceleracion: '0-100 km/h en 6.8 segundos'
        },
        caracteristicas: [
            'Sistema de audio Bose premium',
            'Pantalla táctil de 12.3"',
            'Asientos de cuero con memoria',
            'Sistema de navegación',
            'Carga inalámbrica',
            'Asientos calefaccionados y ventilados',
            'Head-up display',
            'Sistema de estacionamiento asistido'
        ],
        descripcion: 'El Honda Accord 2024 es el sedán ejecutivo que combina lujo, tecnología y rendimiento excepcional.'
    },
    'crv': {
        marca: 'Honda',
        modelo: 'CR-V 2024',
        precio: '$140,000',
        imagen: 'Carros/Honda CR-V.png',
        especificaciones: {
            motor: '1.5L Turbo',
            potencia: '190 HP',
            transmision: 'CVT',
            combustible: 'Gasolina',
            traccion: 'AWD',
            consumo: '13 km/L ciudad, 16 km/L carretera',
            capacidad: '5 pasajeros',
            aceleracion: '0-100 km/h en 8.0 segundos'
        },
        caracteristicas: [
            'Sistema Honda Sensing',
            'Pantalla táctil de 9"',
            'Apple CarPlay y Android Auto',
            'Sistema de audio premium',
            'Portón trasero eléctrico',
            'Asientos calefaccionados',
            'Control de crucero adaptativo',
            'Sistema de tracción inteligente AWD'
        ],
        descripcion: 'El Honda CR-V 2024 es el SUV compacto perfecto para familias, ofreciendo espacio, confort y eficiencia.'
    },
    'pilot': {
        marca: 'Honda',
        modelo: 'Pilot 2024',
        precio: '$165,000',
        imagen: 'Carros/Honda Pilot.png',
        especificaciones: {
            motor: '3.5L V6',
            potencia: '280 HP',
            transmision: 'Automática de 9 velocidades',
            combustible: 'Gasolina',
            traccion: 'AWD',
            consumo: '10 km/L ciudad, 13 km/L carretera',
            capacidad: '8 pasajeros',
            aceleracion: '0-100 km/h en 7.2 segundos'
        },
        caracteristicas: [
            'Sistema de entretenimiento trasero',
            'Tercera fila de asientos Magic Slide',
            'Sistema de audio premium',
            'Pantalla de 9"',
            'Portón trasero eléctrico',
            'Asientos calefaccionados y ventilados',
            'Sistema Honda Sensing',
            'Capacidad de remolque: 2,270 kg'
        ],
        descripcion: 'El Honda Pilot 2024 es el SUV familiar por excelencia, con espacio para 8 pasajeros y tecnología avanzada.'
    },
    'hrv': {
        marca: 'Honda',
        modelo: 'HR-V 2024',
        precio: '$110,000',
        imagen: 'Carros/Honda HR-V.png',
        especificaciones: {
            motor: '1.8L de 4 cilindros',
            potencia: '141 HP',
            transmision: 'CVT',
            combustible: 'Gasolina',
            traccion: 'Delantera',
            consumo: '14 km/L ciudad, 17 km/L carretera',
            capacidad: '5 pasajeros',
            aceleracion: '0-100 km/h en 10.5 segundos'
        },
        caracteristicas: [
            'Sistema Honda Sensing',
            'Pantalla táctil de 7"',
            'Apple CarPlay y Android Auto',
            'Asientos Magic Seat',
            'Sistema de audio de 6 parlantes',
            'Control de crucero',
            'Cámara de visión trasera',
            'Faros LED'
        ],
        descripcion: 'El Honda HR-V 2024 es el SUV subcompacto perfecto para la ciudad, con diseño versátil y eficiente.'
    },
    'odyssey': {
        marca: 'Honda',
        modelo: 'Odyssey 2024',
        precio: '$150,000',
        imagen: 'Carros/Honda Odyssey.png',
        especificaciones: {
            motor: '3.5L V6',
            potencia: '280 HP',
            transmision: 'Automática de 10 velocidades',
            combustible: 'Gasolina',
            traccion: 'Delantera',
            consumo: '10 km/L ciudad, 12 km/L carretera',
            capacidad: '8 pasajeros',
            aceleracion: '0-100 km/h en 7.8 segundos'
        },
        caracteristicas: [
            'Sistema de entretenimiento CabinWatch',
            'Asientos Magic Slide de segunda fila',
            'Sistema de audio premium',
            'Pantalla de 10.2"',
            'Portón trasero eléctrico',
            'Sistema de navegación',
            'Cámara de visión periférica',
            'Sistema HondaVac integrado'
        ],
        descripcion: 'La Honda Odyssey 2024 redefine la minivan familiar con tecnología innovadora y máximo confort para todos los pasajeros.'
    },

    // FORD
    'mustang': {
        marca: 'Ford',
        modelo: 'Mustang 2024',
        precio: '$180,000',
        imagen: 'Carros/Ford Mustang.png',
        especificaciones: {
            motor: '5.0L V8',
            potencia: '450+ HP',
            transmision: 'Manual de 6 velocidades o automática de 10 velocidades',
            combustible: 'Gasolina',
            traccion: 'Trasera',
            consumo: '8 km/L ciudad, 12 km/L carretera',
            capacidad: '4 pasajeros',
            aceleracion: '0-100 km/h en 4.3 segundos'
        },
        caracteristicas: [
            'Motor V8 Coyote',
            'Sistema de escape activo',
            'Asientos Recaro deportivos',
            'Pantalla táctil de 12"',
            'Sistema de audio B&O',
            'Diferencial de deslizamiento limitado',
            'Modos de conducción: Normal, Sport, Track, Snow/Wet',
            'Iluminación ambiental personalizable'
        ],
        descripcion: 'El Ford Mustang 2024 es la encarnación del muscle car americano, con un motor V8 rugiente y un diseño icónico que acelera el corazón.'
    },
    'f150': {
        marca: 'Ford',
        modelo: 'F-150 2024',
        precio: '$165,000',
        imagen: 'Carros/Ford F-150.png',
        especificaciones: {
            motor: '3.5L V6 EcoBoost',
            potencia: '400 HP',
            transmision: 'Automática de 10 velocidades',
            combustible: 'Gasolina',
            traccion: '4x4',
            consumo: '9 km/L ciudad, 11 km/L carretera',
            capacidad: '6 pasajeros',
            carga: '1,100 kg'
        },
        caracteristicas: [
            'Sistema Pro Power Onboard',
            'Cabina amplia SuperCrew',
            'Sistema SYNC 4 con pantalla de 12"',
            'Asientos de cuero',
            'Sistema de audio B&O',
            'Cámara de visión 360°',
            'Asistente de estacionamiento activo',
            'Capacidad de remolque: 5,800 kg'
        ],
        descripcion: 'La Ford F-150 2024 es la pickup más vendida de América, combinando potencia, tecnología y versatilidad incomparables.'
    },
    'explorer': {
        marca: 'Ford',
        modelo: 'Explorer 2024',
        precio: '$155,000',
        imagen: 'Carros/Ford Explorer.png',
        especificaciones: {
            motor: '2.3L EcoBoost',
            potencia: '300 HP',
            transmision: 'Automática de 10 velocidades',
            combustible: 'Gasolina',
            traccion: 'RWD / AWD',
            consumo: '10 km/L ciudad, 13 km/L carretera',
            capacidad: '7 pasajeros',
            aceleracion: '0-100 km/h en 7.8 segundos'
        },
        caracteristicas: [
            'Sistema SYNC 4 con pantalla de 10.1"',
            'Tercera fila de asientos',
            'Sistema de audio B&O',
            'Portón trasero eléctrico',
            'Asientos calefaccionados',
            'Sistema de navegación',
            'Cámara de visión 360°',
            'Capacidad de remolque: 2,500 kg'
        ],
        descripcion: 'El Ford Explorer 2024 es el SUV familiar que combina espacio, tecnología y capacidad todo terreno.'
    },
    'focus': {
        marca: 'Ford',
        modelo: 'Focus RS 2018',
        precio: '$41,120',
        imagen: 'Carros/Ford Focus RS.png',
        especificaciones: {
            motor: '2.3L EcoBoost',
            potencia: '350 HP',
            transmision: 'Manual de 6 velocidades',
            combustible: 'Gasolina',
            traccion: 'AWD',
            consumo: '9 km/L ciudad, 12 km/L carretera',
            capacidad: '5 pasajeros',
            aceleracion: '0-100 km/h en 4.7 segundos'
        },
        caracteristicas: [
            'Sistema AWD con vectorización de par',
            'Modo Drift',
            'Asientos Recaro deportivos',
            'Suspensión deportiva',
            'Frenos Brembo',
            'Sistema SYNC 3',
            'Control de lanzamiento',
            'Diferencial trasero mecánico'
        ],
        descripcion: 'El Ford Focus RS 2018 es el hatchback deportivo definitivo, con tracción integral y potencia explosiva para los entusiastas del volante.'
    },
    'escape': {
        marca: 'Ford',
        modelo: 'Escape ST-Line 2025',
        precio: '$140,000',
        imagen: 'Carros/Ford Escape ST-Line.png',
        especificaciones: {
            motor: '2.0L EcoBoost',
            potencia: '250 HP',
            transmision: 'Automática de 8 velocidades',
            combustible: 'Gasolina',
            traccion: 'AWD',
            consumo: '11 km/L ciudad, 14 km/L carretera',
            capacidad: '5 pasajeros',
            aceleracion: '0-100 km/h en 7.5 segundos'
        },
        caracteristicas: [
            'Paquete ST-Line deportivo',
            'Sistema SYNC 4 con pantalla de 13.2"',
            'Asientos deportivos',
            'Sistema de audio B&O',
            'Ford Co-Pilot360',
            'Portón trasero eléctrico',
            'Asientos calefaccionados',
            'Sistema de navegación'
        ],
        descripcion: 'El Ford Escape ST-Line 2025 combina el estilo deportivo con la practicidad de un SUV compacto, ofreciendo diversión al volante y comodidad familiar.'
    },
    'edge': {
        marca: 'Ford',
        modelo: 'Edge 2024',
        precio: '$145,000',
        imagen: 'Carros/Ford Edge 2024.png',
        especificaciones: {
            motor: '2.0L EcoBoost',
            potencia: '250 HP',
            transmision: 'Automática de 8 velocidades',
            combustible: 'Gasolina',
            traccion: 'AWD',
            consumo: '10 km/L ciudad, 13 km/L carretera',
            capacidad: '5 pasajeros',
            aceleracion: '0-100 km/h en 7.9 segundos'
        },
        caracteristicas: [
            'Sistema SYNC 4A con pantalla de 12"',
            'Asientos de cuero',
            'Sistema de audio B&O',
            'Ford Co-Pilot360 Assist+',
            'Portón trasero eléctrico',
            'Asientos calefaccionados y ventilados',
            'Sistema de navegación',
            'Cámara de visión 360°'
        ],
        descripcion: 'El Ford Edge 2024 es el SUV mediano perfecto para quienes buscan espacio, confort y tecnología avanzada en un vehículo versátil.'
    }
};