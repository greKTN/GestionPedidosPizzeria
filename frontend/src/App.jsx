import MenuPrincipal from "./pages/MenuPrincipal";
import Landing from "./pages/landing"; // Importamos Landing
import Login from "./pages/login";     // Importamos Login
import Register from "./pages/register"; // Importamos Register
import { CartProvider } from "./components/cartContext";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import Carrito from "./pages/Carrito";
import DetallesPago from "./pages/DetallesPago";

function Navbar() {
  const ubicacion = useLocation();
  
  // No mostramos el navbar en estas páginas
  const rutasSinNavbar = ["/", "/login", "/register"];
  if (rutasSinNavbar.includes(ubicacion.pathname)) return null;

  return(
    <div className="flex justify-between bg-white shadow-sm p-4">
      {ubicacion.pathname === "/carrito" ? (
        <Link to="/menu" className="inline-block">
          <img src="images/flecha.png" alt="volver al menu" className="w-10 h-10 hover:scale-110 transition-transform" />
        </Link>
      ) : (
        <div></div>
      )}
    </div>
  )
}

function App() {
  return (
    // incluir en este apartado el <AuthProvider>
    <CartProvider>
      <BrowserRouter>
      {/*pantallas que cambian*/}
        <div>
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/menu" element={<MenuPrincipal />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/pagar" element={<DetallesPago />} />
          </Routes>
        </div>
      </BrowserRouter>
    </CartProvider>
  )
}

export default App;