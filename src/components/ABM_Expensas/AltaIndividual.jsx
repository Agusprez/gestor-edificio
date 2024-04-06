import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavigationBar from '../NavigationBar';
import { Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";


const AltaIndividual = () => {
  const [unidadFuncionalOptions, setUnidadFuncionalOptions] = useState([]);
  const [unidadFuncional, setUnidadFuncional] = useState('');
  const [tipoCuota, setTipoCuota] = useState('');
  const [cuota, setCuota] = useState('');
  const [valor, setValor] = useState('');
  const [fechaDeVencimiento, setFechaDeVencimiento] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const fetchUnidadFuncionalOptions = async () => {
      try {
        const response = await axios.get('http://localhost:4500/UF/obtenerListado');
        setUnidadFuncionalOptions(response.data.map(uf => ({ value: uf.id, label: `${uf.id} - ${uf.propietario}` })));
      } catch (error) {
        console.error('Error al obtener las opciones de UF:', error.message);
      }
    };

    fetchUnidadFuncionalOptions();
  }, []);

  const limpiarFormulario = () => {
    setUnidadFuncional('');
    setTipoCuota('');
    setCuota('');
    setValor('');
    setFechaDeVencimiento('');
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!unidadFuncional || !tipoCuota || !cuota || !valor || !fechaDeVencimiento) {
      alert('Por favor, complete todos los campos obligatorios.');
      return;
    }

    const formData = {
      unidadFuncional,
      tipoCuota,
      cuota,
      valor,
      fechaDeVencimiento
    };

    try {
      const response = await axios.post('http://localhost:4500/UF/ingresarNuevaExpensa', formData);
      setMensaje('Expensa cargada correctamente');
      limpiarFormulario();
      setTimeout(() => {
        setMensaje('');
      }, 5000); // Limpiar el mensaje después de 5 segundos
    } catch (error) {
      console.error('Error al enviar datos:', error);
      setMensaje('Hubo un error al cargar la expensa. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <>
      <NavigationBar />
      <div className="container-fluid">
        <div className="row justify-content-center mt-3">
          <div className="col-md-8">
            <div className="card">
              <div className="card-body">
                <h2 className="card-title text-center text-decoration-underline">Expensas</h2>
                <p>Con este servicio, podrás cargar expensas a los propietarios declarados en el sistema.</p>
                <br />
                {mensaje && (
                  <div className="alert alert-success">
                    <p>{mensaje}</p>
                    <FontAwesomeIcon icon={faSpinner} spin />
                  </div>
                )}
                <Form onSubmit={handleFormSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Unidad Funcional</Form.Label>
                    <Form.Select value={unidadFuncional} onChange={(e) => setUnidadFuncional(e.target.value)} required>
                      <option value="" disabled>Seleccionar...</option>
                      {unidadFuncionalOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Tipo de Cuota</Form.Label>
                    <Form.Select value={tipoCuota} onChange={(e) => setTipoCuota(e.target.value)} required>
                      <option value="" disabled>Seleccionar...</option>
                      <option value="ExpensasMensuales">Expensas Mensuales</option>
                      <option value="ExpensasExtraordinarias">Expensas Extraordinarias</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Cuota</Form.Label>
                    <Form.Control type="text" value={cuota} onChange={(e) => setCuota(e.target.value)} required />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Valor</Form.Label>
                    <Form.Control type="number" value={valor} onChange={(e) => setValor(e.target.value)} required />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Fecha de Vencimiento</Form.Label>
                    <Form.Control type="date" value={fechaDeVencimiento} onChange={(e) => setFechaDeVencimiento(e.target.value)} required />
                  </Form.Group>
                  <Button variant="primary" type="submit">Guardar</Button>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AltaIndividual;
