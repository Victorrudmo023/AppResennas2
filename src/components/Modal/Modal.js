import React from 'react';
import './Modal.css'; 

const Modal = ({ isOpen, onClose, resenna }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <h1>{resenna.titulo}</h1>
      <p>{resenna.lugar.slice(0, 100)}</p>
      <p>{resenna.marca.slice(0, 100)}</p>
      <p>{resenna.num.slice(0, 100)}</p>
      <p>{resenna.latitud.slice(0, 100)}</p>
      <p>{resenna.longitud.slice(0, 100)}</p>
      <p>{resenna.elevElip.slice(0, 100)}</p>
      <p>{resenna.elevOrto.slice(0, 100)}</p>
      <p>{resenna.x.slice(0, 100)}</p>
      <p>{resenna.y.slice(0, 100)}</p>
      <p>{resenna.fecha.slice(0, 100)}</p>
      <img src={resenna.imagenSituacion} height="100" width="50" alt={""} />
      <img src={resenna.logo} height="100" width="50" alt={""} />
      <img src={resenna.imagenDetalle} height="100" width="50" alt={""} />
      <img src={resenna.imagenGeneral} height="100" width="50" alt={""} />
        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default Modal;
