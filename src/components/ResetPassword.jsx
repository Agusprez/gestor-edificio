import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';


const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [invalid, setInvalid] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [listaDePreguntas, setListaDePreguntas] = useState([]);
  const [preguntaSeguridadElegida, setPreguntaSeguridadElegida] = useState('');
  const [respuestaDeSeguridad, setRespuestaDeSeguridad] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://192.168.100.110:4500/login/preguntasSeguridad');
        setListaDePreguntas(response.data);
      } catch (error) {
        console.error('Error al obtener las preguntas de seguridad:', error.message);
      }
    };

    fetchData();
  }, []);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const handlePasswordBlurREGEX = async () => {
    try {
      const passwordBlurREGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      if (!passwordBlurREGEX.test(newPassword)) {
        setError('Por favor, introduce una contraseña válida. Debe contener al menos 8 carácteres, una mayúscula, una minúscula y un número.');
        setInvalid(true)
        return;
      }
      setError(null);
      setInvalid(false)
    } catch (error) {
      console.error('Error al verificar contraseña:', error.message);
      setError('Error al verificar contraseña');
    } finally {
      setIsLoading(false);
    }
  };
  const handlePreguntaElegidaChange = (event) => {
    setPreguntaSeguridadElegida(event.target.value);
  };
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRespuestaDeSeguridadChange = (event) => {
    setRespuestaDeSeguridad(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Envía una solicitud al backend para restablecer la contraseña
      const response = await axios.post('http://192.168.100.110:4500/login/reset-password', {
        email,
        newPassword,
        respuestaDeSeguridad,
        preguntaSeguridadElegida

      });
      setSuccessMessage(response.data.message);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      setError(error.response.data.error);
      setIsLoading(false)
    }
  };

  return (
    <div className="container-fluid">
      <div className="row justify-content-center mt-5">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center">Restablecer Contraseña</h2>
              <form onSubmit={handleSubmit}>
                {error && <div className="alert alert-danger">{error}</div>}
                {successMessage && <div className="alert alert-success">{successMessage}</div>}
                <div className="mb-3">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={handleEmailChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <select
                    id="preguntaSeguridad"
                    className="form-select"
                    value={preguntaSeguridadElegida}
                    onChange={handlePreguntaElegidaChange}
                  >
                    <option value="">Selecciona una pregunta de seguridad</option>
                    {listaDePreguntas.map((pregunta) => (
                      <option key={pregunta.id} value={pregunta.id}>{pregunta.question}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <input
                    placeholder='Ingresa tu respuesta'
                    type="text"
                    className="form-control"
                    id="respuestaSeguridad"
                    value={respuestaDeSeguridad}
                    onChange={handleRespuestaDeSeguridadChange}
                  />
                </div>

                <div className="mb-3">
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      placeholder="Nueva Contraseña"
                      value={newPassword}
                      onChange={handleNewPasswordChange}
                      onBlur={handlePasswordBlurREGEX}
                      required
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



                <button type="submit" className="btn d-block mx-auto btn-pass btn-primary" disabled={isLoading || invalid}>
                  {isLoading ? (
                    <FontAwesomeIcon icon={faSpinner} spin />
                  ) : (
                    'Restablecer contraseña'
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary d-block mx-auto mt-3" // Agrega las clases d-block mx-auto y mt-3 para centrar y agregar un margen superior
                  onClick={() => navigate("/login")} // Agrega un manejador de eventos para redirigir al usuario al login
                >
                  Volver al login
                </button>

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
