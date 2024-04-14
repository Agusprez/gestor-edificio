import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faHouseUser, faCalendarCheck, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { obtenerNombreDepto } from './RelacionUserUF'
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { Button } from "react-bootstrap";


function formatNumber(number) {
  return number.toLocaleString('es-ES', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

const VerificarPagoInd = ({ datosDelPago, datosDeUF, onClose }) => {
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false)
  const [mensaje, setMensaje] = useState(""); // Estado para almacenar el mensaje del servidor
  const [url, setUrl] = useState("");


  const blanckSpace = "  "
  const propietario = datosDeUF.propietario
  const nombreUF = datosDeUF.uf
  const nombreUFletras = obtenerNombreDepto(nombreUF)
  //const urlInicio = "https://firebasestorage.googleapis.com/v0/b/gestion-de-consorcio.appspot.com/o/"
  const cuota = datosDelPago.cuotaNro || datosDelPago.cuotaMes
  const valor = datosDelPago.valor
  const valorActualizado = datosDelPago?.valorActualizado
  const valorIntereses = datosDelPago?.valorIntereses
  const diasIntereses = datosDelPago?.diasIntereses
  const imgPago = datosDelPago?.comprobantePago
  const idPago = datosDelPago.idExpensa
  //const url = urlInicio + imgPago

  useEffect(() => {
    // Construir la URL de la imagen cuando se monta el componente
    if (imgPago) {
      const url = `https://firebasestorage.googleapis.com/v0/b/gestion-de-consorcio.appspot.com/o/${encodeURIComponent(imgPago)}?alt=media`;
      setUrl(url);
    }
  }, [imgPago]);

  const navigate = useNavigate(); // Obtiene el objeto Navigate

  const handleVerificarPago = async () => {
    setIsLoadingSubmit(true)
    try {

      // Construir la URL completa para la solicitud PATCH
      const url = `http://localhost:4500/UF/verificarPago/${nombreUF}/${idPago}`;

      const response = await axios.patch(url);

      if (response.status === 200) {
        //console.log('La solicitud PATCH fue exitosa');
        //onClose()
        if (response.data && response.data.message) {
          setMensaje(response.data.message);
        }
        setTimeout(() => {
          navigate('/home');
        }, 6000)

      } else {
        console.error('La solicitud PATCH no fue exitosa');
      }
    } catch (error) {
      console.error('Error al enviar la solicitud PATCH:', error);
    }
  };


  //console.log(idPago)
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Contenido del modal */}

        <h2 className="text-center text-decoration-underline">Verificación de Expensa</h2>
        {mensaje && (
          <div className="alert alert-success">
            <p>{mensaje}</p>
            <FontAwesomeIcon icon={faSpinner} spin />
          </div>
        )}
        <p></p>
        <ul>
          <li>
            <FontAwesomeIcon icon={faHouseUser} />
            <strong>{blanckSpace}{propietario} - {nombreUFletras}
            </strong>
          </li>
          <li>
            <FontAwesomeIcon icon={faCalendarCheck} />
            {blanckSpace}Periodo: {typeof (cuota) === "number" ? `${cuota}° Extraordinaria` : cuota}
          </li>
          <br />
          <li>
            Valor: ${formatNumber(valor)}
          </li>

          {valorActualizado && (
            <>
              <li>
                Intereses: ${formatNumber(valorIntereses)}
              </li>
              <li>
                Valor con Intereses: ${formatNumber(valorActualizado)}
              </li>
              <li>
                Dias de mora: {diasIntereses}
              </li>
            </>
          )}{imgPago && (
            <>
              <p></p>
              <Button
                variant={imgPago === "Sin comprobante asociado" ? "danger" : "success"}
                href={url}
                target="_blank"
                disabled={imgPago === "Sin comprobante asociado"}
                rel="noopener noreferrer"
              >
                {imgPago !== "Sin comprobante asociado" && <FontAwesomeIcon icon={faDownload} className="ml-1" />}
                {imgPago === "Sin comprobante asociado" ? "Sin comprobante" : "Ver comprobante de transferencia"}
              </Button>
            </>
          )}

        </ul>
        {/* Botón para cerrar el modal */}
        <div className="text-center">
          {isLoadingSubmit ? (
            // Si isLoadingSubmit es true, mostrar el spinner
            <button type="submit" className="btn btn-primary" disabled>
              <FontAwesomeIcon icon={faSpinner} spin /> Verificando...
            </button>
          ) : (
            // Si isLoadingSubmit es false, mostrar el botón "Enviar"
            <button className="btn btn-primary" onClick={handleVerificarPago}>
              Verificar
            </button>
          )}



          <button className="btn btn-secondary m-3" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
};

export default VerificarPagoInd;