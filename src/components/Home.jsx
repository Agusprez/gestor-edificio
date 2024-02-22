import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavigationBar from './NavigationBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const Home = () => {
  const [userData, setUserData] = useState(null);
  const [ufData, setUfData] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Estado para indicar si se está cargando

  useEffect(() => {
    // Obtener datos del usuario desde el servidor
    const fetchUserData = async () => {
      try {
        // Realizar la solicitud al servidor para obtener los datos del usuario
        const response = await axios.post('http://localhost:4500/login/obtenerUsuario', { userId: sessionStorage.getItem('userId') });
        // Establecer los datos del usuario en el estado local
        setUserData(response.data);
        const ufAsociada = response.data.ufAsociada

        const segundoEndpointResponse = await axios.get(`http://localhost:4500/UF/obtenerTodo/${ufAsociada}`);
        console.log(segundoEndpointResponse.data)
        setUfData(segundoEndpointResponse.data)

        setIsLoading(false); // Cambia el estado de isLoading a false una vez que se han cargado los datos
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
        setIsLoading(false); // En caso de error, asegúrate de cambiar el estado de isLoading a false
      }
    };

    // Llamar a la función fetchUserData cuando el componente se monte
    fetchUserData();
  }, []); // El array vacío como segundo argumento asegura que esta función se ejecute solo una vez al montar el componente

  return (
    <div>
      <NavigationBar></NavigationBar>
      <div className="container-fluid">
        <div className="row justify-content-center mt-3 ">
          <div className="col-md-8 ">
            <div className="card">
              <div className="card-body">
                {isLoading ? ( // Mostrar el icono de carga si isLoading es true
                  <div className="text-center">
                    <FontAwesomeIcon icon={faSpinner} spin size="3x" />
                  </div>
                ) : (
                  <>
                    <h2 className="card-title text-center">Bienvenido, {userData && userData.nombreCompleto}</h2>
                    {userData && (
                      <>
                        <p className="card-text">Correo electrónico: {userData.email}</p>
                        <p className="card-text">Unidad Funcional Asociada: {userData.ufAsociada}</p>
                        <p className="card-text">Propietario: {ufData.propietario}</p>
                        {/* Agrega aquí cualquier otra información del usuario que desees mostrar */}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
