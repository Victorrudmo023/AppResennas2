import React from 'react';
import {useState, useEffect } from 'react';
import { getResennaOne } from '../../api/resennaApi'
import { useParams } from 'react-router-dom';

const Info = () => {

    const [resenna, setResennna] = useState({});
    const [error, setError] = useState(false);
    const {resennaId} = useParams();

    const downloadResennna = async (resennaId) => {
        const response = await getResennaOne(resennaId);
        if (response) {
          setResennna(response);
          setError(false);
        } else {
          setError(true);
        }
    };
    
    useEffect(()=>{
        downloadResennna(resennaId);
    }, [resennaId]);

  return (
    !resenna ? 
            <p>No se ha podido cargar la reseña</p>
        : 
    <div>
      <h1>Titulo: {resenna.titulo}</h1>
      <p>Lugar: {resenna.lugar}</p>
      <p>Marca: {resenna.marca}</p>
      <p>Número de expediente: {resenna.num}</p>
      <p>Latitud: {resenna.latitud}</p>
      <p>Longitud: {resenna.longitud}</p>
      <p>Elevación Elip: {resenna.elevElip}</p>
      <p>Elevación Orto: {resenna.elevOrto}</p>
      <p>X: {resenna.x}</p>
      <p>Y: {resenna.y}</p>
      <p>Fecha: {resenna.fecha}</p>
      <img src={resenna.imagenSituacion} height="100" width="50" alt={`Imagen de ${resenna.titulo}`} />
      <img src={resenna.logo} height="100" width="50" alt={`Imagen de ${resenna.titulo}`} />
      <img src={resenna.imagenDetalle} height="100" width="50" alt={`Imagen de ${resenna.titulo}`} />
      <img src={resenna.imagenGeneral} height="100" width="50" alt={`Imagen de ${resenna.titulo}`} />
    </div>
  );
}

export default Info;







