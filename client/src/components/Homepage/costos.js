// costos.js
export const COSTOS_FILAMENTO = {
  PLA: 50 / 1000,
  'PLA+': 55 / 1000,
  PETG: 60 / 1000,
  ABS: 70 / 1000,
  TPU: 100 / 1000,
};

export const COSTO_ELECTRICIDAD_MIN = 0.000724;
export const COSTO_AMORTIZACION_MIN = 0.0143;

export const COSTOS_ADITIVOS = {
  Argolla: 0.17,
  Ziplock: 0.23,
  Switch: 0.23,
  Sticker: 0.10, // añadido
};

export const COSTO_POST_MIN = 0.0785;

export function calcularCosto({
  filamento,
  unidades,
  tipoFilamento,
  horas,
  minutos,
  horasPost,
  minutosPost,
  aditivos // ahora recibimos array
}) {
  const totalMin = (horas * 60) + minutos;
  const totalPostMin = (horasPost * 60) + minutosPost;

  const costoFilamento = unidades > 0 ? (filamento * COSTOS_FILAMENTO[tipoFilamento]) / unidades : 0;
  const costoElectricidad = unidades > 0 ? (totalMin * COSTO_ELECTRICIDAD_MIN) / unidades : 0;
  const costoAmortizacion = unidades > 0 ? (totalMin * COSTO_AMORTIZACION_MIN) / unidades : 0;

  // Cálculo de aditivos con array
  let costoAditivos = 0;
  if (Array.isArray(aditivos)) {
    aditivos.forEach(a => {
      if (COSTOS_ADITIVOS[a]) {
        costoAditivos += COSTOS_ADITIVOS[a];
      }
    });
  }

  // Postprocesado siempre se incluye (aunque sea 0)
  const costoPost = unidades > 0 ? (totalPostMin * COSTO_POST_MIN) / unidades : 0;

  const subtotal = costoFilamento + costoElectricidad + costoAmortizacion + costoAditivos + costoPost;
  const total = subtotal * 1.1111;

  return {
    costoFilamento,
    costoElectricidad,
    costoAmortizacion,
    costoAditivos,
    costoPost,
    subtotal,
    total,
    multi2: total * 2,
    multi185: total * 1.85,
    multi17: total * 1.7,
    multi155: total * 1.55,
  };
}