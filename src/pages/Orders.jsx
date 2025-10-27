import React, { useEffect, useMemo, useState } from 'react';
import '../styles/AdminDashboard.css';
import { useNavigate } from 'react-router-dom';


const API_BASE = 'https://back-sales-tau.vercel.app';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const navigate = useNavigate();
  

  const totalOrders = orders.length;

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setErr('');
        const tk = localStorage.getItem('token');

        // Soporta varias formas de respuesta
        const res = await fetch(`${API_BASE}/orders`, {
          headers: tk ? { Authorization: `Bearer ${tk}` } : {}
        });
        if (!res.ok) throw new Error('No se pudo cargar órdenes');

        const payload = await res.json();
        const list = Array.isArray(payload?.orders)
          ? payload.orders
          : Array.isArray(payload)
          ? payload
          : [];

        setOrders(list);
      } catch (e) {
        console.error(e);
        setErr('Error cargando órdenes.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const currency = (n) => Number(n || 0).toFixed(2);

  return (
    <div className="dash-container">
      <div className="dash-header-row">
        <h2>Órdenes</h2>
        <div className="dash-pill">Total: {totalOrders}</div>
        <button className="back-btn" onClick={() => navigate('/adminDashboard')}>
          ← Volver
        </button>
      </div>

      {err && <div className="dash-error">{err}</div>}

      {loading ? (
        <p>Cargando…</p>
      ) : (
        <div className="orders-list">
          {orders.map((o, idx) => {
            // Campos comunes/robustos
            const id = o._id || o.id || `#${idx + 1}`;
            const items = o.items || o.products || [];
            const total =
              o.totalAmount ??
              items.reduce(
                (acc, it) => acc + (it.price || it.unitPrice || 0) * (it.quantity || it.qty || 0),
                0
              );
            const createdAt = o.createdAt ? new Date(o.createdAt) : null;

            return (
              <div className="order-row" key={id}>
                <div className="order-left">
                  <div className="order-id">Pedido #{id}</div>
                  <div className="order-sub">
                    {createdAt ? createdAt.toLocaleString() : '—'} • {items.length} ítem(s)
                  </div>
                </div>
                <div className="order-right">
                  <div className="order-total">${currency(total)}</div>
                </div>
              </div>
            );
          })}
          {orders.length === 0 && <p className="dash-muted">No hay órdenes.</p>}
        </div>
      )}
    </div>
  );
};

export default Orders;
