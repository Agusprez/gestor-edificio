import React from 'react';
import './assets/css/App.css';
import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import UnidadesFuncionales from './components/UnidadesFuncionales';
import Register from './components/Register';
import Home from './components/Home';
import ResetPassword from './components/ResetPassword';
import MisPagos from './components/MisPagos';
import UltimosPagos from './components/UltimosPagos';
import MisDeudas from './components/MisDeudas';
import NuevoPago from './components/NuevoPago';
//import CrearUsuario from './components/CrearUsuario';

function App() {
  const userId = sessionStorage.getItem('userId');

  return (
    <React.Fragment>
      <Router>
        <Routes>
          {/* Permitir el acceso a la página de inicio de sesión y a la creación de usuario sin restricciones */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/home" element={<Home />} />
          <Route path="/mis-pagos" element={<MisPagos />} />
          <Route path="/ultimos-pagos" element={<UltimosPagos />} />
          <Route path="/deuda" element={<MisDeudas />} />
          <Route path="/nuevo-pago" element={<NuevoPago />} />



          {/* Restringir el acceso a la página de unidades funcionales solo a usuarios autenticados */}
          {userId ? (
            <Route path="/uf" element={<UnidadesFuncionales />} />
          ) : (
            <Route path="/uf" element={<Navigate to="/login" />} />
          )}

          {/* Redireccionar a la página de inicio de sesión si la ruta no coincide */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </React.Fragment>
  );
}

export default App;

