
import React from 'react';
import { Link } from 'react-router-dom';

const NavigationBar = () => {
  const handleLogout = () => {
    // Limpiar el almacenamiento local y redirigir a la página de inicio de sesión
    sessionStorage.removeItem('userId');
    window.location.href = '/login'; // Redireccionar a la página de inicio de sesión
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light   ">
      <div className="container">
        <Link className="navbar-brand" to="/">Edificio Rosa I</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/home">Inicio</Link>
            </li>
            {/* Otros elementos de la barra de navegación */}
          </ul>
          <button className="btn btn-outline-danger" onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
