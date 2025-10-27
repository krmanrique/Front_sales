import React, { useEffect, useState } from 'react';
import '../styles/AdminDashboard.css';
import { useNavigate } from 'react-router-dom';


const API_BASE = 'https://back-sales-tau.vercel.app/';

const Products = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setErr('');
        const tk = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/products`, {
          headers: tk ? { Authorization: `Bearer ${tk}` } : {}
        });
        if (!res.ok) throw new Error('No se pudo cargar productos');
        const arr = await res.json();

        // añadimos campos locales para edición sin dañar tu data original
        const withLocal = (Array.isArray(arr) ? arr : []).map(p => ({
          ...p,
          _tempStock: Number(p.stock || 0),
          _dirty: false,
          _saving: false,
          _saveErr: ''
        }));
        setData(withLocal);
      } catch (e) {
        console.error(e);
        setErr('Error cargando productos.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const adjustStock = (id, delta) => {
    setData(prev =>
      prev.map(p =>
        p._id === id
          ? {
              ...p,
              _tempStock: Math.max(0, Number(p._tempStock) + delta),
              _dirty: true,
              _saveErr: ''
            }
          : p
      )
    );
  };

  const setStockValue = (id, val) => {
    const n = Math.max(0, Number.isNaN(Number(val)) ? 0 : Number(val));
    setData(prev =>
      prev.map(p =>
        p._id === id ? { ...p, _tempStock: n, _dirty: true, _saveErr: '' } : p
      )
    );
  };

  const saveStock = async (prod) => {
    try {
      setData(prev =>
        prev.map(p => (p._id === prod._id ? { ...p, _saving: true, _saveErr: '' } : p))
      );

      const tk = localStorage.getItem('token');
      // Ajusta este endpoint si tu API usa otra ruta o método
      const res = await fetch(`${API_BASE}/products/${prod._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(tk ? { Authorization: `Bearer ${tk}` } : {})
        },
        body: JSON.stringify({ stock: Number(prod._tempStock) })
      });

      if (!res.ok) throw new Error('No se pudo guardar el stock');

      // éxito → sincronizamos stock real con el temporal
      setData(prev =>
        prev.map(p =>
          p._id === prod._id
            ? { ...p, stock: Number(p._tempStock), _dirty: false, _saving: false, _saveErr: '' }
            : p
        )
      );
    } catch (e) {
      console.error(e);
      setData(prev =>
        prev.map(p =>
          p._id === prod._id ? { ...p, _saving: false, _saveErr: 'Error al guardar.' } : p
        )
      );
    }
  };

  return (
    <div className="dash-container">
      <div className="dash-header-row">
        <h2>Productos</h2>
        <button className="back-btn" onClick={() => navigate('/adminDashboard')}>
          ← Volver
        </button>
    </div>

      {err && <div className="dash-error">{err}</div>}

      {loading ? (
        <p>Cargando…</p>
      ) : (
        <div className="products-grid">
          {data.map(p => (
            <div key={p._id} className="product-card">
              <img
                src={p.imageUrl || '/../img/meat.jpg'}
                alt={p.name}
                className="product-image"
              />

              <h4>{p.name}</h4>
              <p>Precio: ${Number(p.price || 0).toFixed(2)}</p>

              <p className={p._tempStock <= 0 ? 'stock-out' : 'stock-in'}>
                Stock actual: {p.stock}
              </p>

              {/* Controles de stock */}
              <div className="qty-ctrl">
                <button
                  className="qty-btn"
                  onClick={() => adjustStock(p._id, -1)}
                  disabled={p._saving || p._tempStock <= 0}
                  title="Restar 1"
                >
                  −
                </button>

                <input
                  type="number"
                  min="0"
                  value={p._tempStock}
                  onChange={(e) => setStockValue(p._id, e.target.value)}
                  className="qty-input"
                  disabled={p._saving}
                />

                <button
                  className="qty-btn"
                  onClick={() => adjustStock(p._id, +1)}
                  disabled={p._saving}
                  title="Sumar 1"
                >
                  +
                </button>
              </div>

              {/* Botón Guardar */}
              <button
                className="save-btn"
                onClick={() => saveStock(p)}
                disabled={!p._dirty || p._saving}
              >
                {p._saving ? 'Guardando…' : 'Guardar cambios'}
              </button>

              {p._saveErr && <div className="dash-error" style={{marginTop: '.5rem'}}>{p._saveErr}</div>}
            </div>
          ))}

          {data.length === 0 && <p className="dash-muted">No hay productos.</p>}
        </div>
      )}
    </div>
  );
};

export default Products;
