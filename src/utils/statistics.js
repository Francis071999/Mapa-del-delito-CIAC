export const calculateStats = (incidents) => {
  const total = incidents.length;
  
  const byType = {
    Homicidios: 0,
    Lesiones: 0,
    'Robo con arma': 0,
    'Robo sin arma': 0,
    Hurto: 0,
    Vialidad: 0,
    Amenazas: 0
  };

  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const monthlyCounts = Array(12).fill(0);
  const neighborhoodCounts = {};
  
  const hourlyRanges = {
    '00:00–05:59': 0,
    '06:00–11:59': 0,
    '12:00–17:59': 0,
    '18:00–23:59': 0
  };

  incidents.forEach(inc => {
    // Tipo
    if (byType[inc.tipo] !== undefined) {
      byType[inc.tipo]++;
    }

    // Mes
    if (inc.fecha) {
      const monthIdx = parseInt(inc.fecha.split('-')[1], 10) - 1;
      if (monthIdx >= 0 && monthIdx < 12) {
        monthlyCounts[monthIdx]++;
      }
    }

    // Barrio
    if (inc.barrio) {
      neighborhoodCounts[inc.barrio] = (neighborhoodCounts[inc.barrio] || 0) + 1;
    }

    // Horario
    if (inc.hora) {
      const hour = parseInt(inc.hora.split(':')[0], 10);
      if (hour >= 0 && hour < 6) hourlyRanges['00:00–05:59']++;
      else if (hour >= 6 && hour < 12) hourlyRanges['06:00–11:59']++;
      else if (hour >= 12 && hour < 18) hourlyRanges['12:00–17:59']++;
      else hourlyRanges['18:00–23:59']++;
    }
  });

  // Top Barrio
  let maxBarrio = 'Sin datos';
  let maxBarrioCount = 0;
  Object.entries(neighborhoodCounts).forEach(([b, c]) => {
    if (c > maxBarrioCount) {
      maxBarrioCount = c;
      maxBarrio = b;
    }
  });

  // Top Delito
  let maxDelito = 'Sin datos';
  let maxDelitoCount = 0;
  Object.entries(byType).forEach(([d, c]) => {
    if (c > maxDelitoCount) {
      maxDelitoCount = c;
      maxDelito = d;
    }
  });

  // Mes Máximo y Mínimo
  let maxMonthIdx = 0, minMonthIdx = 0;
  monthlyCounts.forEach((cnt, idx) => {
    if (cnt > monthlyCounts[maxMonthIdx]) maxMonthIdx = idx;
    if (cnt < monthlyCounts[minMonthIdx]) minMonthIdx = idx;
  });

  return {
    total,
    byType,
    monthly: months.map((m, idx) => ({ mes: m, cantidad: monthlyCounts[idx] })),
    neighborhoods: Object.entries(neighborhoodCounts).map(([name, count]) => ({ name, count })),
    hourly: Object.entries(hourlyRanges).map(([range, count]) => ({ range, count })),
    topBarrio: maxBarrio,
    topDelito: maxDelito,
    maxMonth: months[maxMonthIdx],
    minMonth: months[minMonthIdx]
  };
};