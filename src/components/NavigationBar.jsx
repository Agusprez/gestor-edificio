import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const NavigationBar = () => {
  const [isHovered, setIsHovered] = useState(false);
  const ufAsoc = sessionStorage.getItem('ufAsoc');

  const handleLogout = () => {
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('ufAsoc');
    window.location.href = '/login';
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light">
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
            <li className="nav-item"
              onMouseLeave={handleMouseLeave}
              onMouseEnter={handleMouseEnter}
            ><Link
              className={`nav-link ${!ufAsoc ? 'disabled' : ''}`}
              to={!ufAsoc ? '#' : "/mis-pagos"}
            >
                Mis pagos
                {!ufAsoc && isHovered && <div className="warning position-absolute top-0 start-50 translate-middle-x z-index-1   p-3 fs-5">Usuario no habilitado</div>}
              </Link>
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
