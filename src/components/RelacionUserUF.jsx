import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import NavigationBar from './NavigationBar';
import ToggleSwitch from './ToggleSwitch';

const RelacionUserUF = () => {
  const [datos, setDatos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:4500/Usuarios/`);
        // Procesar la respuesta del servidor para obtener los datos
        // Aquí debes adaptar el procesamiento de los datos según la estructura de la respuesta que esperas recibir
        // Por ahora, solo establecemos los datos en el estado local y cambiamos isLoading a false
        setDatos(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);


  const obtenerNombreDepto = (uf) => {
    if (typeof (uf) === "number") {
      uf = uf.toString()
    }
    const descripcionesPlanta = {
      "0": "Planta Baja",
      "1": "1er Piso",
      "2": "2do Piso",
      "3": "3er Piso",
      "4": "4to Piso",
      "5": "Cochera"
    };

    const planta = uf.charAt(0);
    const dpto = uf.charAt(2);

    const nombrePlanta = descripcionesPlanta[planta] || "Planta Desconocida";
    const nombreDpto = ` - Dpto ${dpto}°`
    let nombreCompletoDPTO = nombrePlanta + nombreDpto

    if (uf === "501" || uf === "501" || uf === "502") {
      nombreCompletoDPTO = "Cochera"
    } else if (uf === "504") {
      nombreCompletoDPTO = "Local"
    }

    return nombreCompletoDPTO
  };


  const handleToggleUpdate = async (idUsuario, newState) => {
    console.log(idUsuario)
    //console.log(newState)
    try {
      // Enviar solicitud al endpoint con el nuevo estado
      await axios.patch(`http://localhost:4500/Usuarios/relacion-USER-UF`, { idUsuario, estadoNuevo: newState });

      // Actualizar el estado local después de recibir una respuesta exitosa del servidor
      setDatos(prevDatos => {
        return prevDatos.map(dato => {
          if (dato.id === idUsuario) {
            return { ...dato, ufAsociadaHabilitada: newState };
          }
          return dato;
        });
      });
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
    }
  };
  return (
    <div>
      <NavigationBar />
      <div className="container-fluid">
        <div className="row justify-content-center mt-3">
          <div className="col-md-8">
            <div className="card">
              <div className="card-body">
                <h2 className='text-decoration-underline text-center'>Habilitación de relación</h2>
                <p>Con este servicio, podrás activar y desactivar la autorización de los usuarios para acceder a los datos de las Unidades Funcionales.</p>
                <br />
                {isLoading ? (
                  <div className="d-flex align-items-center">
                    <p>Cargando datos... <FontAwesomeIcon icon={faSpinner} spin className="ml-2" /></p>
                  </div>
                ) : (
                  <div className="row">
                    <div className="col-md-6">
                      <h4 className="text-decoration-underline text-center">Usuarios Habilitados</h4>
                      <div className='m-4'></div>
                      {datos.map((dato, index) => {
                        const UF = dato?.ufAsociada || "";
                        if (!dato.permisosDeAdministrador && dato.ufAsociadaHabilitada) {
                          return (
                            <div key={index} className="card mb-3">
                              <div className="card-body">
                                <h5 className="card-title">{dato.nombreCompleto}</h5>
                                <p className="card-text">{obtenerNombreDepto(UF)}</p>
                                <p className="card-text">{dato.email}</p>

                                <ToggleSwitch
                                  key={dato.id} // Asegúrate de tener una propiedad de identificación única en cada objeto
                                  idUsuario={dato.id} // Pasar el id como prop al ToggleSwitch
                                  ufAsociadahabilitada={dato.ufAsociadaHabilitada}
                                  onUpdate={(newState) => handleToggleUpdate(dato.id, false)} // Usar el id en la función onUpdate
                                />
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                    <div className="col-md-6">
                      <h4 className="text-decoration-underline text-center" >Usuarios No habilitados</h4>
                      <div className='m-4'></div>
                      {datos.map((dato, index) => {
                        const UF = dato?.ufAsociada || "";
                        if (!dato.permisosDeAdministrador && !dato.ufAsociadaHabilitada) {
                          return (
                            <div key={index} className="card mb-3">
                              <div className="card-body">
                                <h5 className="card-title">{dato.nombreCompleto}</h5>
                                <p className="card-text">{obtenerNombreDepto(UF)}</p>
                                <p className="card-text">{dato.email}</p>
                                <ToggleSwitch
                                  ufAsociadahabilitada={dato.ufAsociadaHabilitada}
                                  idUsuario={dato.id}
                                  onUpdate={(newState) => handleToggleUpdate(dato.id, true)} // Usar el id en la función onUpdate
                                />
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelacionUserUF;