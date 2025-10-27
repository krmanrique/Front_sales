import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminDashboard.css';

const API_BASE = 'http://localhost:5000';

const AdminDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [productsCount, setProductsCount] = useState(null);
  const [ordersCount, setOrdersCount] = useState(null);
  const [error, setError] = useState('');

  const isAdmin = useMemo(() => {
    // Ajusta según tu estructura de usuario
    return user?.role === 'admin' || user?.isAdmin === true || true; // quita el "true" si ya manejas roles
  }, [user]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const tk = localStorage.getItem('token');

        // Productos: intenta /products/count, si no existe, hace GET /products y cuenta
        const prodResCount = await fetch(`${API_BASE}/products/count`, {
          headers: tk ? { Authorization: `Bearer ${tk}` } : {}
        });
        if (prodResCount.ok) {
          const d = await prodResCount.json();
          setProductsCount(d?.count ?? null);
        } else {
          const prodRes = await fetch(`${API_BASE}/products`, {
            headers: tk ? { Authorization: `Bearer ${tk}` } : {}
          });
          if (prodRes.ok) {
            const arr = await prodRes.json();
            setProductsCount(Array.isArray(arr) ? arr.length : null);
          } else {
            setProductsCount(null);
          }
        }

        // Órdenes: intenta /orders/count, si no existe, GET /orders y cuenta
        const ordResCount = await fetch(`${API_BASE}/orders/count`, {
          headers: tk ? { Authorization: `Bearer ${tk}` } : {}
        });
        if (ordResCount.ok) {
          const d = await ordResCount.json();
          setOrdersCount(d?.count ?? null);
        } else {
          const ordRes = await fetch(`${API_BASE}/orders`, {
            headers: tk ? { Authorization: `Bearer ${tk}` } : {}
          });
          if (ordRes.ok) {
            const arr = await ordRes.json();
            const list = Array.isArray(arr?.orders) ? arr.orders : Array.isArray(arr) ? arr : [];
            setOrdersCount(list.length);
          } else {
            setOrdersCount(null);
          }
        }
      } catch (e) {
        console.error(e);
        setError('No fue posible cargar métricas.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (!isAdmin) {
    return (
      <div className="dash-container">
        <h2>Acceso restringido</h2>
        <p>No tienes permisos para ver este módulo.</p>
      </div>
    );
  }

  return (
    <div className="dash-container">
      <h2>Dashboard Administrativo</h2>
      {error && <div className="dash-error">{error}</div>}

      <div className="dash-grid">
        <button className="dash-card" onClick={() => navigate('/products')}>
          <div className="dash-card-top">
            <span className="dash-card-title">Productos</span>
            <span className="dash-card-emoji">📦</span>
          </div>
          <div className="dash-card-body">
            {loading ? (
              <span className="dash-muted">Cargando…</span>
            ) : productsCount != null ? (
              <strong className="dash-kpi">{productsCount}</strong>
            ) : (
              <span className="dash-muted">—</span>
            )}
          </div>
          <div className="dash-card-footer">Ver listado</div>
        </button>

        <button className="dash-card" onClick={() => navigate('/orders')}>
          <div className="dash-card-top">
            <span className="dash-card-title">Órdenes</span>
            <span className="dash-card-emoji">🧾</span>
          </div>
          <div className="dash-card-body">
            {loading ? (
              <span className="dash-muted">Cargando…</span>
            ) : ordersCount != null ? (
              <strong className="dash-kpi">{ordersCount}</strong>
            ) : (
              <span className="dash-muted">—</span>
            )}
          </div>
          <div className="dash-card-footer">Ver total / detalle</div>
        </button>

        <button className="dash-card" onClick={() => navigate('/inventory')}>
          <div className="dash-card-top">
            <span className="dash-card-title">Crear Producto</span>
            <span className="dash-card-emoji">➕</span>
          </div>
          <div className="dash-card-body">
            <span className="dash-muted">Ir al formulario</span>
          </div>
          <div className="dash-card-footer">Abrir Inventory</div>
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
