import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Obtener datos del usuario desde el servidor
    const fetchUserData = async () => {
      try {
        // Realizar la solicitud al servidor para obtener los datos del usuario
        const response = await axios.post('http://localhost:4500/login/obtenerUsuario', { userId: sessionStorage.getItem('userId') });
        // Establecer los datos del usuario en el estado local
        setUserData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
      }
    };

    // Llamar a la función fetchUserData cuando el componente se monte
    fetchUserData();
  }, []); // El array vacío como segundo argumento asegura que esta función se ejecute solo una vez al montar el componente

  return (
    <div className="container-fluid">
      <div className="row justify-content-center mt-5">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center">Bienvenido, {userData && userData.nombreCompleto}</h2>
              {userData && (
                <>
                  <p className="card-text">Correo electrónico: {userData.email}</p>
                  <p className="card-text">Unidad Funcional Asociada: {userData.ufAsociada}</p>
                  {/* Agrega aquí cualquier otra información del usuario que desees mostrar */}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
