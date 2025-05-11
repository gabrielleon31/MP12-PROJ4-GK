// client/src/Pages/Auth/Auth.js - CORREGIDO (Importado useEffect)

// --- Importar React, useState, useEffect ---
import React, { useState, useEffect } from 'react'; // <-- Importar useEffect aquí
// --- Fin Importación React Hooks ---

import './Auth.css';
import { useDispatch, useSelector } from 'react-redux';
import { logIn, signUp } from '../../actions/AuthAction';
// --- Importar Link y useLocation ---
import { Link, useLocation } from 'react-router-dom';
// --- Fin Importación react-router-dom ---


const Auth = () => {
  const FRONTEND_STATIC_FOLDER = process.env.PUBLIC_URL + '/Img/';

  // Determinar si es vista de SignUp basado en la URL
  const location = useLocation();
  const isSignUp = location.pathname === '/signup';
  // Ya no usamos estado local para isSignUp

  const dispatch = useDispatch();
  const loading = useSelector((state) => state.authReducer.loading);
  // Estado de data se mantiene para los inputs del formulario
  const [data, setData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmpass: '',
  });
  const [confirmPass, setConfirmPass] = useState(true);


  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignUp) {
      data.password === data.confirmpass
        ? dispatch(signUp(data))
        : setConfirmPass(false);
    } else {
      const loginData = {
        email: data.email.trim(),
        password: data.password.trim()
     };
      console.log("Sending login data:", loginData);
      dispatch(logIn(data));
    }
  };

  const resetForm = () => {
    setConfirmPass(true);
    setData({
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      confirmpass: '',
    });
  };

  // useEffect para resetear el formulario cuando la URL cambie entre /login y /signup
  useEffect(() => {
      console.log("Auth useEffect: Location pathname changed to", location.pathname, ". Resetting form.");
      resetForm();
      // También puedes querer resetear los mensajes de error o estados de carga específicos del formulario si los tienes
      // Por ejemplo: dispatch(resetAuthError());
  }, [location.pathname]); // Dependencia: solo se ejecuta cuando location.pathname cambia


  return (
    <div className="Auth">
      <div className="a-left">
        <img src={FRONTEND_STATIC_FOLDER + 'logo.png'} alt="Logo" />
        <div className="Webname">
          <h2>Welcome !</h2>
          <h5>
            Explore the ideas throughout
            <br /> the world.
          </h5>
        </div>
      </div>

      <div className="a-right">
        <form className="infoForm authForm" onSubmit={handleSubmit}>
          <h2>{isSignUp ? 'Sign Up' : 'Log In'}</h2>

          {isSignUp && (
            <div className="name-group">
              <input
                type="text"
                placeholder="First Name"
                className="infoInput"
                name="firstname"
                onChange={handleChange}
                value={data.firstname}
              />
              <input
                type="text"
                placeholder="Last Name"
                className="infoInput"
                name="lastname"
                onChange={handleChange}
                value={data.lastname}
              />
            </div>
          )}

          <input
            type="email"
            placeholder="Email"
            className="infoInput"
            name="email"
            onChange={handleChange}
            value={data.email}
          />

          <div className="password-group">
            <input
              type="password"
              placeholder="Password"
              className="infoInput"
              name="password"
              onChange={handleChange}
              value={data.password}
            />
            {isSignUp && (
              <input
                type="password"
                placeholder="Confirm Password"
                className="infoInput"
                name="confirmpass"
                onChange={handleChange}
                value={data.confirmpass}
              />
            )}
          </div>

          {!confirmPass && (
            <span className="error-msg">
              * Confirm Password is not same
            </span>
          )}

          <span className="switch-auth">
            {isSignUp
              ? ( // Si estamos en la URL /signup
                  <>Already have an account?{" "}
                     {/* Este Link NAVEGARÁ a /login */}
                     <Link to="/login" className="auth-link">
                         Login here
                     </Link>
                  </>
                )
              : ( // Si estamos en la URL /login
                  <>Don't have an account?{" "}
                     {/* Este Link NAVEGARÁ a /signup */}
                     <Link to="/signup" className="auth-link">
                        SignUp here
                     </Link>
                  </>
                )
            }
          </span>


          <button
            className="button infoButton"
            type="submit"
            disabled={loading}
          >
            {loading
              ? 'Loading...'
              : isSignUp
              ? 'Sign Up'
              : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;