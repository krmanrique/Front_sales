import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import '../styles/Inventory.css';

const Inventory = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [available, setAvailable] = useState(true);
  const [isCreated, setIsCreated] = useState(false);
  const navigate = useNavigate();

  const handleInventory = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://back-sales-tau.vercel.app/products/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          price: Number(price),
          stock: Number(stock),
          imageUrl,
          available
        }),
      });

      if (response.ok) {
        setIsCreated(true);
        navigate('/AdminDashboard');
      } else {
        alert('Error al crear producto');
      }
    } catch (error) {
      alert('Error en la creación del producto');
    }
  };

  return (
    <div className="inv-container">
      <div className="inv-card">
        <h2 className="inv-title">Módulo de inventario</h2>

        <form onSubmit={handleInventory} className="inv-form">
          <input
            type="text"
            className="inv-input"
            placeholder="Nombre del producto"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="number"
            className="inv-input"
            placeholder="Precio del producto"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            min="0"
            step="0.01"
            required
          />

          <input
            type="number"
            className="inv-input"
            placeholder="Stock del producto"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            min="0"
            step="1"
            required
          />

          <input
            type="text"
            className="inv-input"
            placeholder="Pon URL de la imagen del producto"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            required
          />

          <label className="inv-check">
            <input
              type="checkbox"
              className="inv-checkbox"
              checked={available}
              onChange={(e) => setAvailable(e.target.checked)}
            />
            Disponible para la venta
          </label>

          <button type="submit" className="inv-submit">Crear producto</button>
        </form>

        {isCreated && <p className="inv-success">Producto creado con éxito.</p>}
      </div>
    </div>
  );
};

export default Inventory;
