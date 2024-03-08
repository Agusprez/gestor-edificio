import React, { useState, useEffect } from 'react';
import NavigationBar from './NavigationBar';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SubirImagen from './SubirImagen';

const NuevoPago = () => {
  // Estados para los campos del formulario
  const [imagenId, setImagenId] = useState(null); // Estado para el ID de la imagen
  const [idPropietario, setIdPropietario] = useState('');
  const [cuotaMes_cuotaNro, setCuota] = useState('');
  const [valorCuota, setValorCuota] = useState('');
  const [expensaData, setExpensaData] = useState(null); // Estado para almacenar los datos de la expensa
  const [intereses, setIntereses] = useState(0); // Estado para almacenar los intereses calculados
  const [diasInt, setDiasInt] = useState(0); // Estado para almacenar los intereses calculados
  const [loading, setLoading] = useState(true); // Estado para controlar la carga
  const [pagoEnTermino, setPagoEnTermino] = useState(false); // Estado para indicar si el pago está en término

  useEffect(() => {
    const idDeudaRec = sessionStorage.getItem('idDeuda');
    const idPropietario = sessionStorage.getItem('ufAsoc');
    setIdPropietario(idPropietario)
    const obtenerDatosExpensa = async () => {
      try {
        // Realizar la solicitud POST al backend para obtener los datos de la expensa por su ID
        const response = await axios.post(`http://localhost:4500/uf/busquedaExpensa`, { idExpensaHash: idDeudaRec, idPropietario });
        setExpensaData(response.data); // Establecer los datos de la expensa en el estado local
        setLoading(false); // Indicar que la carga ha finalizado

      } catch (error) {
        console.error('Error al obtener los datos de la expensa:', error);
        setLoading(false); // Indicar que la carga ha finalizado, incluso si ocurrió un error
      }
    };
    // Llamar a la función para obtener los datos de la expensa cuando el componente se monte
    obtenerDatosExpensa();
  }, []);

  useEffect(() => {
    if (expensaData) {
      const fechaActual = new Date();
      const fechaVencimiento = new Date(expensaData.fechaDeVencimiento._seconds * 1000); // Convertir segundos a milisegundos
      const diferenciaDias = Math.ceil((fechaActual - fechaVencimiento) / (1000 * 60 * 60 * 24));
      let interesesCalculados = (expensaData.valor * 2.10) * (diferenciaDias / 365); // Calcular los intereses al 110% anual
      interesesCalculados = Math.round(interesesCalculados / 10) * 10; // Redondear al múltiplo de 50 más cercano
      setIntereses(interesesCalculados);
      setDiasInt(diferenciaDias);

      const cuota = expensaData.cuotaMes || expensaData.cuotaNro
      const valorCuota = (expensaData.valor).toFixed(2)
      setCuota(cuota)
      setValorCuota(valorCuota)
      // Verificar si el pago está en término
      if (fechaActual <= fechaVencimiento) {
        setPagoEnTermino(true);
        setIntereses(0)
      } else {
        setPagoEnTermino(false);
      }
    }
  }, [expensaData]);

  const handleUploadSuccess = (imagenId) => {
    console.log('ID de la imagen subida:', imagenId);
    // Guarda el ID de la imagen en el estado
    setImagenId(imagenId);
    // Aquí puedes realizar otras acciones con el ID de la imagen
  };

  const convertirTimestampAFechaLegible = timestamp => {
    let fecha = new Date(timestamp._seconds * 1000); // Convertir segundos a milisegundos
    fecha = fecha.toLocaleDateString()
    return fecha; // Formatear la fecha como una cadena legible
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (event) => {
    event.preventDefault();
    const datosParaEnviar = {
      intereses: intereses,
      fechaDePago: new Date(),
      imagenId
    }

    try {
      const response = await axios.patch(`localhost:3000/uf/ingresarPago2/${idPropietario}/${cuotaMes_cuotaNro}`, datosParaEnviar)
      console.log(response.data)
    } catch (error) {

    }
  };

  return (
    <div>
      <NavigationBar />
      <div className="container-fluid">
        <div className="row justify-content-center mt-3">
          <div className="col-md-8">
            <div className="card">
              <div className="card-body">
                <h2>Ingresar nuevo Pago</h2>
                {loading || !expensaData ? (
                  // Mostrar el circulito de carga si se está cargando o si expensaData es null
                  <div className="d-flex justify-content-center">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Cargando...</span>
                    </div>
                  </div>
                ) : (
                  // Mostrar los datos de la expensa una vez que se hayan cargado
                  <div>
                    {/* Aquí imprimimos el nombre de la expensa */}
                    <p>Expensa a pagar: <strong>{cuotaMes_cuotaNro}</strong></p>
                    <p>Monto: <strong>$ {valorCuota}</strong></p>
                    <p>Fecha de Vencimiento: <strong>{expensaData && convertirTimestampAFechaLegible(expensaData.fechaDeVencimiento)}</strong></p>
                    {/* Mostrar intereses */}
                    {/* Mostrar intereses si los días son mayores a 0 */}
                    {diasInt > 0 && (
                      <p>Intereses al 110% anual: <strong>$ {intereses.toFixed(2)} || {diasInt} días de interés.</strong></p>
                    )}
                    {/* Mostrar total actualizado */}
                    {/* Mostrar total actualizado */}
                    <p>Total actualizado: <strong>$ {diasInt > 0 ? (parseFloat(expensaData && expensaData.valor) + intereses).toFixed(2) : expensaData.valor}</strong></p>
                    {/* Mostrar estado de pago */}
                    <p>Estado del pago: <strong>{pagoEnTermino ? 'Pago en término' : 'Pago fuera de término'}</strong></p>
                    {/* Formulario */}
                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <p>Seleccione el comprobante de transferencia:</p>
                        <SubirImagen onUploadSuccess={handleUploadSuccess} />
                      </div>
                      <button type="submit" className="btn btn-primary">Enviar</button>
                      <Link to="/deuda" className="btn btn-secondary m-2">Volver a Mis Deudas</Link>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NuevoPago;
