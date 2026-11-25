// src/data/contextualData.js

export const CONTEXTUAL_LAYERS = {
  comisarias: [
    {
      id: 'ctx-c1',
      name: 'Comisaría Seccional Bella Vista',
      category: 'Comisaría',
      lat: -27.0350,
      lng: -65.3030,
      address: 'Av. Manuel Belgrano 450',
      phone: '(0381) 492-1002',
      description: 'Dependencia policial principal del municipio de Bella Vista.',
      verificado: true
    },
    {
      id: 'ctx-c2',
      name: 'Base Operativa CIAC',
      category: 'Comisaría',
      lat: -27.0342,
      lng: -65.3019,
      address: 'Centro Municipal de Monitoreo',
      phone: '103 / (0381) 492-3000',
      description: 'Centro de Monitoreo y Asistencia Ciudadana (CIAC).',
      verificado: true
    }
  ],
  motorizada: [
    {
      id: 'ctx-m1',
      name: 'Base Patrulla Motorizada Bella Vista',
      category: 'Motorizada',
      lat: -27.0330,
      lng: -65.3010,
      address: 'Av. Independencia e/ San Martín',
      description: 'Unidad de respuesta rápida y patrullaje motorizado.',
      verificado: true
    }
  ],
  casaCultura: [
    {
      id: 'ctx-cc1',
      name: 'Casa de la Cultura Bella Vista',
      category: 'Casa de la Cultura',
      lat: -27.0340,
      lng: -65.3022,
      address: 'Calle San Martín 200',
      description: 'Centro cultural municipal y punto de encuentro comunitario.',
      verificado: true
    }
  ],
  salud: [
    {
      id: 'ctx-h1',
      name: 'Hospital Regional Bella Vista',
      category: 'Hospital',
      lat: -27.0335,
      lng: -65.3025,
      address: 'Entre Ríos 250',
      phone: '(0381) 492-1050',
      description: 'Centro hospitalario de atención médica general y urgencias.',
      verificado: true
    },
    {
      id: 'ctx-h2',
      name: 'CAPS Bella Vista Sur',
      category: 'Hospital',
      lat: -27.0410,
      lng: -65.2980,
      address: 'Barrio San Cayetano',
      description: 'Centro de Atención Primaria de la Salud.',
      verificado: true
    }
  ],
  bomberos: [
    {
      id: 'ctx-f1',
      name: 'Cuartel de Bomberos Voluntarios',
      category: 'Cuartel de Bomberos',
      lat: -27.0380,
      lng: -65.3050,
      address: 'Av. Mitre 510',
      phone: '100 / (0381) 492-2222',
      description: 'Servicio de emergencias y rescate urbano de Bella Vista.',
      verificado: true
    }
  ]
};