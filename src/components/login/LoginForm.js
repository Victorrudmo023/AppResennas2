import { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthProvider";
import { useNavigate, Link } from "react-router-dom";
import './Form.css';
import './LoginForm.css';

function LoginForm() {
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const {login, state} = useAuth();
    const navigate = useNavigate();
  
  
    useEffect(() => {
      if (state.isAuthenticated) {
        navigate('/');
      }
      if (state.loginError) {
        setError(state.loginError);
      }
    }, [state.isAuthenticated, state.loginError, navigate]);
  
    useEffect(() => {
      setError('');
    }, [user, password]);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      if (!user || !password) {
        setError('Por favor, ingrese el usuario y la contraseña');
        return;
      }
  
      login(user, password);
    };

    useEffect(() => {
      if (state.isAuthenticated) {
        navigate('/');
      }
    }, [state.isAuthenticated, navigate]);
  
    return (
      <div className="login-form-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Iniciar Sesión</h2>
          <div className="form-control">
            <label htmlFor="user">Usuario</label>
            <input
              type="text"
              name="text"
              id="user"
              value={user}
              onChange={(e) => { setUser(e.target.value) }}
            />
          </div>
          <div className="form-control">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value) }}
            />
          </div>
          <div className='form-control'>
            {error && <div className='form-error'>Credenciales incorrectas</div>}
            <button type="submit">Iniciar Sesión</button>
          </div>
          <div className='link-container'>
            <Link to="/registro" className='link'>Registrarse</Link>
          </div>
        </form>
      </div>
    );
  }
  
  export default LoginForm;
  