import MenuPrincipal from "./pages/MenuPrincipal";
import { CartProvider } from "./components/cartContext";
import { BrowserRouter, Routes, Route, Link, Router, useLocation } from "react-router-dom"
import Carrito from "./pages/Carrito";

function Navbar() {
  const ubicacion = useLocation();

  return(
    <div className="flex justify-between bg-white shadow-sm p-4">
      

      {ubicacion.pathname === "/carrito" ? (
        <Link to="/" className="inline-block">
          <img src="images/flecha.png" alt="volver al menu" className="w-10 h-10 hover:scale-110 transition-transform" />
        </Link>
      ) : (
        <div></div>
      )}

      {ubicacion.pathname === "/" ? (
        <Link to="/carrito" className="inline-block">
          <img src="/images/carrito.png" alt="ir al carrito" className="w-10 h-10 hover:scale-110 transition-transform" />
        </Link>
      ) : (
        <div></div>
      )}


    </div>
  )
}

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <div>
          
          <Navbar />

          {/* LAS PANTALLAS QUE CAMBIAN */}
          <div className="p-4"> 
            <Routes>
              <Route path="/" element={<MenuPrincipal />} />
              <Route path="/carrito" element={<Carrito />} />
            </Routes>
          </div>

        </div>
      </BrowserRouter>
    </CartProvider>
   
  )
}

export default App;