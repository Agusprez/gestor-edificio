import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom'; // Importa useHistory

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate(); // Obtiene el objeto Navigate

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:4500/login', { email, password });
      const id = response.data.userId;
      setUserId(id);
      setError(null); // Limpia cualquier mensaje de error previo

      // Guardar el ID de usuario en sessionStorage
      sessionStorage.setItem('userId', id);
      setLoggedIn(true);
      navigate('/home');
    } catch (error) {
      console.error('Error al iniciar sesión:', error.message);
      setError('Error al iniciar sesión. Por favor, verifica tus credenciales.');
    }
  };

  return (
    <div className="container-fluid">
      <div className="row justify-content-center mt-5">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center">Consorcio Edificio Rosa I</h2>
              {error && <div className="alert alert-danger">{error}</div>} {/* Muestra el mensaje de error si existe */}
              <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                <div className="mb-3">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={handleEmailChange}
                  />
                </div>
                <div className="mb-3">
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"} // Cambia el tipo de entrada según el estado de showPassword
                      className="form-control"
                      placeholder="Contraseña"
                      value={password}
                      onChange={handlePasswordChange}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={handleTogglePasswordVisibility}
                    >
                      <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                    </button>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary">Iniciar sesión</button>
              </form>
              {userId && <p>ID de usuario: {userId}</p>} {/* Muestra el ID del usuario si está disponible */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

