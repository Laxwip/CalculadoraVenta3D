import React from 'react';
import './Homepage.css';

export default function Homepage() {

  const calcularCosto = (e) => {
    e.preventDefault();

    const filamento = parseFloat(document.getElementById("filamento").value) || 0; // gramos
    const unidades = parseInt(document.getElementById("unidades").value) || 1;

    const horas = parseInt(document.getElementById("horas").value) || 0;
    const minutos = parseInt(document.getElementById("minutos").value) || 0;

    // Parámetros fijos
    const COSTO_FILAMENTO_GR = 0.05; // soles por gramo
    const COSTO_ELECTRICIDAD_MIN = 0.0017; // soles por minuto
    const COSTO_MANTENIMIENTO_MIN = 0.0353; // soles por minuto
    const COSTO_AMORTIZACION_MIN = 0.004; // soles por minuto
    const ADITIVOS_UND = 0.55; // soles por unidad
    const PROCESO_POST = 5; // soles fijos por lote de 10 und → se divide entre unidades

    // Tiempo total en minutos
    const totalMin = (horas * 60) + minutos;

    // Cálculos
    const costoFilamento = unidades > 0 ? (filamento * COSTO_FILAMENTO_GR) / unidades : 0;
    const costoElectricidad = unidades > 0 ? (totalMin * COSTO_ELECTRICIDAD_MIN) / unidades : 0;
    const costoMantenimiento = unidades > 0 ? (totalMin * COSTO_MANTENIMIENTO_MIN) / unidades : 0;
    const costoAmortizacion = unidades > 0 ? (totalMin * COSTO_AMORTIZACION_MIN) / unidades : 0;
    const costoAditivos = ADITIVOS_UND;
    const costoProceso = unidades > 0 ? PROCESO_POST / unidades : 0;

    // Total base
    const subtotal = costoFilamento + costoElectricidad + costoMantenimiento + costoAmortizacion + costoAditivos + costoProceso;

    // Margen de corrección (ejemplo: *1.1111)
    const total = subtotal * 1.1111;

    // Multiplicadores finales
    const multi5 = total * 5;
    const multi4 = total * 4;
    const multi3 = total * 3;
    const multi2 = total * 2;
    const multi15 = total * 1.5;

    document.getElementById("resultado").innerText = `
      Filamento: ${costoFilamento.toFixed(2)}
      Electricidad: ${costoElectricidad.toFixed(2)}
      Mantenimiento: ${costoMantenimiento.toFixed(2)}
      Amortización: ${costoAmortizacion.toFixed(2)}
      Aditivos: ${costoAditivos.toFixed(2)}
      Proceso/Post: ${costoProceso.toFixed(2)}
      -------------------------
      Subtotal: ${subtotal.toFixed(2)}
      Total (x1.1111): ${total.toFixed(2)}
      -------------------------
      x5: ${multi5.toFixed(2)}
      x4: ${multi4.toFixed(2)}
      x3: ${multi3.toFixed(2)}
      x2: ${multi2.toFixed(2)}
      x1.5: ${multi15.toFixed(2)}
    `;
  };

  return (
    <div className="homepage">
      <h1>Costo Final</h1>
      <form onSubmit={calcularCosto}>
        
        {/* Filamento */}
        <div>
          <label>Gramos de filamento:</label>
          <input type="number" id="filamento" />
        </div>

        <div>
          <label>Cantidad de unidades:</label>
          <input type="number" id="unidades" />
        </div>

        {/* Tiempo compartido */}
        <div>
          <label>Tiempo </label>
          <input
            type="text"
            id="horas"
            maxLength="2"
            inputMode="numeric"
            pattern="[0-9]*"
            style={{ width: "2.5em", textAlign: "center" }}
          />
          <label>:</label>
          <input
            type="text"
            id="minutos"
            maxLength="2"
            inputMode="numeric"
            pattern="[0-9]*"
            style={{ width: "2.5em", textAlign: "center" }}
          />
        </div>

        <button type="submit">Calcular</button>
      </form>

      <h2>Resultados</h2>
      <pre id="resultado"></pre>
    </div>
  );
}