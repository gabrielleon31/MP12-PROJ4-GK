// client/src/App.js - CORREGIDO (Sin Router anidado y sin error de sintaxis en Catch-all)

import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
// --- Importar Routes, Route, Navigate, useLocation ---
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
// --- Fin Importación ---
import './App.css';

import Auth from './Pages/auth/Auth'; // Página de Login/Registro
import Home from './Pages/home/Home'; // Página principal (Feed)
import Profile from './Pages/profile/Profile'; // Página de Perfil de usuario
import SinglePostPage from './Pages/SinglePostPage/SinglePostPage'; // Página para ver un solo post
import ChatPage from './Pages/ChatPage/ChatPage'; // Página de Chat
import AdminPage from './Pages/AdminPage/AdminPage'; // Página de Administración

// NOTA: BrowserRouter debe envolver el componente App en src/index.js


function App() {
  const { user, token } = useSelector(state => state.authReducer.authData) || {};


  return (
    <div className="App">
      <div className="blur" style={{ top: '-18%', right: 0 }} />
      <div className="blur" style={{ top: '36%', left: '-8rem' }} />

      <Routes>
        {/* Ruta raíz: redirige a /home si logueado, a /signup si no */}
        <Route
          path="/"
          element={token ? <Navigate to="/home" /> : <Navigate to="/signup" />}
        />

        {/* Rutas para LOGIN Y SIGNUP */}
        {/* Ruta de Login: si ya está logueado va a home, si no a login (renderiza Auth) */}
        <Route
          path="/login"
          element={token ? <Navigate to="/home" /> : <Auth />}
        />
        {/* Ruta de Registro: si ya está logueado va a home, si no a signup (renderiza Auth) */}
        <Route
          path="/signup"
          element={token ? <Navigate to="/home" /> : <Auth />}
        />


        {/* Rutas de la aplicación principal (protegidas) */}
        {/* Home */}
        <Route
          path="/home"
          element={token ? <Home /> : <Navigate to="/signup" />}
        />
        {/* Perfil de usuario */}
        <Route
          path="/profile/:id"
          element={token ? <Profile /> : <Navigate to="/signup" />}
        />
        {/* Single Post Page */}
        <Route
          path="/post/:postId"
          element={token ? <SinglePostPage /> : <Navigate to="/signup" />}
        />
        {/* Chat Page */}
        <Route
          path="/chat"
          element={token ? <ChatPage /> : <Navigate to="/signup" />}
        />
        {/* Admin Page */}
        <Route
            path="/admin"
            element={token ? <AdminPage /> : <Navigate to="/signup" />}
         />


        {/* Ruta Catch-all para rutas no encontradas */}
        {/* Redirige a home (si logueado) o a signup (si no logueado) si la ruta no coincide */}
         {/* *** ERROR DE SINTAXIS CORREGIDO AQUÍ *** */}
         <Route path="*" element={token ? <Navigate to="/home" /> : <Navigate to="/signup" />} /> {/* <-- Error de sintaxis resuelto */}

      </Routes>
    </div>
  );
}

export default App;