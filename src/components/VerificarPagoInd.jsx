import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faHouseUser, faCalendarCheck } from "@fortawesome/free-solid-svg-icons";

function formatNumber(number) {
  return number.toLocaleString('es-ES', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

const VerificarPagoInd = ({ datosDelPago, datosDeUF, onClose }) => {
  const blanckSpace = "  "
  const propietario = datosDeUF.propietario
  const nombreUF = datosDeUF.uf
  const urlInicio = "https://firebasestorage.googleapis.com/v0/b/gestion-de-consorcio.appspot.com/o/"
  const cuota = datosDelPago.cuotaNro || datosDelPago.cuotaMes
  const valor = datosDelPago.valor
  const valorActualizado = datosDelPago?.valorActualizado
  const valorIntereses = datosDelPago?.valorIntereses
  const diasIntereses = datosDelPago?.diasIntereses
  const imgPago = datosDelPago?.comprobantePago
  const url = urlInicio + imgPago

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Contenido del modal */}
        <h2 className="text-center text-decoration-underline">Verificación de Expensa</h2>
        <p></p>
        <ul>
          <li>
            <FontAwesomeIcon icon={faHouseUser} />
            <strong>{blanckSpace}{propietario} - {nombreUF}
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
          )}
          {imgPago && (
            <>
              <a href={url} download>

                <FontAwesomeIcon icon={faDownload} /> Comprobante de transferencia
              </a>
            </>
          )

          }
        </ul>
        {/* Botón para cerrar el modal */}
        <div className="text-center">
          <button className="btn btn-primary m-3" onClick={onClose}>Verificar</button>
          <button className="btn btn-secondary m-3" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
};

export default VerificarPagoInd;