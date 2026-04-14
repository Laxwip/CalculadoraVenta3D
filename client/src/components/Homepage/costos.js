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
  Sticker: 0.10,
};

export const COSTO_POST_MIN = 0.0785;
export const COSTO_ENVIO = 1.25;

export function calcularCosto({
  filamento,
  unidades,
  tipoFilamento,
  horas,
  minutos,
  horasPost,
  minutosPost,
  aditivos
}) {
  const totalMin = (horas * 60) + minutos;
  const totalPostMin = (horasPost * 60) + minutosPost;

  const costoFilamento = unidades > 0 ? (filamento * COSTOS_FILAMENTO[tipoFilamento]) / unidades : 0;
  const costoElectricidad = unidades > 0 ? (totalMin * COSTO_ELECTRICIDAD_MIN) / unidades : 0;
  const costoAmortizacion = unidades > 0 ? (totalMin * COSTO_AMORTIZACION_MIN) / unidades : 0;

  let costoAditivos = 0;
  if (Array.isArray(aditivos)) {
    aditivos.forEach(a => {
      if (COSTOS_ADITIVOS[a]) {
        costoAditivos += COSTOS_ADITIVOS[a];
      }
    });
  }

  const costoPost = unidades > 0 ? (totalPostMin * COSTO_POST_MIN) / unidades : 0;

  // Base: filamento + electricidad + amortización
  const base = costoFilamento + costoElectricidad + costoAmortizacion;

  // Multiplicador aplicado solo a la base
  const baseMultiplicada = base * 1.1111;

  // Total sin envío (base multiplicada + aditivos + postprocesado)
  const totalSinEnvio = baseMultiplicada + costoAditivos + costoPost;

  // Precios de venta + envío
  const multi2 = (totalSinEnvio * 2) + COSTO_ENVIO;
  const multi185 = (totalSinEnvio * 1.85) + COSTO_ENVIO;
  const multi17 = (totalSinEnvio * 1.7) + COSTO_ENVIO;
  const multi155 = (totalSinEnvio * 1.55) + COSTO_ENVIO;

  return {
    costoFilamento,
    costoElectricidad,
    costoAmortizacion,
    costoAditivos,
    costoPost,
    subtotal: base,
    baseMultiplicada,
    totalSinEnvio,
    costoEnvio: COSTO_ENVIO,
    totalFinal: totalSinEnvio + COSTO_ENVIO, // total normal con envío
    multi2,
    multi185,
    multi17,
    multi155,
  };
}
