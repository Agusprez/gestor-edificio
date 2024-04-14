import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import NavigationBar from './NavigationBar';

const Impagos = () => {
  const [pagos, setPagos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda

  const convertirTimestampAFechaLegible = timestamp => {
    let fecha = new Date(timestamp._seconds * 1000); // Convertir segundos a milisegundos
    fecha = fecha.toLocaleDateString();
    return fecha; // Formatear la fecha como una cadena legible
  };

  useEffect(() => {
    const fetchPagos = async () => {
      try {
        const response = await axios.get(`http://localhost:4500/uf/impagos`);
        // Procesar la respuesta del servidor para obtener los pagos
        let pagosData = [];

        // Iterar sobre cada objeto UF en la respuesta
        response.data.forEach(uf => {
          // Iterar sobre cada expensa de la UF
          uf.expensas.forEach(expensa => {
            // Iterar sobre cada periodo pagado de la expensa
            expensa.periodosPagados.forEach(periodo => {
              // Construir el objeto de pago
              const propietario = uf.propietario;
              let fechaDeVto = periodo.fechaDeVencimiento
              fechaDeVto = convertirTimestampAFechaLegible(fechaDeVto)
              const fecha = periodo.cuotaNro ? `Cuota Nro ${periodo.cuotaNro}°` : periodo.cuotaMes;
              const monto = periodo.valorActualizado || periodo.valor;
              const tipo = periodo.cuotaNro ? "Exp. Extraordinarias" : "Exp. Mensuales";
              pagosData.push({ fecha, monto, propietario, tipo, fechaDeVto });
            });
          });
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
  }, []);

  // Función para manejar el cambio en el término de búsqueda
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filtrar los pagos según el término de búsqueda
  // Filtrar los pagos según el término de búsqueda
  const filteredPagos = pagos.filter((pago) =>
    Object.values(pago).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div>
      <NavigationBar />
      <div className="container-fluid">
        <div className="row justify-content-center mt-3">
          <div className="col-md-8">
            <div className="card">
              <div className="card-body">
                <h2>Expensas con deuda</h2>
                <p>Este servicio te brinda la información sobre todos los periodos que no están pagados.</p>
                <br />
                {isLoading ? (
                  <div className="d-flex align-items-center">
                    <p>Cargando expensas impagas... <FontAwesomeIcon icon={faSpinner} spin className="ml-2" /></p>
                  </div>
                ) : (
                  <React.Fragment>
                    {/* Agregar el buscador */}
                    <input
                      type="text"
                      className="form-control mb-3"
                      placeholder="Buscar..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />

                    {filteredPagos.length === 0 ? (
                      <p className="warning p-3 fs-5"> No hay deuda disponibles.</p>
                    ) : (
                      <div className="row">
                        {filteredPagos.map((pago, index) => (
                          <div key={index} className="col-md-4 mb-3">
                            <div className="card">
                              <div className="card-body">
                                <h5 className="card-title text-center text-decoration-underline">{pago.propietario}</h5>
                                <p className="card-text"><strong>Expensa: </strong>{pago.fecha}</p>
                                <p className="card-text"><strong>Monto: </strong>${pago.monto}</p>
                                <p className="card-text"><strong>Tipo de expensa: </strong>{pago.tipo}</p>
                                <p className="card-text"><strong>Fecha de Vto: </strong>{pago.fechaDeVto}</p>
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

export default Impagos;
