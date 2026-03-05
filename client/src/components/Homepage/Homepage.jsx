import React, { useState, useEffect } from 'react';
import './Homepage.css';
import { calcularCosto } from './costos';

export default function Homepage() {
  const [filamento, setFilamento] = useState("");
  const [unidades, setUnidades] = useState(1);
  const [tipoFilamento, setTipoFilamento] = useState("PLA");
  const [horas, setHoras] = useState(0);
  const [minutos, setMinutos] = useState(0);
  const [horasPost, setHorasPost] = useState(0);
  const [minutosPost, setMinutosPost] = useState(0);
  const [incluirAditivos, setIncluirAditivos] = useState(true);
  const [incluirPost, setIncluirPost] = useState(true);
  const [resultado, setResultado] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("datosCosto"));
    if (saved) {
      setFilamento(saved.filamento);
      setUnidades(saved.unidades);
      setTipoFilamento(saved.tipoFilamento);
      setHoras(saved.horas);
      setMinutos(saved.minutos);
      setHorasPost(saved.horasPost);
      setMinutosPost(saved.minutosPost);
      setIncluirAditivos(saved.incluirAditivos ?? true);
      setIncluirPost(saved.incluirPost ?? true);
    }
  }, []);

  const handleCalcular = (e) => {
    e.preventDefault();
    const datos = { filamento: parseFloat(filamento) || 0, unidades, tipoFilamento, horas, minutos, horasPost, minutosPost, incluirAditivos, incluirPost };
    localStorage.setItem("datosCosto", JSON.stringify(datos));
    const res = calcularCosto(datos);

    setResultado(`
      Filamento (${tipoFilamento}): ${res.costoFilamento.toFixed(2)}
      Electricidad: ${res.costoElectricidad.toFixed(2)}
      Amortización: ${res.costoAmortizacion.toFixed(2)}
      Aditivos: ${res.costoAditivos.toFixed(2)}
      Postprocesado: ${res.costoPost.toFixed(2)}
      -------------------------
      Subtotal: ${res.subtotal.toFixed(2)}
      Total (x1.1111): ${res.total.toFixed(2)}
      -------------------------
      x3: ${res.multi3.toFixed(2)}
      x2.5: ${res.multi25.toFixed(2)}
      x2: ${res.multi2.toFixed(2)}
      x1.75: ${res.multi175.toFixed(2)}
      x1.5: ${res.multi15.toFixed(2)}
      x1.25: ${res.multi125.toFixed(2)}
    `);
  };

  const limpiarCampos = () => {
    setFilamento("");
    setUnidades(1);
    setTipoFilamento("PLA");
    setHoras(0);
    setMinutos(0);
    setHorasPost(0);
    setMinutosPost(0);
    setIncluirAditivos(true);
    setIncluirPost(true);
    setResultado("");
    localStorage.clear();
  };

  return (
    <div className="homepage">
      <h1>Costo Final</h1>
      <form onSubmit={handleCalcular}>
        {/* Filamento */}
        <div>
          <label>Gramos de filamento:</label>
          <input type="number" value={filamento} onChange={(e) => setFilamento(e.target.value)} step="0.01" />
        </div>

        <div>
          <label>Tipo de filamento:</label>
          <select value={tipoFilamento} onChange={(e) => setTipoFilamento(e.target.value)}>
            <option value="PLA">PLA (50)</option>
            <option value="PLA+">PLA+ (55)</option>
            <option value="PETG">PETG (60)</option>
            <option value="ABS">ABS (70)</option>
            <option value="TPU">TPU (100)</option>
          </select>
        </div>

        <div>
          <label>Cantidad de unidades:</label>
          <input type="number" value={unidades} onChange={(e) => setUnidades(parseInt(e.target.value) || 1)} />
        </div>

        {/* Tiempo impresión */}
        <div>
          <label>Tiempo impresión </label>
          <input type="number" value={horas} onChange={(e) => setHoras(parseInt(e.target.value) || 0)} style={{ width: "3em", textAlign: "center" }} />
          <label>:</label>
          <input type="number" value={minutos} onChange={(e) => setMinutos(parseInt(e.target.value) || 0)} style={{ width: "3em", textAlign: "center" }} />
        </div>

        {/* Tiempo postprocesado */}
        <div>
          <label>Tiempo postprocesado </label>
          <input type="number" value={horasPost} onChange={(e) => setHorasPost(parseInt(e.target.value) || 0)} style={{ width: "3em", textAlign: "center" }} />
          <label>:</label>
          <input type="number" value={minutosPost} onChange={(e) => setMinutosPost(parseInt(e.target.value) || 0)} style={{ width: "3em", textAlign: "center" }} />
        </div>

        {/* Opciones */}
        <div>
          <label>
            <input type="checkbox" checked={incluirAditivos} onChange={(e) => setIncluirAditivos(e.target.checked)} />
            Incluir aditivos
          </label>
        </div>
        <div>
          <label>
            <input type="checkbox" checked={incluirPost} onChange={(e) => setIncluirPost(e.target.checked)} />
            Incluir postprocesado
          </label>
        </div>

        <button type="submit">Calcular</button>
        <button type="button" onClick={limpiarCampos} style={{ marginLeft: "10px" }}>Limpiar</button>
      </form>

      <h2>Resultados</h2>
      <pre className="resultado">{resultado}</pre>
    </div>
  );
}