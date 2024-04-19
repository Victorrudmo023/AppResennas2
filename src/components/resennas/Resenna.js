import React, { useState, useEffect } from 'react';
import { deleteResennna, updateResennna, convertImageToBase64 } from "../../api/resennaApi";
import Modal from '../Modal/Modal';
import './resenna.css';
import html2pdf from 'html2pdf.js';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import iconDefault from 'leaflet/dist/images/marker-icon.png';
import 'leaflet/dist/images/marker-shadow.png';

const Resennna = ({ resenna, onDeleteResennna, allResennas}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedResennna, setSelectedResennna] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedResennna, setEditedResennna] = useState(resenna); 
  const [mapInitialized, setMapInitialized] = useState(false); 
  const mapContainerId = `map-${resenna.id}`;
  const latPattern = /^-?\d{1,3}°\s\d{1,2}'\s\d{1,2}\.\d{1,5}"\s[NSWE]$/;
  const lonPattern = /^-?\d{1,3}°\s\d{1,2}'\s\d{1,2}\.\d{1,5}"\s[NSWE]$/;
  
  const validarCoordenadas = (latitud, longitud) => {
    return latPattern.test(latitud) && lonPattern.test(longitud);
  };
  
  useEffect(() => {
    if (!mapInitialized) {
      showMap(resenna.latitud, resenna.longitud, mapContainerId);
      setMapInitialized(true);
    }
  }, [resenna, mapContainerId, mapInitialized]);

  const delResennna = async () => {
    const response = await deleteResennna(selectedResennna);
    if (!response.error) {
      onDeleteResennna(selectedResennna);
      window.location.reload();
    }
    setShowConfirmation(false); 
  }
  
  const handleResennaClick = (resenna) => {
    setSelectedResennna(resenna);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const showDeleteConfirmation = (resenna) => {
    setSelectedResennna(resenna);
    setShowConfirmation(true);
  };

  const convertirGradosAMedidaDecimal = (coordenadas) => {
    const partes = coordenadas.match(/[^\s]+/g);
    const grados = parseFloat(partes[0]);
    const minutos = parseFloat(partes[1]);
    const segundos = parseFloat(partes[2]);
    const direccion = partes[3];
    let decimal = grados + minutos / 60 + segundos / 3600;
    if (direccion === 'S' || direccion === 'W') {
      decimal = -decimal;
    }
    return decimal;
  };

  const showMap = (latitud, longitud, containerId) => {
    const lat = convertirGradosAMedidaDecimal(latitud);
    const lng = convertirGradosAMedidaDecimal(longitud);

    const map = L.map(containerId);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    const markers = L.layerGroup().addTo(map);

    const defaultIcon = L.icon({
      iconUrl: iconDefault,
      iconSize: [24, 36],
      iconAnchor: [12, 36]
    });

    const redIcon = L.icon({
      iconUrl: iconDefault,
      iconSize: [24, 36],
      iconAnchor: [12, 36]
    });

    redIcon.options.className = 'huechange';
    
    allResennas.forEach(item => {
      const markerIcon = item.id === resenna.id ? redIcon : defaultIcon;
      const marker = L.marker([convertirGradosAMedidaDecimal(item.latitud), convertirGradosAMedidaDecimal(item.longitud)], { icon: markerIcon }).addTo(markers)
        .bindPopup(`<b>${item.titulo}</b><br><b>Num. expediente: </b>${item.num}<br><b>Latitud:</b> ${item.latitud}<br><b>Longitud:</b> ${item.longitud}`, {
          autoPan: true,
          offset: L.point(0, -12)
        });
    });
  
    map.setView([lat, lng], 13);
    
    map.on('click', function(e) {
      const latlng = e.latlng;
      const latGrados = convertirAMedidaGrados(latlng.lat, 'lat');
      const lngGrados = convertirAMedidaGrados(latlng.lng, 'lng');
      const popupContent = "Ha clicado en las coordenadas:<br><b>Latitud:</b> " + latGrados + "<br><b>Longitud:</b> " + lngGrados;
      const popup = L.popup()
        .setLatLng(latlng)
        .setContent(popupContent)
        .openOn(map);
    });
    
    const convertirAMedidaGrados = (coord, tipo) => {
      let grado = tipo === 'lat' ? 'N' : 'E';
      if (tipo === 'lat' && coord < 0) {
        grado = 'S';
        coord = Math.abs(coord);
      } else if (tipo === 'lng' && coord < 0) {
        grado = 'W';
        coord = Math.abs(coord);
      }
    
      const grados = Math.floor(coord);
      const minutosRestantes = (coord - grados) * 60;
      const minutos = Math.floor(minutosRestantes);
      const segundos = ((minutosRestantes - minutos) * 60).toFixed(5);
    
      return `${grados}° ${minutos}' ${segundos}" ${grado}`;
    };
  };
  
  const openEditModal = () => {
    setEditedResennna(resenna);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditedResennna({ ...editedResennna, [name]: value });
  };

  const handleEditFormSubmit = async (e) => {
    e.preventDefault();
    const { latitud, longitud } = editedResennna;
    if (!validarCoordenadas(latitud, longitud)) {
      alert("Por favor, ingrese coordenadas válidas para la latitud y longitud. \nDeben seguir el patrón: \nLatitud: 1° 1' 1.11111\" N/S \nLongitud: 1° 1' 1.11111\" W/E");
      return;
    }
    const response = await updateResennna(editedResennna);
    if (!response.error) {
      setIsEditModalOpen(false);
      setSelectedResennna(editedResennna);
      window.location.reload();
    }
  }

  const handleImageInputChange = async (e) => {
    const { name, files } = e.target;
    const imageFile = files[0]; // Obtener el archivo de imagen seleccionado

    // Convertir la imagen a base64
    const base64Image = await convertImageToBase64(imageFile);

    // Actualizar el estado editedResennna con la imagen convertida a base64
    setEditedResennna({ ...editedResennna, [name]: base64Image });
  };

  const generatePDF = (resenna) => {
    const element = document.querySelector(`#pdf-${resenna.id}`);
    const opt = {
      filename: `${resenna.titulo + " " + resenna.marca}.pdf`,
      image: { type: 'svg', quality: 1 }, // Ajustar la calidad de la imagen
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
  
    html2pdf().from(element).set(opt).save();
  };
  
  
  return (
    
    <div className="portada" key={resenna.id} >
      <div className='pdf' id={`pdf-${resenna.id}`}>
          <div className='caja'>
            <h2>{resenna.titulo}</h2>
            <div className='info'>
              <p className='blue'>{resenna.lugar}</p>
              <img src={resenna.logo} alt={null} />
              <div className='columnaExpediente'>
                <p className='marca'>Marca: <span className='blue'><span className='blueMarca'>{resenna.marca}</span></span></p>
                <p className='expediente'>Num. expediente: {resenna.num}</p>
              </div>
            </div>
          </div>
          <div className='portadaSuperior'>
            <div className='left-column'>
              <p id="gris">GEOGRÁFICAS ETRS-89</p>
                <p id='lineas' className='lineaPrimera'>Latitud: <span className='der'>{resenna.latitud}</span></p>
                <p id='lineas'>Longitud: <span className='der'>{resenna.longitud}</span></p>
                <p id='lineas'>Elev. Elipsoidal: <span className='der'>{resenna.elevElip}</span></p>
                <p id='lineas' className='lineaFinal'>Elev. Ortometrica EGM-08: <span className='der'>{resenna.elevOrto}</span></p>
              <p id="gris">UTM ETRS-89 Huso 30 Norte</p>
                <p id='lineas' className='lineaPrimera'>X: <span className='der'>{resenna.x}</span></p>
                <p id='lineas'>Y: <span className='der'>{resenna.y}</span></p>
                <p id='lineas'>Elev. Elipsoidal: <span className='der'>{resenna.elevElip}</span></p>
                <p id='lineas' className="lineaFinal">Elev. Ortometrica EGM-08: <span className='der'>{resenna.elevOrto}</span></p>
              <p id="gris">OBSERVADO POR</p>
              <img className='ofiteat' src="/images/ofiteat.svg"></img>
              <p id='lineaFecha' className='fecha'>Observación: <span className='der'>{resenna.fecha}</span></p>
              <p id="gris">FOTOGRAFÍA GENERAL</p>
              <img id='image2' src={resenna.imagenGeneral} alt={null} />
            </div>
            <div className="right-column">
                <p id="gris">SITUACIÓN</p>
                <img id='image' src={resenna.imagenSituacion} alt={null} />
                <p id="gris">FOTOGRAFÍA DETALLE</p>
                <img id='image2' src={resenna.imagenDetalle} alt={null} />
            </div>
          </div>
      </div>
      <button onClick={openEditModal}>Editar reseña</button>&nbsp;
      <button onClick={() => showDeleteConfirmation(resenna)}>Eliminar reseña</button>&nbsp;
      <button onClick={() => generatePDF(resenna)}>Generar PDF</button>
      <div id={mapContainerId} style={{ height: '400px' }}></div>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} resenna={selectedResennna} />
      {showConfirmation && (
        <div className="confirmation-modal">
          <p>¿Seguro que quiere eliminar esta reseña?</p>
          <button onClick={delResennna}>Sí</button>
          <button onClick={() => setShowConfirmation(false)}>No</button>
        </div>
      )}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} resenna={selectedResennna} />
      {/* Modal de edición */}
      {isEditModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeEditModal}>&times;</span>
            <h2>Editar reseña</h2>
            <form onSubmit={handleEditFormSubmit}>
              {/* Campos de edición */}
              <div className='cajaPrincipal'>
              <div className='grupo'>
                <span className='izqEdit'>Título:</span>
                <input className='derEdit' type="text" name="titulo" value={editedResennna.titulo} onChange={handleEditInputChange} />
              </div>
              <div className='grupo'>
                <span className='izqEdit'>Lugar:</span>
                <input className='derEdit' type="text" name="lugar" value={editedResennna.lugar} onChange={handleEditInputChange} />
              </div>
              <div className='grupo'>
                <span className='izqEdit'>Marca:</span>
                <input className='derEdit' type="text" name="marca" value={editedResennna.marca} onChange={handleEditInputChange} />
              </div>
              <div className='grupo'>
                <span className='izqEdit'>Número de expediente:</span>
                <input className='derEdit' type="text" name="num" value={editedResennna.num} onChange={handleEditInputChange} />
              </div>
              <div className='grupo'>
               <span className='izqEdit'>Latitud:</span>
                <input className='derEdit' type="text" name="latitud" value={editedResennna.latitud} onChange={handleEditInputChange} />
              </div>
              <div className='grupo'>
                <span className='izqEdit'>Longitud:</span>
                <input className='derEdit' type="text" name="longitud" value={editedResennna.longitud} onChange={handleEditInputChange} />
              </div>
              <div className='grupo'>
                <span className='izqEdit'>Elev. Elipsoidal:</span>
                <input className='derEdit' type="text" name="elevElip" value={editedResennna.elevElip} onChange={handleEditInputChange} />
              </div>
              <div className='grupo'>
                <span className='izqEdit'>Elev. Ortometrica EGM-08:</span>
                <input className='derEdit' type="text" name="elevOrto" value={editedResennna.elevOrto} onChange={handleEditInputChange} />
              </div>
              <div className='grupo'>
                <span className='izqEdit'>X:</span>
                <input className='derEdit' type="text" name="x" value={editedResennna.x} onChange={handleEditInputChange} />
              </div>
              <div className='grupo'>
                <span className='izqEdit'>Y:</span>
                <input className='derEdit' type="text" name="y" value={editedResennna.y} onChange={handleEditInputChange} />
              </div>
              <div className='grupo'>
               <span className='izqEdit'>Fecha:</span>
                <input className='derEdit' type="text" name="fecha" value={editedResennna.fecha} onChange={handleEditInputChange} />
              </div>
              {/* Input para imágenes */}
              <div className='grupo'>
                <span className='izqEdit'>Imagen Logo:</span>
                <input className='derEdit' type="file" accept="image/*" name="logo" onChange={handleImageInputChange} />
              </div>
              <div className='grupo'>
                <span className='izqEdit'>Imagen Situación:</span>
                <input className='derEdit' type="file" accept="image/*" name="imagenSituacion" onChange={handleImageInputChange} />
              </div>
              <br />
              <div className='grupo'>
                <span className='izqEdit'>Imagen Detalle:</span>
                <input className='derEdit' type="file" accept="image/*" name="imagenDetalle" onChange={handleImageInputChange} />
              </div>
              <br />
              <div className='grupo'>
                <span className='izqEdit'>Imagen General:</span>
                <input className='derEdit' type="file" accept="image/*" name="imagenGeneral" onChange={handleImageInputChange} />
              </div>
              <br />
              <button className="guardar" type="submit">Guardar cambios</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Resennna;
