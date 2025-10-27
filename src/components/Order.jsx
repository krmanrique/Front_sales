// src/pages/Order.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import '../styles/Order.css';
import Cart from "./Cart";

const Order = ({ user, token }) => {
  const [products, setProducts] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Cargar productos
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/products');
        if (!response.ok) throw new Error('Error al cargar productos');
        const data = await response.json();
        console.log(data);
        setProducts(data);
      } catch (error) {
        console.error('Error al cargar productos:', error);
        alert('Error al cargar los productos');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Persistencia del carrito
  useEffect(() => {
    const saved = localStorage.getItem("cart_items");
    if (saved) setSelectedItems(JSON.parse(saved));
  }, []);
  useEffect(() => {
    localStorage.setItem("cart_items", JSON.stringify(selectedItems));
  }, [selectedItems]);

  const findProductById = (id) => products.find(p => p._id === id);

  const handleAddItem = (product) => {
    if (product.stock <= 0) {
      alert('Producto sin stock disponible');
      return;
    }
    const existing = selectedItems.find(i => i.productId === product._id);
    if (existing) {
      if (existing.quantity >= product.stock) {
        alert('No hay más stock disponible');
        return;
      }
      setSelectedItems(selectedItems.map(i =>
        i.productId === product._id ? { ...i, quantity: i.quantity + 1 } : i
      ));
    } else {
      setSelectedItems([...selectedItems, {
        productId: product._id,
        quantity: 1,
        price: product.price,
        productName: product.name
      }]);
    }
  };

  const handleIncrease = (productId) => {
    const product = findProductById(productId);
    const item = selectedItems.find(i => i.productId === productId);
    if (!product || !item) return;

    if (item.quantity >= product.stock) {
      alert('No hay más stock disponible');
      return;
    }
    setSelectedItems(selectedItems.map(i =>
      i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i
    ));
  };

  const handleDecrease = (productId) => {
    const item = selectedItems.find(i => i.productId === productId);
    if (!item) return;
    if (item.quantity === 1) {
      setSelectedItems(selectedItems.filter(i => i.productId !== productId));
    } else {
      setSelectedItems(selectedItems.map(i =>
        i.productId === productId ? { ...i, quantity: i.quantity - 1 } : i
      ));
    }
  };

  const handleRemoveItem = (productId) => {
    setSelectedItems(selectedItems.filter(item => item.productId !== productId));
  };

  // Totales (para el resumen que mandaremos a Admin)
  const totalPrice = selectedItems.reduce((t, i) => t + i.price * i.quantity, 0);
  const totalItems = selectedItems.reduce((t, i) => t + i.quantity, 0);

  const handleCreateOrder = async () => {
    if (selectedItems.length === 0) {
      alert('Agrega al menos un producto al pedido');
      return;
    }

    // Solo enviamos lo necesario al backend
    const items = selectedItems.map(({ productId, quantity }) => ({ productId, quantity }));

    try {
      const tk = localStorage.getItem('token') || token;
      const response = await fetch('http://localhost:5000/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tk}`
        },
        body: JSON.stringify({ items })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Pedido creado con éxito:', data);

        // Resumen compacto para Admin (sin datos de usuario)
        const orderSummary = {
          orderId: data?.order?._id || data?._id || null,
          totalItems,
          totalAmount: totalPrice,
          items: selectedItems.map(i => ({
            name: i.productName,
            qty: i.quantity,
            lineTotal: i.price * i.quantity
          }))
        };

        // Guardar por si recarga Admin
        localStorage.setItem('last_order_summary', JSON.stringify(orderSummary));

        // Vaciar carrito
        setSelectedItems([]);
        localStorage.removeItem("cart_items");

        // Navegar a Admin enviando el resumen en el estado
        navigate('/Admin', { state: { orderSummary } });
      } else {
        const error = await response.json();
        alert(error.message || 'Error al crear el pedido');
      }
    } catch (error) {
      alert('Error de conexión al crear el pedido');
      console.error(error);
    }
  };

  return (
    <div className="ventas-container">
      <h2>Módulo de Ventas</h2>

      {loading ? (
        <p>Cargando productos...</p>
      ) : (
        <>
          <div className="products-grid">
            {products.map((product) => (
              <div key={product._id} className="product-card">
                <img
                  src={product.imageUrl || '/../img/meat.jpg'}
                  alt={product.name}
                  className="product-image"
                />
                <h4>{product.name}</h4>
                <p>Precio: ${(product.price).toFixed(2)}</p>
                <p className={product.stock <= 0 ? 'stock-out' : 'stock-in'}>
                  Stock: {product.stock}
                </p>
                <button
                  type="button"
                  onClick={() => handleAddItem(product)}
                  className="add-button"
                  disabled={product.stock <= 0}
                >
                  {product.stock <= 0 ? 'Sin Stock' : 'Agregar al pedido'}
                </button>
              </div>
            ))}
          </div>

          {/* Resumen bajo la grilla (opcional) */}
          <div className="cart-summary">
            <h3>Productos seleccionados</h3>
            {selectedItems.length === 0 ? (
              <p>No has agregado productos al pedido.</p>
            ) : (
              <>
                <ul>
                  {selectedItems.map((item) => (
                    <li key={item.productId}>
                      {item.productName} - Cantidad: {item.quantity} - Precio: ${ (item.price * item.quantity).toFixed(2) }
                      <button type="button" onClick={() => handleDecrease(item.productId)} className="remove-button">−</button>
                      <button type="button" onClick={() => handleIncrease(item.productId)} className="remove-button">+</button>
                      <button type="button" onClick={() => handleRemoveItem(item.productId)} className="remove-button">Eliminar</button>
                    </li>
                  ))}
                </ul>
                <h4>Total: ${totalPrice.toFixed(2)}</h4>
              </>
            )}
          </div>

          {/* Carrito flotante + Drawer */}
          <Cart
            items={selectedItems}
            onInc={handleIncrease}
            onDec={handleDecrease}
            onRemove={handleRemoveItem}
            onConfirm={handleCreateOrder}
            disabledConfirm={selectedItems.length === 0}
          />
        </>
      )}
    </div>
  );
};

export default Order;
