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
import RelacionUserUF from './components/RelacionUserUF';
import VerificarPagos from './components/VerificarPagos';
import AltaIndividual from './components/ABM_Expensas/AltaIndividual';
import BajaModificacion from './components/ABM_Expensas/BMIndividual';
import AltaMultiple from './components/ABM_Expensas/AltaMultiple';
import ResolverPago from './components/ResolverPago';
import MostrarExpensasPagas from './components/MostrarExpensasPagas';
import MostrarExpensasImpagas from './components/MostrarExpensasImpagas';
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
          <Route path="/relacion-USER-UF" element={<RelacionUserUF />} />
          <Route path="/verificar-pagos" element={<VerificarPagos />} />
          <Route path="/resolver-pagos" element={<ResolverPago />} />
          <Route path="/baja-modif-expensa" element={<BajaModificacion />} />
          <Route path="/alta-expensa" element={<AltaIndividual />} />
          <Route path="/alta-expensa-multiple" element={<AltaMultiple />} />
          <Route path="/pagos" element={<MostrarExpensasPagas />} />
          <Route path="/impagos" element={<MostrarExpensasImpagas />} />



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

