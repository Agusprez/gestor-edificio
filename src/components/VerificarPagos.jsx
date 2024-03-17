import React, { useEffect, useState } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import NavigationBar from './NavigationBar';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { obtenerNombreDepto } from './RelacionUserUF'

const VerificarPagos = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [expensasParaVerificar, setExpensasParaVerificar] = useState([])

  //Voy a querer mostrar cards donde las expensas aparezcan como pagas y tengan la propiedad verificado en false. LISTO
  //quiero que muestre la unidad Funcional, el valor actualizado, el valor original, dias de intereses si existe, fecha de pago y fecha de vencimiento, un link para descargar el comprobante que subieron y un boton para confirmar el pago.
  // UF/Pagos
  //una vez confirmado el pago
  useEffect(() => {
    const expensasPagadas = async () => {
      try {
        const response = await axios.get('http://localhost:4500/UF/Pagos')
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
      // Si el objeto es un objeto, iterar sobre cada propiedad y llamar recursivamente a la función
      if (typeof objeto === 'object' && objeto !== null) {
        return Object.values(objeto).some(valor => buscarVerificado(valor));
      }
      // Si el objeto es un valor, verificar si es 'verificado'
      return objeto === true;
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
          <Row className='h-100'>
            {expensas.map((expensa, index) => (
              <Col key={index} className='col-md-12 h-100 mb-3'>
                <Card >
                  <Card.Body>
                    <h5 className='text-center'><strong>{expensa.propietario}</strong></h5>
                    <h6 className='text-center'><strong>{obtenerNombreDepto(expensa.idUF)}</strong></h6>
                    {expensa.expensas.map((periodo, periodoIndex) => (

                      <div key={periodoIndex}>
                        <p><strong className="text-decoration-underline">Tipo:</strong> {periodo.tipo}</p>
                        <Row >
                          {periodo.periodosPagados.map((pagado, pagoIndex) => (
                            <Col className='col-md-4 mb-3'>
                              <Card key={pagoIndex}>
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
                                  {/* Agrega aquí cualquier otra información que desees mostrar */}
                                </Card.Body>
                              </Card>


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
      </div>
    </div >
  )
}

export default VerificarPagos;
