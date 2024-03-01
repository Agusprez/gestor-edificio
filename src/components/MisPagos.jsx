import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import NavigationBar from './NavigationBar';


const MisPagos = () => {
  const [pagos, setPagos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const userId = sessionStorage.getItem('userId');
  const ufAsoc = sessionStorage.getItem('ufAsoc');

  useEffect(() => {
    const fetchPagos = async () => {
      try {
        const response = await axios.post(`http://localhost:4500/uf/pagosSegunPropietario/${ufAsoc}`, { usuarioId: userId });
        // Procesar la respuesta del servidor para obtener los pagos
        let pagosData = [];
        response.data.expensas.forEach(expensa => {
          pagosData = pagosData.concat(expensa.periodosPagados.map(periodo => {
            const fecha = periodo.cuotaNro ? `Cuota Nro ${periodo.cuotaNro}°` : periodo.cuotaMes;
            try {
              const fechaPago = convertirTimestampAFechaLegible(periodo.fechaDePago)
              console.log(fechaPago)
              return { fecha, monto: periodo.valor, fechaPago };
            } catch (err) {
              console.log(err.message)
            }

            return { fecha, monto: periodo.valor, fechaPago: "Sin datos." };
          }));
        });
        // Establecer los pagos en el estado local
        setPagos(pagosData);
        setIsLoading(false); // Cambiar isLoading a false una vez que se han cargado los datos
      } catch (error) {
        console.error('Error al obtener los pagos:', error);
        setIsLoading(false); // En caso de error, asegúrate de cambiar isLoading a false
      }
    };

    // Llamar a la función fetchPagos cuando el componente se monte
    fetchPagos();
  }, [userId, ufAsoc]);

  const convertirTimestampAFechaLegible = timestamp => {
    let fecha = new Date(timestamp._seconds * 1000); // Convertir segundos a milisegundos
    fecha = fecha.toLocaleDateString()
    return fecha; // Formatear la fecha como una cadena legible
  };

  return (
    <div>
      <NavigationBar />
      <div className="container-fluid">
        <div className="row justify-content-center mt-3">
          <div className="col-md-8">
            <div className="card">
              <div className="card-body">
                <h2>Mis Pagos</h2>
                <br />
                {isLoading ? (
                  <div className="d-flex align-items-center">
                    <p>Cargando pagos...                      <FontAwesomeIcon icon={faSpinner} spin className="ml-2" /></p>
                  </div>
                ) : (
                  <React.Fragment>
                    {pagos.length === 0 ? (
                      <p>No hay pagos disponibles.</p>
                    ) : (
                      <div className="row">
                        {pagos.map((pago, index) => (
                          <div key={index} className="col-md-4 mb-3">
                            <div className="card">
                              <div className="card-body">
                                <h5 className="card-title">Pago {pago.fecha}</h5>
                                <br />
                                <p className="card-text"><strong>Fecha: </strong>{pago.fechaPago} </p>
                                <p className="card-text"><strong>Monto: </strong>${pago.monto}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </React.Fragment>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MisPagos;