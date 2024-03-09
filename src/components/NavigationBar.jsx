import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const NavigationBar = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const ufAsoc = sessionStorage.getItem('ufAsoc');

  const handleLogout = () => {
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('ufAsoc');
    window.location.href = '/login';
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
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
        <Link className="navbar-brand" to="#">Edificio Rosa I</Link>
        <button className="navbar-toggler" disabled type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/home">Inicio</Link>
            </li>
            <li onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave} className={`nav-item dropdown ${isDropdownOpen ? 'show' : ''}`}>
              <Link
                className={`nav-link dropdown-toggle ${!ufAsoc ? 'disabled' : ''}`}
                to='#'
                id="navbarDropdown"
                role="button"
                onClick={handleDropdownToggle}

              >
                Mis pagos
                {!ufAsoc && isHovered && <div className="warning    p-3 fs-5">Usuario no habilitado</div>}
              </Link>
              <ul className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`} aria-labelledby="navbarDropdown">
                <li><Link className="dropdown-item" to="/mis-pagos">Pagos registrados</Link></li>
                <li><Link className="dropdown-item" to="/ultimos-pagos">Ver últimos pagos</Link></li>
                <li><Link className="dropdown-item" to="/deuda">Ver deuda</Link></li>
                <li><Link className="dropdown-item" to="/resolver-problemas">Resolver problemas de pago</Link></li>
                {/* Agrega aquí otras opciones según sea necesario */}
              </ul>
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
