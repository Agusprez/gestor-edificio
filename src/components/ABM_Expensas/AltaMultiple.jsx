import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import NavigationBar from '../NavigationBar';
import * as ExcelJS from 'exceljs';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";


const ExcelUploadForm = () => {
  const [file, setFile] = useState();
  const [mensaje, setMensaje] = useState("")
  const navigate = useNavigate()


  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    console.log('Archivo seleccionado:', selectedFile);
    setFile(selectedFile);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      console.error('No se ha seleccionado ningún archivo.');
      return;
    }

    try {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(file);
      const worksheet = workbook.getWorksheet(1);

      // Itera sobre cada fila del archivo Excel
      worksheet.eachRow(async (row, rowNumber) => {
        if (rowNumber !== 1) { // Saltar la primera fila (encabezados)
          // Obtén los valores de cada celda en la fila
          const unidadFuncional = row.getCell(1).value;
          const tipoCuota = row.getCell(2).value;
          const nombreCuota = row.getCell(3).value;
          const valorCuota = row.getCell(4).value;
          const fechaDeVencimiento = row.getCell(5).value;

          // Verifica si hay valores presentes antes de procesar la fila
          if (unidadFuncional) {
            // Crea el objeto de datos para enviar al servidor
            const data = {
              unidadFuncional,
              tipoCuota,
              cuota: nombreCuota,
              valor: valorCuota,
              fechaDeVencimiento,
            };
            console.log(data)
            // Envía los datos al endpoint de carga individual de expensas utilizando Axios
            const response = await axios.post('http://localhost:4500/UF/ingresarNuevaExpensa', data);

            if (response.status !== 200) {
              throw new Error('Error al cargar los datos.');
            }
          }

          // Procesa la respuesta del servidor
          console.log('Expensa cargada exitosamente:');
        }
      });
      setMensaje("Todas las expensas se cargaron exitosamente");
      setTimeout(() => {
        navigate("/home")
      }, 2500)
      console.log('Todas las expensas se cargaron exitosamente.');
    } catch (error) {
      console.error('Error al procesar el archivo:', error);
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
                <p>Con este servicio, podrás cargar expensas de manera multiple a los propietarios declarados en el sistema.</p>
                <br />
                <br />
                {mensaje && (
                  <div className="alert alert-success">
                    <p>{mensaje}</p>
                    <FontAwesomeIcon icon={faSpinner} spin />
                  </div>
                )}
                <Form onSubmit={handleFormSubmit}>
                  <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Seleccione un archivo Excel (.xlsx, .xls)</Form.Label>
                    <Form.Control type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Cargar archivo
                  </Button>
                </Form>

              </div>
            </div>
          </div>
        </div>
      </div >
    </>
  );
};

export default ExcelUploadForm;
