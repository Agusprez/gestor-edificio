import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavigationBar from './NavigationBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const Home = () => {
  const [userData, setUserData] = useState(null);
  const [ufData, setUfData] = useState(null);
  const [ufAsociadaHabilitada, setUfAsociadaHabilitada] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [nombreCompletoDepartamento, setNombreCompletoDepartamento] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('http://localhost:4500/login/obtenerUsuario', { userId: sessionStorage.getItem('userId') });
        setUserData(response.data);

        const ufAsociada = response.data.ufAsociada;
        const userHabilitado = response.data.ufAsociadaHabilitada;
        if (userHabilitado) {
          sessionStorage.setItem('ufAsoc', response.data.ufAsociada);
        }

        setUfAsociadaHabilitada(userHabilitado);
        obtenerNombreDepto(ufAsociada)

        const segundoEndpointResponse = await axios.get(`http://localhost:4500/UF/obtenerTodo/${ufAsociada}`);
        setUfData(segundoEndpointResponse.data);

        setIsLoading(false);
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Función para renderizar los datos
  const renderData = () => {
    if (isLoading) {
      return (
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} spin size="3x" />
        </div>
      );
    } else if (userData) {
      return (
        <>
          <h2 className="card-title text-center">Bienvenido, {userData.nombreCompleto}</h2>
          <h4 className="card-title text-right text-decoration-underline">Mis datos:</h4>
          <br />
          <p className="card-text">Unidad Funcional Asociada: {nombreCompletoDepartamento}</p>
          {ufData && (
            <p className="card-text">Propietario: {ufData.propietario}</p>
          )}
          {typeof ufAsociadaHabilitada !== 'undefined' && (
            <p className="card-text">Habilitado: {ufAsociadaHabilitada ? 'Sí' : 'No'}</p>
          )}
          {/* Agrega aquí cualquier otra información del usuario que desees mostrar */}
        </>
      );
    } else {
      return <p>No se encontraron datos de usuario.</p>;
    }
  };

  const obtenerNombreDepto = (uf) => {
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
    setNombreCompletoDepartamento(nombreCompletoDPTO)

    return
  };
  return (
    <div>
      <NavigationBar />
      <div className="container-fluid">
        <div className="row justify-content-center mt-3">
          <div className="col-md-8">
            <div className="card">
              <div className="card-body">
                {renderData()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

