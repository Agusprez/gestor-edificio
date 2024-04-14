import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import NavigationBar from './NavigationBar';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { obtenerNombreDepto } from './RelacionUserUF'
import VerificarPagoInd from './VerificarPagoInd';

const VerificarPagos = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [expensasParaVerificar, setExpensasParaVerificar] = useState([])
  const [mostrarModal, setMostrarModal] = useState(false);
  const [datosDelPago, setDatosDelPago] = useState(null);
  const [datosDeUF, setDatosDeUF] = useState(null);

  //Voy a querer mostrar cards donde las expensas aparezcan como pagas y tengan la propiedad verificado en false. LISTO
  //quiero que muestre la unidad Funcional, el valor actualizado, el valor original, dias de intereses si existe, fecha de pago y fecha de vencimiento, un link para descargar el comprobante que subieron y un boton para confirmar el pago.
  // UF/Pagos
  //una vez confirmado el pago
  const handleVerificarPago = (datosDelPago, datosDeUf) => {
    // Aquí podrías cargar los datos del pago desde donde sea necesario
    const datosPago = datosDelPago
    //console.log(datosDeUf)
    const datosUf = {
      uf: datosDeUf.idUF,
      propietario: datosDeUf.propietario
    }
    setDatosDelPago(datosPago);
    setDatosDeUF(datosUf);
    //console.log(datosDeUF)
    setMostrarModal(true);
  };

  const handleCloseModal = () => {
    setMostrarModal(false);
  };
  useEffect(() => {
    const expensasPagadas = async () => {
      try {
        const response = await axios.get('http://192.168.100.110:4500/UF/Pagos')
        const expensas = response.data

        const expensasParaVerificar = expensas.filter(expensa => {
          // Filtrar solo aquellos elementos donde al menos un valor sea 'verificado' como false
          return buscarVerificado(expensa);
        });
        setExpensasParaVerificar(expensasParaVerificar)
        setIsLoading(false)
        return
      } catch (e) {
        console.error('Error al obtener los pagos:', e);
      }
    }
    expensasPagadas()

    function buscarVerificado(objeto) {
      // Si el objeto es un array, iterar sobre cada elemento y llamar recursivamente a la función
      if (Array.isArray(objeto)) {
        return objeto.some(item => buscarVerificado(item));
      }
      // Si el objeto es un objeto, verificar si tiene una propiedad 'verificado' y su valor es true
      if (typeof objeto === 'object' && objeto !== null) {
        // Verificar si la propiedad 'verificado' existe y su valor es true
        if (objeto.hasOwnProperty('verificado') && objeto.verificado === false && objeto.hasOwnProperty('pagado') && objeto.pagado === true) {
          return true;
        }
        // Si no se encuentra 'verificado', iterar sobre cada propiedad y llamar recursivamente a la función
        return Object.values(objeto).some(valor => buscarVerificado(valor));
      }
      // Si el objeto es un valor, retornar false
      return false;
    }


  }, []);


  const renderLoading = () => {
    return (
      <div className="d-flex align-items-center">
        <p>Cargando pagos...<FontAwesomeIcon icon={faSpinner} spin className="ml-2" /></p>
      </div>
    )
  }

  const renderExpensasParaVerificar = (expensas) => {
    return (
      <React.Fragment>
        {expensas.length === 0 ? (
          <p className="warning p-3 fs-5">No hay pagos disponibles.</p>
        ) : (
          <Row>
            {expensas.map((expensa, index) => (
              <Col key={index} className='col-md-12 mb-3 '>
                <Card className="container-fluid">
                  <Card.Body className="">
                    <h5 className='text-center'><strong>{expensa.propietario}</strong></h5>
                    <h6 className='text-center'><strong>{obtenerNombreDepto(expensa.idUF)}</strong></h6>
                    {expensa.expensas.map((periodo, periodoIndex) => (

                      <div key={periodoIndex}>
                        <p><strong className="text-decoration-underline">Tipo:</strong> {periodo.tipo}</p>
                        <Row >
                          {periodo.periodosPagados.map((pagado, pagoIndex) => (

                            <Col key={pagoIndex} className='col-md-4 mb-3'>

                              {!pagado.verificado && ( // Mostrar la tarjeta solo si el pago no está verificado
                                <Card >
                                  <Card.Body>
                                    <p>Cuota: {pagado.cuotaNro || pagado.cuotaMes}</p>
                                    <p>Valor: {pagado.valor}</p>
                                    <p>Fecha de pago: {new Date(pagado.fechaDePago._seconds * 1000).toLocaleDateString()}</p>

                                    <p>Fecha de Vencimiento: {new Date(pagado.fechaDeVencimiento?._seconds * 1000).toLocaleDateString()}</p>
                                    {pagado.diasIntereses > 0 ? (
                                      // Código que se ejecutará si pagado.diasIntereses es mayor que 0
                                      <p>Mora de {pagado.diasIntereses} días.</p>
                                    ) : (
                                      // Código que se ejecutará si pagado.diasIntereses es menor o igual a 0
                                      <p>Pago en término</p>
                                    )}
                                    <div className="text-center">
                                      <Button onClick={() => handleVerificarPago(pagado, expensa)}
                                      >Verificar pago</Button>
                                    </div>
                                    {/* Agrega aquí cualquier otra información que desees mostrar */}
                                  </Card.Body>
                                </Card>

                              )}
                            </Col>
                          ))}
                        </Row>
                      </div>
                    ))}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )
        }
      </React.Fragment >
    );
  };

  return (

    <div className={isLoading ? 'overflow-hidden' : ''}>
      <NavigationBar></NavigationBar>
      <div className='container-fluid'>
        <Row className='justify-content-center mt-3'>
          <Col className="col-md-8">
            <Card>
              <Card.Body>
                <h2 className='text-decoration-underline text-center'>Verificar pagos</h2>
                <p>Este servicio te permite verificar los pagos ingresados por los usuarios.</p>
                {isLoading ? (
                  renderLoading()
                ) : (
                  renderExpensasParaVerificar(expensasParaVerificar)
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
        {mostrarModal && (
          <VerificarPagoInd
            datosDelPago={datosDelPago}
            datosDeUF={datosDeUF}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div >
  )
}

export default VerificarPagos;
