// src/components/Cart.jsx
import React, { useMemo, useState } from "react";
import "../styles/Cart.css";

const Cart = ({
  items,
  onInc, //Incrementar cantidad
  onDec, //Disminuir
  onRemove,
  onConfirm,     // callback para confirmar pedido (opcional, puedes no pasarlo)
  disabledConfirm = false
}) => {
  const [open, setOpen] = useState(false);

  const total = useMemo(
    () => items.reduce((acc, i) => acc + i.price * i.quantity, 0),
    [items]
  );
  const count = useMemo(
    () => items.reduce((acc, i) => acc + i.quantity, 0),
    [items]
  );

  return (
    <>
      {/* Botón flotante */}
      <button
        className="cart-fab"
        onClick={() => setOpen(true)}
        aria-label="Abrir carrito"
      >
        🛒
        {count > 0 && <span className="cart-badge">{count}</span>}
      </button>

      {/* Drawer */}
      <div className={`cart-drawer ${open ? "open" : ""}`}>
        <div className="cart-header">
          <h3>Tu carrito</h3>
          <button className="cart-close" onClick={() => setOpen(false)}>✕</button>
        </div>

        {items.length === 0 ? (
          <p className="cart-empty">Aún no has agregado productos.</p>
        ) : (
          <ul className="cart-list">
            {items.map((item) => (
              <li key={item.productId} className="cart-item">
                <div className="cart-line">
                  <div className="cart-name">{item.productName}</div>
                  <div className="cart-price">${(item.price * item.quantity).toFixed(2)}</div>
                </div>

                <div className="cart-controls">
                  <button
                    type="button"
                    onClick={() => onDec(item.productId)}
                    className="cart-qty"
                    aria-label="Disminuir"
                  >−</button>

                  <span className="cart-qty-num">{item.quantity}</span>

                  <button
                    type="button"
                    onClick={() => onInc(item.productId)}
                    className="cart-qty"
                    aria-label="Aumentar"
                  >+</button>

                  <button
                    type="button"
                    onClick={() => onRemove(item.productId)}
                    className="cart-remove"
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="cart-footer">
          <div className="cart-total">
            <span>Total</span>
            <strong>${total.toFixed(2)}</strong>
          </div>

          <button
            className="submit-button"
            onClick={() => {
              if (onConfirm) onConfirm();
              setOpen(false);
            }}
            disabled={disabledConfirm || items.length === 0}
          >
            Confirmar Pedido
          </button>
        </div>
      </div>

      {/* Fondo semitransparente */}
      {open && <div className="cart-backdrop" onClick={() => setOpen(false)} />}
    </>
  );
};

export default Cart;
