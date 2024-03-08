import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDYHYAcRbtIrBfcTinzc8d0JAolKx_Af4s",
  authDomain: "gestion-de-consorcio.firebaseapp.com",
  projectId: "gestion-de-consorcio",
  storageBucket: "gestion-de-consorcio.appspot.com",
  messagingSenderId: "493054503562",
  appId: "1:493054503562:web:cad423b56c1985309f5b73",
  measurementId: "G-TMPJK7CJRC"
};

initializeApp(firebaseConfig);
const SubirImagen = ({ onUploadSuccess }) => {
  const [imagen, setImagen] = useState(null);
  const [progreso, setProgreso] = useState(0); // Estado para el progreso de carga
  const [cargaCompleta, setCargaCompleta] = useState(false); // Estado para controlar si la carga está completa

  const handleImagenSeleccionada = (event) => {
    if (event.target.files[0]) {
      setImagen(event.target.files[0]);
    }
  };

  const handleSubirImagen = () => {
    if (imagen) {
      const storage = getStorage();
      const storageRef = ref(storage, `transferencia_${new Date().getTime()}_${imagen.name}`);
      const uploadTask = uploadBytesResumable(storageRef, imagen);

      uploadTask.on('state_changed',
        (snapshot) => {
          // Actualizar el estado de progreso de carga
          const progreso = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgreso(progreso);
        },
        (error) => {
          console.error('Error al subir la imagen:', error);
        },
        () => {
          // Subida completada con éxito
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              console.log('Imagen subida con éxito. URL:', downloadURL);
              // Llamar a la función onUploadSuccess con el nombre del archivo
              onUploadSuccess(uploadTask.snapshot.ref.name);
              // Actualizar el estado para indicar que la carga está completa
              setCargaCompleta(true);
            })
            .catch((error) => {
              console.error('Error al obtener la URL de descarga:', error);
            });
        }
      );
    }
  };

  return (
    <div>
      <input className="btn btn-outline-secondary" type="file" onChange={handleImagenSeleccionada} />
      <button className="btn btn-primary m-2" onClick={handleSubirImagen}>Subir Imagen</button>
      {/* Barra de progreso */}
      {progreso > 0 && progreso < 100 && (
        <div className="progress mt-2">
          <div
            className="progress-bar"
            role="progressbar"
            style={{ width: `${progreso}%` }}
            aria-valuenow={progreso}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            {`${Math.round(progreso)}%`}
          </div>
        </div>
      )}
      {/* Mostrar mensaje de carga completa si la carga está completa */}
      {cargaCompleta && <p className='text-success'>La imagen se ha subido correctamente.</p>}
    </div>
  );
};

export default SubirImagen;