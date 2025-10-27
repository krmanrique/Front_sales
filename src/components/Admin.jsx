// src/pages/Admin.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Admin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    // 1) Si viene desde Order con navigate state
    const fromState = location?.state?.orderSummary;
    if (fromState && typeof fromState === 'object') {
      setSummary(fromState);
      try { localStorage.setItem('last_order_summary', JSON.stringify(fromState)); } catch {}
      return;
    }
    // 2) Respaldo desde localStorage
    const saved = localStorage.getItem('last_order_summary');
    if (saved) {
      try { setSummary(JSON.parse(saved)); } catch {}
    }
  }, [location?.state]);

  const handleClose = () => {
    // si no quieres que reaparezca el banner
    localStorage.removeItem('last_order_summary');
    setSummary(null);
    navigate('/', { replace: true }); // <- te devuelve al "/"
  };

  return (
    <div style={{ padding: '1.25rem' }}>
      {summary && (
        <div
          style={{
            background: '#0f172a',
            color: '#f8fafc',
            border: '1px solid #1e293b',
            borderRadius: 12,
            padding: '1rem 1.25rem',
            marginBottom: '1rem',
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
            maxWidth: 720,
            marginInline: 'auto',
            textAlign: 'center',
          }}
        >
          <h3 style={{ margin: 0, marginBottom: '.5rem' }}>
            ¡Gracias por tu compra!
          </h3>

          <p style={{ marginTop: 0 }}>
            {summary.orderId
              ? <>Tu pedido <strong>#{summary.orderId}</strong> </>
              : 'Tu pedido '}
            tiene <strong>{summary.totalItems ?? 0}</strong>{' '}
            {(summary.totalItems ?? 0) === 1 ? 'artículo' : 'artículos'} por un total de{' '}
            <strong>${Number(summary.totalAmount ?? 0).toFixed(2)}</strong>. ¡Vuelve pronto!
          </p>

          {Array.isArray(summary.items) && summary.items.length > 0 && (
            <ul style={{ margin: '0.5rem 0 0.75rem 1.25rem', textAlign: 'left' }}>
              {summary.items.map((it, idx) => (
                <li key={idx}>
                  {it.name} × {it.qty} — ${Number(it.lineTotal || 0).toFixed(2)}
                </li>
              ))}
            </ul>
          )}

          <button
            onClick={handleClose}
            style={{
              background: '#10b981',
              color: '#0b1118',
              border: 'none',
              borderRadius: 8,
              padding: '.5rem .75rem',
              cursor: 'pointer',
              fontWeight: 600,
              marginTop: '.5rem',
            }}
          >
            Cerrar
          </button>
        </div>
      )}

    </div>
  );
};

export default Admin;
