import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [ufAsociada, setUfAsociada] = useState('');
  const [invalid, setInvalid] = useState(false);
  const [ufOptions, setUfOptions] = useState([]);
  const [preguntasSeguridad, setPreguntasSeguridad] = useState([]); // Estado para almacenar las preguntas de seguridad
  const [selectedSecurityQuestion, setSelectedSecurityQuestion] = useState(''); // Estado para almacenar la pregunta de seguridad seleccionada
  const [securityAnswer, setSecurityAnswer] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:4500/UF/obtenerListado');
        // Suponiendo que el backend devuelve un array de objetos con propiedades id y propietario
        setUfOptions(response.data.map(uf => ({ value: uf.id, label: `${uf.id} - ${uf.propietario}` })));
      } catch (error) {
        console.error('Error al obtener las opciones de UF:', error.message);
        // Manejo del error...
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:4500/login/preguntasSeguridad');
        setPreguntasSeguridad(response.data);
      } catch (error) {
        console.error('Error al obtener las preguntas de seguridad:', error.message);
      }
    };

    fetchData();
  }, []);

  // Manejador de eventos para cambios en la pregunta de seguridad seleccionada
  const handleSecurityQuestionChange = (event) => {
    setSelectedSecurityQuestion(event.target.value);
  };

  const handleSecurityAnswerChange = (event) => {
    setSecurityAnswer(event.target.value);
  };
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setEmailExists(false); // Restablecer la bandera de correo electrónico existente al cambiar el correo electrónico
  };

  const handleNombreCompletoChange = (event) => {
    setNombreCompleto(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleUfAsociadaChange = (event) => {
    setUfAsociada(event.target.value);
  };

  const handleRegister = async () => {
    // Crear un objeto con los datos del registro
    const userData = {
      email: email,
      nombreCompleto: nombreCompleto,
      ufAsociada: ufAsociada,
      password: password,
      preguntaSeguridad: selectedSecurityQuestion,
      respuestaSeguridad: securityAnswer
    };

    try {
      // Enviar la solicitud POST al endpoint correspondiente en el backend
      const response = await axios.post('http://localhost:4500/login/crearUsuario', userData);

      // Manejar la respuesta del servidor
      console.log('Registro exitoso:', response.data);
      // Redirigir al usuario al login
      navigate('/login');
    } catch (error) {
      // Manejar errores de la solicitud
      console.error('Error al registrar usuario:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };


  const handleEmailBlur = async () => {
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Por favor, introduce una dirección de correo electrónico válida.');
        return;
      }

      setIsLoading(true);
      const response = await axios.post('http://localhost:4500/login/checkEmail', { email });
      setEmailExists(response.data.exists);
      setError(null);
    } catch (error) {
      console.error('Error al verificar el correo electrónico:', error.message);
      setError('Error al verificar el correo electrónico.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmPasswordBlur = () => {
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      setInvalid(true)
    } else {
      setError(null);
      setInvalid(false)
    }
  };



  return (
    <div className="container-fluid">
      <div className="row justify-content-center mt-5">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center">Crear nuevo usuario</h2>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>

                <div className="mb-3">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={handleEmailChange}
                    onBlur={handleEmailBlur} // Verificar el correo electrónico al perder el foco del campo
                  />
                  {isLoading && <p>Verificando disponibilidad del correo electrónico...</p>}
                  {emailExists && !isLoading && <p className="text-danger">Este correo electrónico ya está en uso. Por favor, inicia sesión si ya tienes una cuenta.</p>}
                </div>

                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nombre completo"
                    value={nombreCompleto}
                    onChange={handleNombreCompletoChange}
                  />
                </div>

                <div className="mb-3">
                  <select
                    className="form-select"
                    value={ufAsociada}
                    onChange={handleUfAsociadaChange}
                  >
                    <option value="">Selecciona una UF</option>
                    {ufOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      placeholder="Contraseña"
                      value={password}
                      onChange={handlePasswordChange}
                      onBlur={handleConfirmPasswordBlur} // Agregar este evento onBlur

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

                <div className="mb-3">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Confirmar Contraseña"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    onBlur={handleConfirmPasswordBlur} // Agregar este evento onBlur
                  />

                </div>

                <div className="mb-3">
                  <select
                    id="preguntaSeguridad"
                    className="form-select"
                    value={selectedSecurityQuestion}
                    onChange={handleSecurityQuestionChange}
                  >
                    <option value="">Selecciona una pregunta de seguridad</option>
                    {preguntasSeguridad.map((pregunta) => (
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
                    value={securityAnswer}
                    onChange={handleSecurityAnswerChange}
                  />
                </div>
                <div className="mb-3">
                  <button type="submit" className="btn btn-login btn-primary me-2" disabled={isLoading || emailExists || invalid}>
                    {isLoading ? (
                      <FontAwesomeIcon icon={faSpinner} spin />
                    ) : (
                      'Registrarse'
                    )}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => navigate('/login')}>
                    Iniciar sesión
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
