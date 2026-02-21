import React, { useEffect } from 'react';
import './Homepage.css';

export default function Homepage() {

  const calcularCosto = (e) => {
    e.preventDefault();

    const filamento = parseFloat(document.getElementById("filamento").value) || 0; // gramos
    const unidades = parseInt(document.getElementById("unidades").value) || 1;

    // Tiempo de impresión
    const horas = document.getElementById("horas").value ? parseInt(document.getElementById("horas").value) : 0;
    const minutos = document.getElementById("minutos").value ? parseInt(document.getElementById("minutos").value) : 0;

    // Tiempo de postprocesado
    const horasPost = document.getElementById("horasPost").value ? parseInt(document.getElementById("horasPost").value) : 0;
    const minutosPost = document.getElementById("minutosPost").value ? parseInt(document.getElementById("minutosPost").value) : 0;

    // Guardar datos en localStorage
    localStorage.setItem("filamento", filamento);
    localStorage.setItem("unidades", unidades);
    localStorage.setItem("horas", horas);
    localStorage.setItem("minutos", minutos);
    localStorage.setItem("horasPost", horasPost);
    localStorage.setItem("minutosPost", minutosPost);

    // Parámetros fijos
    const COSTO_FILAMENTO_GR = 0.057; // soles por gramo
    const COSTO_ELECTRICIDAD_MIN = 0.00081; // soles por minuto
    const COSTO_AMORTIZACION_MIN = 0.0143; // soles por minuto (incluye mantenimiento)
    const ADITIVOS_UND = 0.5; // soles por unidad
    const COSTO_POST_MIN = 0.09; // soles por minuto de postprocesado

    // Tiempo total en minutos
    const totalMin = (horas * 60) + minutos;
    const totalPostMin = (horasPost * 60) + minutosPost;

    // Cálculos
    const costoFilamento = unidades > 0 ? (filamento * COSTO_FILAMENTO_GR) / unidades : 0;
    const costoElectricidad = unidades > 0 ? (totalMin * COSTO_ELECTRICIDAD_MIN) / unidades : 0;
    const costoAmortizacion = unidades > 0 ? (totalMin * COSTO_AMORTIZACION_MIN) / unidades : 0;
    const costoAditivos = ADITIVOS_UND;
    const costoPost = unidades > 0 ? (totalPostMin * COSTO_POST_MIN) / unidades : 0;

    // Total base
    const subtotal = costoFilamento + costoElectricidad + costoAmortizacion + costoAditivos + costoPost;

    // Margen de corrección
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
      Amortización: ${costoAmortizacion.toFixed(2)}
      Aditivos: ${costoAditivos.toFixed(2)}
      Postprocesado: ${costoPost.toFixed(2)}
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

  const limpiarCampos = () => {
    document.getElementById("filamento").value = "";
    document.getElementById("unidades").value = "";
    document.getElementById("horas").value = "";
    document.getElementById("minutos").value = "";
    document.getElementById("horasPost").value = "";
    document.getElementById("minutosPost").value = "";
    document.getElementById("resultado").innerText = "";

    // Limpiar localStorage
    localStorage.removeItem("filamento");
    localStorage.removeItem("unidades");
    localStorage.removeItem("horas");
    localStorage.removeItem("minutos");
    localStorage.removeItem("horasPost");
    localStorage.removeItem("minutosPost");
  };

  // Al cargar la página, recuperar datos guardados
  useEffect(() => {
    const filamento = localStorage.getItem("filamento");
    const unidades = localStorage.getItem("unidades");
    const horas = localStorage.getItem("horas");
    const minutos = localStorage.getItem("minutos");
    const horasPost = localStorage.getItem("horasPost");
    const minutosPost = localStorage.getItem("minutosPost");

    if (filamento) document.getElementById("filamento").value = filamento;
    if (unidades) document.getElementById("unidades").value = unidades;
    if (horas) document.getElementById("horas").value = horas;
    if (minutos) document.getElementById("minutos").value = minutos;
    if (horasPost) document.getElementById("horasPost").value = horasPost;
    if (minutosPost) document.getElementById("minutosPost").value = minutosPost;
  }, []);

  return (
    <div className="homepage">
      <h1>Costo Final</h1>
      <form onSubmit={calcularCosto}>
        
        {/* Filamento */}
        <div>
          <label>Gramos de filamento:</label>
          <input type="number" id="filamento" step="0.01" />
        </div>

        <div>
          <label>Cantidad de unidades:</label>
          <input type="number" id="unidades" />
        </div>

        {/* Tiempo de impresión */}
        <div>
          <label>Tiempo impresión </label>
          <input type="number" id="horas" min="0" step="1" style={{ width: "3em", textAlign: "center" }} />
          <label>:</label>
          <input type="number" id="minutos" min="0" step="1" style={{ width: "3em", textAlign: "center" }} />
        </div>

        {/* Tiempo de postprocesado */}
        <div>
          <label>Tiempo postprocesado </label>
          <input type="number" id="horasPost" min="0" step="1" style={{ width: "3em", textAlign: "center" }} />
          <label>:</label>
          <input type="number" id="minutosPost" min="0" step="1" style={{ width: "3em", textAlign: "center" }} />
        </div>

        <button type="submit">Calcular</button>
        <button type="button" onClick={limpiarCampos} style={{ marginLeft: "10px" }}>
          Limpiar
        </button>
      </form>

      <h2>Resultados</h2>
      <pre id="resultado"></pre>
    </div>
  );
}