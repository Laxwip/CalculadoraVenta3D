// costos.js
export const COSTOS_FILAMENTO = {
  PLA: 50 / 1000,
  'PLA+': 55 / 1000,
  PETG: 60 / 1000,
  ABS: 70 / 1000,
  TPU: 100 / 1000,
};

export const COSTO_ELECTRICIDAD_MIN = 0.00081;
export const COSTO_AMORTIZACION_MIN = 0.0143;
export const ADITIVOS_UND = 0.5;
export const COSTO_POST_MIN = 0.09;

export function calcularCosto({
  filamento,
  unidades,
  tipoFilamento,
  horas,
  minutos,
  horasPost,
  minutosPost,
  incluirAditivos,
  incluirPost,
}) {
  const totalMin = (horas * 60) + minutos;
  const totalPostMin = (horasPost * 60) + minutosPost;

  const costoFilamento = unidades > 0 ? (filamento * COSTOS_FILAMENTO[tipoFilamento]) / unidades : 0;
  const costoElectricidad = unidades > 0 ? (totalMin * COSTO_ELECTRICIDAD_MIN) / unidades : 0;
  const costoAmortizacion = unidades > 0 ? (totalMin * COSTO_AMORTIZACION_MIN) / unidades : 0;
  const costoAditivos = incluirAditivos ? ADITIVOS_UND : 0;
  const costoPost = incluirPost && unidades > 0 ? (totalPostMin * COSTO_POST_MIN) / unidades : 0;

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
    multi125: total * 1.25,
    multi15: total * 1.5,
    multi175: total * 1.75,
    multi2: total * 2,
    multi25: total * 2.5,
    multi3: total * 3,
  };
}