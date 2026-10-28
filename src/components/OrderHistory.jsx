import { useState } from "react";
import { getOrders } from "../lib/orders";
import { formatPrice } from "../lib/price";

export default function OrderHistory({ user }) {
  const [orders] = useState(() => getOrders(user));

  if (orders.length === 0) {
    return <p>Du hast bisher noch keine Bestellungen aufgegeben.</p>;
  }

  return (
    <div className="order-list-container">
      {orders.map((order, index) => (
        <div className="order-card" key={`${order.id}-${index}`}>
          <div className="order-header">
            <span>Bestellung {order.id}</span>
            <span>{order.date}</span>
          </div>

          <ul className="order-items-list">
            {order.items.map((item) => (
              <li key={item.key}>
                {item.title} ({item.quantity}x) -{" "}
                {formatPrice(item.price * item.quantity)}
              </li>
            ))}
          </ul>

          <p className="order-meta">
            {order.payment} · {order.status}
            {order.address &&
              ` · Lieferung an ${order.address.street}, ${order.address.zip} ${order.address.city}`}
          </p>

          <div className="order-total">
            {order.shipping > 0 && (
              <div>Versand: {formatPrice(order.shipping)}</div>
            )}
            Gesamtsumme: {formatPrice(order.total)}
          </div>
        </div>
      ))}
    </div>
  );
}