import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';

const NavigationBar = () => {
  const [usuarioAdmin, setUsuarioAdmin] = useState(null);
  const ufAsoc = sessionStorage.getItem('ufAsoc');
  const adm = sessionStorage.getItem('adm');
  const navigate = useNavigate();

  useEffect(() => {
    if (adm === "true") {
      setUsuarioAdmin(true);
    } else {
      setUsuarioAdmin(false);
    }
  }, [adm]);

  const handleLogout = () => {
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('ufAsoc');
    sessionStorage.removeItem('adm');
    navigate('/login');
  };

  return (
    <Navbar collapseOnSelect className='px-5' expand="md" variant="light" style={{ backgroundColor: '#f5f5dc' }}>
      <Navbar.Brand as={Link} to="/">Edificio Rosa I</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/home">Inicio</Nav.Link>
          {usuarioAdmin && (
            <>
              <NavDropdown title="Usuarios" id="basic-nav-dropdown">
                <NavDropdown.Item as={Link} to="/relacion-USER-UF">Habilitar relacion</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/verificar-pagos">Verificar pagos</NavDropdown.Item>
                {/* Agrega aquí otras opciones según sea necesario */}
              </NavDropdown>
              <NavDropdown title="Expensas" id="basic-nav-dropdown">
                <NavDropdown.Item as={Link} to="/alta-expensa-multiple">Carga de expensas multiple</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/alta-expensa">Alta de expensas individual</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/baja-modif-expensa">Modificacion o baja de expensas individual</NavDropdown.Item>
                {/* Agrega aquí otras opciones según sea necesario */}
              </NavDropdown>
            </>
          )}
          {!usuarioAdmin && (
            <NavDropdown title="Mis pagos" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/mis-pagos">Pagos registrados</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/ultimos-pagos">Ver últimos pagos</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/deuda">Ver deuda</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/resolver-problemas">Resolver problemas de pago</NavDropdown.Item>
              {/* Agrega aquí otras opciones según sea necesario */}
            </NavDropdown>
          )}
        </Nav>
        <Nav>
          <button className="btn btn-outline-danger" onClick={handleLogout}>Cerrar sesión</button>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavigationBar;
