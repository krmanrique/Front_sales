import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "../styles/Register.css"; // reutilizamos el mismo CSS

const Register = () => {
  const [username, setUsername] = useState('');
  const [gmail, setGmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username || !gmail || !password) {
      setErrorMessage("Completa todos los campos.");
      return;
    }
    if (!gmail.includes("@") || !gmail.includes(".")) {
      setErrorMessage("Por favor, escribe un correo válido.");
      return;
    }

    try {
      const response = await fetch('https://back-sales-tau.vercel.app/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, gmail, password }),
      });
      
      if (response.ok) {
        setErrorMessage('');
        setIsRegistered(true);
        // redirigir de una vez
        navigate('/');
      } else {
        setErrorMessage('Error al registrar usuario');
      }
    } catch (error) {
      setErrorMessage('Error en el registro');
    }
  };

  return (
    <section className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Crear cuenta</h1>

        <form className="auth-form" onSubmit={handleRegister} noValidate>
          <input
            type="text"
            className="auth-input"
            placeholder="Nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />

          <input
            type="email"
            className="auth-input"
            placeholder="Correo electrónico"
            value={gmail}
            onChange={(e) => setGmail(e.target.value)}
            autoComplete="email"
            required
          />

          <input
            type="password"
            className="auth-input"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
          />

          <button type="submit" className="auth-submit">Registrar</button>

          {errorMessage && <p className="error-message">{errorMessage}</p>}
          {isRegistered && <p className="auth-success">Registro exitoso. Ahora puedes iniciar sesión.</p>}
        </form>

        <p className="auth-helper">
          ¿Ya tienes cuenta?
          <button className="auth-link" onClick={() => navigate('/')}>
            Inicia sesión
          </button>
        </p>
      </div>
    </section>
  );
};

export default Register;
