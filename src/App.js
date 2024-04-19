import React, { useState } from 'react';
import ResennnaList from './components/resennas/ResennasList';
import ResennnaForm from './components/formulario/ResennaForm';
import './App.css';
import { useAuth } from './components/Context/AuthProvider';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import LoginForm from './components/login/LoginForm';
import ErrorComponent from './components/rutas/ErrorComponent';
import Info from './components/Info/Info';
import PrivateRoute from './components/login/PrivateRoute';
import RegisterForm from './components/login/RegisterForm';
import {Link } from 'react-router-dom';


function App() {
  
  const {onSaveResennna, onDeleteResennna, logout} = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
  };

  return (
    <BrowserRouter>
      <div className="App">
        <nav className='encabezado'>
        <input className="buscador" type="text" placeholder=" Buscar por expediente" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <NavLink className="ruta" to="/">Lista de Reseñas</NavLink>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <NavLink className="ruta" to="/nuevo">Añadir Reseña</NavLink>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Link className="ruta" to="/" onClick={handleLogout}>Cerrar Sesión</Link>
        </nav>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/registro" element={<RegisterForm />} />
          <Route path="/" exact element={<><PrivateRoute>
            <ResennnaList onDeleteResennna={onDeleteResennna} searchTerm={searchTerm} /></PrivateRoute></>} />
          <Route path='/:resennaId' element={<PrivateRoute><Info /></PrivateRoute>} />
          <Route path="/nuevo" element={<PrivateRoute><ResennnaForm onSaveResennna={onSaveResennna} /></PrivateRoute>} />
          <Route path="*" element={<ErrorComponent />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
