import React from 'react';
import NavigationBar from './NavigationBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapLocation, faBusinessTime, faPhoneVolume, faEnvelopeOpenText, faUser } from '@fortawesome/free-solid-svg-icons';

const ResolverPago = () => {


  // Función para renderizar los datos
  const renderData = () => {
    return (
      <>
        <h2 className="card-title text-center text-decoration-underline">Resolver problemas de pagos</h2>
        <br />
        <h4 className="card-title text-right ">Para este tipo de problemas, comunicarse con el administrador:</h4>
        <br />
        <p className="card-text"><FontAwesomeIcon icon={faUser} /> Administrador: CORLETO OSCAR RAMON</p>
        <p className="card-text"><FontAwesomeIcon icon={faPhoneVolume} /> Contacto: 3329-424104</p>
        <p className="card-text"><FontAwesomeIcon icon={faEnvelopeOpenText} /> Contacto: estudiocorleto@redsp.com.ar</p>
        <p className="card-text"><FontAwesomeIcon icon={faMapLocation} /> Direccion: Mitre 1287, San Pedro, Bs. As.</p>
        <p className="card-text"><FontAwesomeIcon icon={faBusinessTime} /> Horario de atencion: 08.00hs a 15.00hs</p>
        {/* Agrega aquí cualquier otra información del usuario que desees mostrar */}
      </>
    );
  };

  return (
    <div>
      <NavigationBar />
      <div className="container-fluid">
        <div className="row justify-content-center mt-3">
          <div className="col-md-8">
            <div className="card">
              <div className="card-body">
                {renderData()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResolverPago;

