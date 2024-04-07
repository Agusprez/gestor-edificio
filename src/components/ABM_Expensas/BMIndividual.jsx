import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavigationBar from '../NavigationBar';
import { Form, Modal, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';

const BajaModificacion = () => {
  const [unidadFuncionalOptions, setUnidadFuncionalOptions] = useState([]);
  const [unidadFuncional, setUnidadFuncional] = useState('');
  const [tipoCuota, setTipoCuota] = useState('');
  const [expensas, setExpensas] = useState([]);
  const [idExpensa, setIdExpensa] = useState('');

  const [showModal, setShowModal] = useState(false);

  const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => setShowModal(true);

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




  const convertirTimestampAFechaLegible = timestamp => {
    let fecha = new Date(timestamp._seconds * 1000); // Convertir segundos a milisegundos
    fecha = fecha.toLocaleDateString()
    return fecha; // Formatear la fecha como una cadena legible
  };
  const fetchExpensasDisponibles = async () => {
    if (unidadFuncional && tipoCuota) {
      try {
        const response = await axios.get(`http://localhost:4500/UF/impagosSegunPropietarioSinUser/${unidadFuncional}`);
        const { propietario, expensas } = response.data;
        if (expensas.length > 0) {
          // El array contiene elementos
          console.log('El array de expensas contiene elementos');

          // Verificar si hay periodos no pagados para el tipo de cuota seleccionado
          const expensaSeleccionada = expensas.find(expensa => expensa.tipo === tipoCuota);
          if (expensaSeleccionada) {
            if (expensaSeleccionada.periodosNoPagados.length > 0) {
              console.log(`Hay periodos no pagados para las expensas ${tipoCuota}`);
              console.log('Expensas:', expensaSeleccionada.periodosNoPagados);
              setExpensas(expensaSeleccionada.periodosNoPagados)
            } else {
              console.log(`No hay periodos no pagados para las expensas ${tipoCuota}`);
              setExpensas([])
            }
          } else {
            console.log(`No hay expensas disponibles para las expensas ${tipoCuota}`);
            setExpensas([])
          }
        } else {
          // El array de expensas está vacío
          console.log('El array de expensas está vacío');
        }
      } catch (error) {
        console.error('Error al obtener las expensas disponibles:', error.message);
      }
    }
  };


  useEffect(() => {
    // Realizar la solicitud al backend una vez que se seleccionen ambos valores
    if (unidadFuncional && tipoCuota) {
      fetchExpensasDisponibles();
    }
  }, [unidadFuncional, tipoCuota]);

  return (
    <>
      <NavigationBar />
      <>
        <Modal show={showModal} onHide={handleModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>Detalles de la Expensa</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Expensa: </p>
            <p>Valor: </p>
            <p>Fecha De Vencimiento: </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleModalClose}>
              Eliminar
            </Button>
            <Button variant="success" onClick={handleModalClose}>
              Guardar cambios
            </Button>
            <Button variant="secondary" onClick={handleModalClose}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
      </>
      <div className="container-fluid">
        <div className="row justify-content-center mt-3">
          <div className="col-md-8">
            <div className="card">
              <div className="card-body">
                <h2 className="card-title text-center text-decoration-underline">Baja o Modificación de Expensas</h2>
                <p>Este servicio permite editar o eliminar expensas que no haya sido abonadas.</p>
                <br />
                <Form>
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
                  {expensas.length === 0 && (
                    <>
                      <br />
                      <p className='text-danger'><FontAwesomeIcon icon={faCircleXmark} /> No hay expensas disponibles.</p>
                    </>)}
                  {expensas.length > 0 && (
                    <Form.Group className="mb-3 text-center">
                      <Form.Label ><h3 className='text-decoration-underline'>Expensas Disponibles </h3></Form.Label>
                      <div className="row">
                        {expensas.map(expensa => (
                          <div key={expensa.id} className="col-md-4 mb-3">
                            <div className="card">
                              <div className="card-body">
                                <h5 className="card-title">Cuota: {typeof (expensa.cuotaNro) === "number" ? `Extraordinaria N° ${expensa.cuotaNro}` : expensa.cuotaMes || expensa.cuotaNro}</h5>
                                <p className="card-text">Valor: ${expensa.valor}</p>
                                <p className="card-text">Fecha De Vencimiento: {convertirTimestampAFechaLegible(expensa.fechaDeVencimiento)}</p>
                                <Button variant="primary" onClick={handleModalShow}>
                                  Ver Detalles
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Form.Group>
                  )}


                </Form>
              </div>
            </div>
          </div>
        </div>
      </div >
    </>
  );
}

export default BajaModificacion;
