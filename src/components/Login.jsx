import "../styles/Login.css";
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [gmail, setGmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!gmail || !password) {
      setErrorMessage("Por favor ingrese el correo y la contraseña.");
      return;
    }
    if (!gmail.includes("@") || !gmail.includes(".")) {
      setErrorMessage("Por favor, escribe un correo válido.");
      return;
    }

    try {
      const response = await fetch("https://back-sales-tau.vercel.app/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gmail, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("isAdmin", data.isAdmin);
        setErrorMessage("");

        // OJO: revisa que tu ruta sea /inventory (en minúsculas)
        if (data.isAdmin) navigate("/AdminDashboard");
        else navigate("/order");
      } else {
        setErrorMessage(data.error || "Error en el login.");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Error al iniciar sesión.");
    }
  };

  return (
    <section className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Iniciar sesión</h1>

        <form className="auth-form" onSubmit={handleLogin} noValidate>
          <input
            type="email"
            className="auth-input"
            placeholder="Email"
            value={gmail}
            onChange={(e) => setGmail(e.target.value)}
            autoComplete="email"
            required
          />

          <input
            type="password"
            className="auth-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />

          <button type="submit" className="auth-submit">
            Iniciar sesión
          </button>

          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </form>

        <p className="auth-helper">
          ¿No tienes cuenta?
          <button className="auth-link" onClick={() => navigate("/register")}>
            Regístrate
          </button>
        </p>
      </div>
    </section>
  );
};

export default Login;
