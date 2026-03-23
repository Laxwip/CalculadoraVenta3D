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
  const [aditivos, setAditivos] = useState([]); 
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
      setAditivos(saved.aditivos ?? []);
    }
  }, []);

  const handleCalcular = (e) => {
    e.preventDefault();
    const datos = {
      filamento: parseFloat(filamento) || 0,
      unidades,
      tipoFilamento,
      horas,
      minutos,
      horasPost,
      minutosPost,
      aditivos
    };
    localStorage.setItem("datosCosto", JSON.stringify(datos));
    const res = calcularCosto(datos);

    const aditivosTexto = aditivos.length > 0 ? aditivos.join(" + ") : "Ninguno";

    setResultado(`
      Filamento (${tipoFilamento}): ${res.costoFilamento.toFixed(2)}
      Electricidad:    ${res.costoElectricidad.toFixed(2)}
      Amortización:    ${res.costoAmortizacion.toFixed(2)}
      Aditivos (${aditivosTexto}): ${res.costoAditivos.toFixed(2)}
      Postprocesado:   ${res.costoPost.toFixed(2)}
      -------------------------
      Costo Und:       ${res.subtotal.toFixed(2)}
      Total (x1.1111): ${res.total.toFixed(2)}
      -------------------------
      Venta UND (x2):       ${res.multi2.toFixed(2)}
      Venta 6UND (x1.85):   ${res.multi185.toFixed(2)}
      Venta 12UND (x1.7):   ${res.multi17.toFixed(2)}
      Venta +24UND (x1.55): ${res.multi155.toFixed(2)}
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
    setAditivos([]);
    setResultado("");
    localStorage.clear();
  };

  const handleAddAditivo = (e) => {
    const val = e.target.value;
    if (val && !aditivos.includes(val)) {
      setAditivos([...aditivos, val]);
    }
    e.target.value = ""; 
  };

  const removeAditivo = (item) => {
    setAditivos(aditivos.filter(a => a !== item));
  };

  return (
    <div className="homepage">
      <h1>Costo Final</h1>
      <form onSubmit={handleCalcular}>
        {/* Filamento */}
        <div className='OrientacionHorizontal'>
          <img src="https://res.cloudinary.com/dpk2wmbsb/image/upload/v1773942238/Zdimension/peso_wm2ncm.png" alt="" className='icon'/>
          <input type="number" value={filamento} onChange={(e) => setFilamento(e.target.value)} step="0.01" />
          <div>
            <select value={tipoFilamento} onChange={(e) => setTipoFilamento(e.target.value)}>
              <option value="PLA">PLA (50)</option>
              <option value="PLA+">PLA+ (55)</option>
              <option value="PETG">PETG (60)</option>
              <option value="ABS">ABS (70)</option>
              <option value="TPU">TPU (100)</option>
            </select>
          </div>
        </div>

        <div className='OrientacionHorizontal'>
          <img src="https://res.cloudinary.com/dpk2wmbsb/image/upload/v1773943161/Zdimension/paquete_hvpvkj.png" alt="" className='icon' />
          <input type="number" value={unidades} onChange={(e) => setUnidades(e.target.value === "" ? "" : parseInt(e.target.value))} />
        </div>

        {/* Tiempo impresión */}
        <div className='OrientacionHorizontal'>
          <img src="https://res.cloudinary.com/dpk2wmbsb/image/upload/v1773944855/Zdimension/tiempo-restante_bj8s1s.png" alt="" className='icon'/>
          <label>Impresión______</label>
          <input type="number" value={horas} onChange={(e) => setHoras(e.target.value === "" ? "" : parseInt(e.target.value))} style={{ width: "3em", textAlign: "center" }} />
          <label>:</label>
          <input type="number" value={minutos} onChange={(e) => setMinutos(e.target.value === "" ? "" : parseInt(e.target.value))} style={{ width: "3em", textAlign: "center" }} />
        </div>

        {/* Tiempo postprocesado */}
        <div className='OrientacionHorizontal'>
          <img src="https://res.cloudinary.com/dpk2wmbsb/image/upload/v1773944855/Zdimension/tiempo-restante_bj8s1s.png" alt="" className='icon'/>
          <label>Postprocesado </label>
          <input type="number" value={horasPost} onChange={(e) => setHorasPost(e.target.value === "" ? "" : parseInt(e.target.value))} style={{ width: "3em", textAlign: "center" }} />
          <label>:</label>
          <input type="number" value={minutosPost} onChange={(e) => setMinutosPost(e.target.value === "" ? "" : parseInt(e.target.value))} style={{ width: "3em", textAlign: "center" }} />
        </div>

        {/* Selector desplegable de aditivos */}
        <div>
          <label>Aditivos:</label>
          <select onChange={handleAddAditivo} defaultValue="">
            <option value="" disabled>Selecciona un aditivo</option>
            <option value="Argolla">Argolla (0.17)</option>
            <option value="Ziplock">Ziplock (0.23)</option>
            <option value="Sticker">Sticker (0.10)</option>
            <option value="Switch">Switch (0.23)</option>
          </select>
        </div>

        {/* Caja fija para chips de aditivos */}
        <div className="chips-box">
          {aditivos.length === 0 && <span className="placeholder">No hay aditivos seleccionados</span>}
          {aditivos.map((item) => (
            <span key={item} className="chip">
              {item} <button type="button" onClick={() => removeAditivo(item)}>x</button>
            </span>
          ))}
        </div>

        <button type="submit">Calcular</button>
        <button type="button" onClick={limpiarCampos} style={{ marginLeft: "10px" }}>Limpiar</button>
      </form>

      <h2>Resultados</h2>
      <pre className="resultado">{resultado}</pre>
    </div>
  );
}