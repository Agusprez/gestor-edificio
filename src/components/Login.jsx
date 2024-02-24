import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faSpinner } from '@fortawesome/free-solid-svg-icons'; // Importa el icono de Spinner
import { useNavigate } from 'react-router-dom'; // Importa useHistory

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Estado para indicar si se está cargando
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
      // Validar campos de entrada
      if (!email || !password) {
        setError('Por favor, completa todos los campos.');
        return;
      }

      setIsLoading(true); // Establecer isLoading a true mientras se procesa la solicitud

      const response = await axios.post('http://localhost:4500/login', { email, password });

      if (!response) {
        throw new Error('No se recibió respuesta del servidor. Por favor, intenta de nuevo más tarde.');
      }


      const id = response.data.userId;
      setUserId(id);
      setError(null); // Limpia cualquier mensaje de error previo

      // Guardar el ID de usuario en sessionStorage
      sessionStorage.setItem('userId', id);
      navigate('/home');
    } catch (error) {
      if (error.message === "Request failed with status code 400") {
        console.error("Error al iniciar sesión:", error.message)
        setError("Credenciales inválidas.")
      } else {
        console.error('Error al iniciar sesión:', error.message);
        setError(error.message);
      }
    } finally {
      setIsLoading(false); // Establecer isLoading a false cuando la solicitud se haya completado (ya sea exitosa o no)
    }
  };
  ;

  const handleRegisterRedirect = () => {
    // Redireccionar a la página de registro
    navigate('/register');
  };
  const handleResetPasswordRedirect = () => {
    // Redireccionar a la página de registro
    navigate('/reset-password');
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
                <div className="mb-4 d-flex justify-content-left">
                  <button type="submit" className="btn-login btn btn-primary" disabled={isLoading}>
                    {isLoading ? (
                      <FontAwesomeIcon icon={faSpinner} spin />
                    ) : (
                      'Iniciar sesión'
                    )}
                  </button>
                  <button type="button" className="btn btn-secondary mx-2" onClick={handleRegisterRedirect}>
                    Registrarse
                  </button>
                  <button type="button" className="btn btn-secondary " onClick={handleResetPasswordRedirect}>
                    Olvidé mi contraseña
                  </button>

                </div>

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
