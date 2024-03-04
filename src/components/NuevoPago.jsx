import React, { useState } from 'react';
import NavigationBar from './NavigationBar';
import { useLocation } from 'react-router-dom'; // Importar useLocation

const NuevoPago = () => {
  // Estados para los campos del formulario
  const location = useLocation();
  const [monto, setMonto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const data = location.state?.data
  console.log(`Es mi data ${data}`)
  // Función para manejar el envío del formulario
  const handleSubmit = (event) => {
    event.preventDefault();
    // Aquí puedes enviar los datos del formulario al servidor
    console.log('Monto:', monto);
    console.log('Descripción:', descripcion);
    // Limpia los campos del formulario después del envío
    setMonto('');
    setDescripcion('');
  };

  return (
    <div>
      <NavigationBar />
      <div className="container-fluid">
        <div className="row justify-content-center mt-3">
          <div className="col-md-8">
            <div className="card">
              <div className="card-body">
                <h2>Nuevo Pago</h2>
                {/* Formulario */}
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="monto" className="form-label">Monto:</label>
                    <input
                      type="number"
                      className="form-control"
                      id="monto"
                      value={monto}
                      onChange={(e) => setMonto(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="descripcion" className="form-label">Descripción:</label>
                    <textarea
                      className="form-control"
                      id="descripcion"
                      value={descripcion}
                      onChange={(e) => setDescripcion(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary">Enviar</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NuevoPago;
