import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import CheckoutPage from "../../pages/CheckoutPage";

export default function CheckoutRoute() {
  const { items } = useCart();
  const navigate = useNavigate();

  return (
    <CheckoutPage
      items={items}
      onBack={() => navigate("/cart")}
    />
  );
}
