import { useEffect, useState } from 'react';
import Resennna from './Resenna';
import { getResenna } from '../../api/resennaApi';
import { AuthContext, useAuth } from '../Context/AuthProvider';
import { useContext } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';


function ResennnaList({ onDeleteResennna, searchTerm }) {
  const { resenna, setResennna } = useAuth();

  const downloadResennna = async () => {
    const resennaData = await getResenna();
    setResennna(resennaData);
  };

  useEffect(() => {
    downloadResennna();
  }, []);

  const filteredResennas = resenna.filter(resenna =>
    resenna.num.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="App">
      <div className='results'>
        {
          filteredResennas.length === 0 ?
            <p>No se han encontrado reseñas</p>
            :
            filteredResennas.map(resenna =>
              <Resennna key={resenna.num} resenna={resenna} onDeleteResennna={onDeleteResennna} allResennas={filteredResennas} />
            )
        }
      </div>
    </div>
  );
}

export default ResennnaList;