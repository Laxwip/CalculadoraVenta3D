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
    
    function redondearPersonalizado(valor) {
      return Math.round(valor * 2) / 2; // múltiplo de 0.5 más cercano
    }

    const ventaBaseOriginal = res.multi2; // valor calculado normal
    const ventaBaseRedondeado = redondearPersonalizado(ventaBaseOriginal);

    // Fórmula: ((valorRedondeado - envio) / 2) * factor + envio
    const envio = 1.25;
    const venta6  = ((ventaBaseRedondeado - envio) / 2) * 1.85 + envio;
    const venta12 = ((ventaBaseRedondeado - envio) / 2) * 1.7  + envio;
    const venta24 = ((ventaBaseRedondeado - envio) / 2) * 1.55 + envio;


    setResultado(
      <>
        <div className="linea color1">
          <span className="label">Filamento ({tipoFilamento}):</span>
          <span className="valor">{res.costoFilamento.toFixed(2)}</span>
        </div>
        <div className="linea color1">
          <span className="label">Electricidad:</span>
          <span className="valor">{res.costoElectricidad.toFixed(2)}</span>
        </div>
        <div className="linea color1">
          <span className="label">Amortización:</span>
          <span className="valor">{res.costoAmortizacion.toFixed(2)}</span>
        </div>
        <hr />
        <div className="linea color1">
          <span className="label">Subtotal Base:</span>
          <span className="valor">{res.subtotal.toFixed(2)}</span>
        </div>
        <div className="linea color2">
          <span className="label">Margen de error (*1.1111):</span>
          <span className="valor">{res.baseMultiplicada.toFixed(2)}</span>
        </div>
        <div className="linea color2">
          <span className="label">Aditivos:</span>
          <span className="valor">{res.costoAditivos.toFixed(2)}</span>
        </div>
        <div className="linea color2">
          <span className="label">Postprocesado:</span>
          <span className="valor">{res.costoPost.toFixed(2)}</span>
        </div>
        <hr />
        <div className="linea color2 bold">
          <span className="label">Gasto total:</span>
          <span className="valor">{res.totalSinEnvio.toFixed(2)}</span>
        </div>
        <div className="linea">
          <span className="label">Costo Envío:</span>
          <span className="valor">{res.costoEnvio.toFixed(2)}</span>
        </div>
        <div className="linea">
          <span className="label totalFinal">Total Final:</span>
          <span className="valor totalFinal">{res.totalFinal.toFixed(2)}</span>
        </div>
        <hr />
        <div className="linea">
          <span className="label">Venta UND (x2):</span>
          <span className="valor">{res.multi2.toFixed(2)}</span>
          <span className="valorNuevo">{ventaBaseRedondeado}</span>
        </div>

        <div className="linea">
          <span className="label">Venta 6UND (x1.85):</span>
          <span className="valor">{res.multi185.toFixed(2)}</span>
          <span className="valorNuevo">{venta6.toFixed(2)}</span>
        </div>

        <div className="linea">
          <span className="label">Venta 12UND (x1.7):</span>
          <span className="valor">{res.multi17.toFixed(2)}</span>
          <span className="valorNuevo">{venta12.toFixed(2)}</span>
        </div>

        <div className="linea">
          <span className="label">Venta +24UND (x1.55):</span>
          <span className="valor">{res.multi155.toFixed(2)}</span>
          <span className="valorNuevo">{venta24.toFixed(2)}</span>
        </div>

      </>
    );




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