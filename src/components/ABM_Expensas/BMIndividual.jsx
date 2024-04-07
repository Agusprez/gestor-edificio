import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavigationBar from '../NavigationBar';
import { Form, Modal, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { obtenerNombreDepto } from '../RelacionUserUF';


const BajaModificacion = () => {
  const [unidadFuncionalOptions, setUnidadFuncionalOptions] = useState([]);
  const [unidadFuncional, setUnidadFuncional] = useState('');
  const [propietario, setPropietario] = useState('');
  const [tipoCuota, setTipoCuota] = useState('');
  const [nombreCuota, setNombreCuota] = useState('');
  const [valorCuota, setValorCuota] = useState('');
  const [fechaDeVencimiento, setFechaDeVencimiento] = useState('');

  const [expensas, setExpensas] = useState([]);
  const [idExpensa, setIdExpensa] = useState('');
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState(undefined)

  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate(); // Obtiene el objeto Navigate

  const handleModalClose = () => setShowModal(false);
  const handleModalShow = (idExpensa, unidadFuncional, tipoCuota, nombreCuota, valorCuota, fechaDeVencimiento) => {

    let fecha = new Date(fechaDeVencimiento._seconds * 1000 - 1)
    fecha = fecha.toISOString().split('T')[0]
    setFechaDeVencimiento(fecha)
    setValorCuota(valorCuota)
    setNombreCuota(nombreCuota)
    setShowModal(true);
    setIdExpensa(idExpensa)
    //console.log("Mostrar modal con idExpensa:", idExpensa, ", unidad funcional:", unidadFuncional, ", tipo cuota:", tipoCuota);
  };
  const handleModalEliminar = async () => {
    try {
      // Mostrar un mensaje de confirmación
      const confirmacion = window.confirm('¿Estás seguro de que queres eliminar esta expensa?');

      // Si el usuario confirma la eliminación, proceder con la eliminación
      if (confirmacion) {
        const data = { idExpensa, unidadFuncional, tipoCuota };

        const response = await axios.post('http://localhost:4500/UF/eliminarExpensa', data);

        // Verificar si la eliminación fue exitosa
        if (response.status === 200) {
          // Realizar acciones adicionales si es necesario
          //console.log('Datos enviados correctamente');
          setMessage('Unidad Funcional eliminada correctamente');
          setTimeout(() => {
            navigate('/home');
          }, 3000)
        } else {
          // Mostrar un mensaje de error si la eliminación no fue exitosa
          setMessage('Error al eliminar la Unidad Funcional');
        }
      } else {
        // Si el usuario cancela la eliminación, mostrar un mensaje
        //console.log('Eliminación cancelada por el usuario');
        setMessage('Eliminación cancelada por el usuario');
      }
    } catch (error) {
      // Mostrar un mensaje de error si ocurre algún problema
      //console.error('Error:', error);
      setMessage('Error al procesar la solicitud');
    }
  };

  const handleModalEditar = async () => {
    try {
      // Mostrar un mensaje de confirmación
      const confirmacion = window.confirm('¿Estás seguro de que queres modificar esta expensa?');


      // Si el usuario confirma la eliminación, proceder con la eliminación
      if (confirmacion) {
        const data = { idExpensa, unidadFuncional, tipoCuota, nombreCuota, valorCuota, fechaDeVencimiento };
        //console.log(data)
        const response = await axios.patch('http://localhost:4500/UF/editarExpensa', data);

        // Verificar si la eliminación fue exitosa
        if (response.status === 200) {
          // Realizar acciones adicionales si es necesario
          //console.log('Datos enviados correctamente');

          setMessage('Unidad Funcional modificada correctamente');
          setTimeout(() => {
            navigate('/home');
          }, 3000)
        } else {
          // Mostrar un mensaje de error si la eliminación no fue exitosa
          setMessage('Error al modificar la Unidad Funcional');
        }
      } else {
        // Si el usuario cancela la eliminación, mostrar un mensaje
        //console.log('Modificacion cancelada por el usuario');
        setMessage('Modificacion cancelada por el usuario');
      }
    } catch (error) {
      // Mostrar un mensaje de error si ocurre algún problema
      console.error('Error:', error);
      setMessage('Error al procesar la solicitud');
    }
  }

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
        setPropietario(propietario)
        if (expensas.length > 0) {
          // El array contiene elementos
          //console.log('El array de expensas contiene elementos');

          // Verificar si hay periodos no pagados para el tipo de cuota seleccionado
          const expensaSeleccionada = expensas.find(expensa => expensa.tipo === tipoCuota);
          if (expensaSeleccionada) {
            if (expensaSeleccionada.periodosNoPagados.length > 0) {
              //console.log(`Hay periodos no pagados para las expensas ${tipoCuota}`);
              //console.log('Expensas:', expensaSeleccionada.periodosNoPagados);
              setExpensas(expensaSeleccionada.periodosNoPagados)
            } else {
              //console.log(`No hay periodos no pagados para las expensas ${tipoCuota}`);
              setExpensas([])
            }
          } else {
            //console.log(`No hay expensas disponibles para las expensas ${tipoCuota}`);
            setExpensas([])
          }
          setIsLoading(false)
        } else {
          // El array de expensas está vacío
          //console.log('El array de expensas está vacío');
        }
      } catch (error) {
        console.error('Error al obtener las expensas disponibles:', error.message);
      }
    }
  };

  const handleChangeNombreCuota = (e) => {
    setNombreCuota(e.target.value)
  }

  const handleChangeValorCuota = (e) => {
    setValorCuota(e.target.value)
    //console.log(e.target.value)
  }

  const handleChangeFechaVencimiento = (e) => {
    setFechaDeVencimiento(e.target.value);
  }
  useEffect(() => {
    // Realizar la solicitud al backend una vez que se seleccionen ambos valores
    if (unidadFuncional && tipoCuota) {
      setIsLoading(true)
      setExpensas([])
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
          {message && (
            <div className="alert alert-success">
              <p>{message}</p>
              <FontAwesomeIcon icon={faSpinner} spin />
            </div>
          )}
          <Modal.Body>
            <p>Unidad Funcional: {obtenerNombreDepto(unidadFuncional)} </p>
            <p>Propietario: {propietario}</p>
            <p>Tipo de Expensa: {tipoCuota === "ExpensasMensuales" ? "Mensual" : "Extraordinaria"}</p>

            <p>Expensa:
              <input
                defaultValue={nombreCuota}
                onChange={handleChangeNombreCuota}
              >
              </input>
            </p>

            <p>Valor: $
              <input
                type="number"
                value={valorCuota}
                onChange={handleChangeValorCuota}
              />
            </p>

            <p>Fecha De Vencimiento:
              <input
                value={fechaDeVencimiento}
                type="date"
                onChange={handleChangeFechaVencimiento}>
              </input>
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleModalEliminar}>
              Eliminar
            </Button>
            <Button variant="success" onClick={handleModalEditar}>
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
                  {isLoading && unidadFuncional && tipoCuota && (
                    <>
                      <br />
                      <p className='text-danger'><FontAwesomeIcon icon={faSpinner} spin /> Cargando...</p>
                    </>)}
                  {!isLoading && expensas.length === 0 && unidadFuncional && tipoCuota && (
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
                                <Button variant="primary" onClick={() => handleModalShow(expensa.id, unidadFuncional, tipoCuota, expensa.cuotaNro || expensa.cuotaMes, expensa.valor, expensa.fechaDeVencimiento)}>
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
