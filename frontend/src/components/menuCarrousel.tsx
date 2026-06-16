import {useState, useEffect} from "react";
import { useCart } from './cartContext'
import { useNavigate } from "react-router-dom";
// @ts-ignore: allow importing image assets without explicit type declarations
import { API_URL } from "../constants/api";

//Definicion de tipos para las props
export interface Variant{
    id_variante: number;
    tamano: string;
    precio: string | number;
}

export interface MenuProps {
    id_producto: number;
    nombre: string;
    descripcion: string;
    imagen_url: string;
    variantes: Variant[]
}

/**
 * nombre de la funcion: PizzaCard
 * parametros: {pizza} (Tipo: MenuProps) - Objeto que contiene toda la información de una pizza y sus tamaños.
 * retorno: Componente JSX (Tarjeta de pizza).
 * funcionalidad: Sub-componente que renderiza de manera individual una tarjeta de pizza en formato compacto para el carrusel, manejando su propio estado interno para que el precio se actualice según la variante elegida por el usuario.
 */
function PizzaCard({pizza}: {pizza: MenuProps}){
    
    //Estado local para controlar cual variante esta seleccionada en el select, se inicializa con la primera variante disponible
    const [selectedVariant, setSelectedVariant] = useState<Variant>(pizza.variantes[0]);

    /**
     * nombre de la funcion: handleChange
     * parametros: e (React.ChangeEvent<HTMLSelectElement>) - El evento disparado al interactuar con el selector desplegable.
     * retorno: void (Sin retorno).
     * funcionalidad: Captura el ID seleccionado en el menú desplegable, busca su coincidencia exacta en el arreglo de variantes de la pizza actual y actualiza el estado 'selectedVariant' para refrescar el precio en pantalla.
     */
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = Number(e.target.value);
        const newVariant = pizza.variantes.find(v => v.id_variante == id);
        if (newVariant) {
            setSelectedVariant(newVariant);
        }
    };

    const {addToCart} = useCart();
    
    //Retorno para mostrar la tarjeta de la pizza, con su imagen, nombre, select para elegir la variante y el precio actualizado segun la elegida
    return (
        <div className="rounded-3xl p-5 bg-white shadow-xl h-full flex flex-col justify-between border border-slate-100 transition-all hover:shadow-2xl">
            <div>
                <img 
                    src={`${API_URL}${pizza.imagen_url}`} 
                    className="w-full h-40 object-cover rounded-2xl mb-4" 
                    alt={pizza.nombre}
                />
                <h3 className="font-black text-slate-800 text-lg mb-1">{pizza.nombre}</h3>
            </div>
            
            <div>
                <select 
                    className="w-full mb-4 p-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 outline-none focus:border-[#1e5ca7]"
                    value={selectedVariant.id_variante} 
                    onChange={handleChange}
                >
                    {/* mapeo de variantes */}
                    {pizza.variantes.map((v) => (
                        <option key={v.id_variante} value={v.id_variante}>
                            {v.tamano}
                        </option>
                    ))}
                </select>

                <div className="flex justify-between items-center">
                    <p className="font-black text-[#1e5ca7] text-lg">
                        ${Number(selectedVariant.precio).toFixed(2)}
                    </p>
                    <button onClick = {() => addToCart({
                        id_producto: pizza.id_producto,
                        id_variante: selectedVariant.id_variante,
                        nombre: pizza.nombre,
                        tamano: selectedVariant.tamano,
                        precio: Number(selectedVariant.precio),
                        imagen_url: pizza.imagen_url,
                        cantidad: 1
                    })} className="rounded-full bg-[#1e5ca7] text-white text-sm font-bold px-5 py-2 hover:bg-blue-800 transition-all">
                        Añadir
                    </button>
                </div>
            </div>
        </div>
    );
}

/**
 * nombre de la funcion: MenuCarrousel
 * parametros: Ninguno.
 * retorno: Componente JSX (Sección completa del carrusel).
 * funcionalidad: Componente principal que consulta el catálogo de pizzas al backend, gestiona un ciclo de animación automatizado cada 2 segundos y crea un efecto de carrusel visualmente infinito rotando y reposicionando las tarjetas.
 */
export default function MenuCarrousel() {
    //Estados para controlar el indice actual del carrusel, los productos obtenidos desde el backend y si se debe mostrar la animacion o no (para el efecto de salto al reiniciar el carrusel)
    const [currentIndex, setCurrentIndex] = useState(0);
    const [products, setProduct] = useState<MenuProps[]>([]);
    const [animation, setAnimation] = useState(true);
    const navigate = useNavigate();

    //efecto para cargar el menu desde el backend al iniciar el componente, guardandolo en el estado 'products'
    useEffect(() => {
        /**
         * nombre de la funcion: loadProducts
         * parametros: Ninguno.
         * retorno: Promise<void> (Asíncrona).
         * funcionalidad: Realiza una petición GET a la API local de Node.js, formatea la respuesta en JSON y guarda los datos de las pizzas en el estado 'products'.
         */
        const loadProducts = async () => {
            try {
                const response = await fetch(`${API_URL}/api/productos`);
                const data = await response.json();
                
                setProduct(data);
            }
            catch(error) {
                console.error("Error al obtener el menu: ", error);
            }
        };
        loadProducts();
    }, []);

    //Efecto de cambio automatico cada 2 segundos para que avance el carrusel, se reinicia cada vez que cambia la cantidad de productos
    useEffect(() => {
        if (products.length == 0) return;
        const timer = setInterval(() => {
                    setCurrentIndex((prevIndex) => (prevIndex +1));
                }, 2000);

        return () => clearInterval(timer);
    }, [products.length]);

    useEffect(() => {
        //efecto de reciniar el carrousel al llegar al final, para que parezca infinito
        if (currentIndex === products.length) {
            
            //al llegar al final, se hace una pausa de 500ms y luego se devuelve al inicio sin animacion, para ocultar el salto
            const timer1 = setTimeout(() => {
                setAnimation(false); 
                setCurrentIndex(0);  

                // 50ms despues se vuelve a iniciar el carrusel con la animacion
                setTimeout(() => {
                    setAnimation(true);
                }, 50);

            }, 500);

            return () => clearTimeout(timer1);
        }
    }, [currentIndex, products.length]);


    const handleCerrarSesion = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    // Mnesaje de carga por si el usuario tiene el internet lento, no vea una pantalla en blanco
    if(products.length == 0){
        return <p className="text-center font-bold">Cargando menú... 🍕</p>;
    }

    const completeCarrousel = [...products, ...products.slice(0, 3)];

/**
     * nombre de la funcion: Header
     * funcionalidad: Agregué este header con la imagen personalizada, botón de retorno y acceso al carrito para que el usuario pueda navegar fácilmente.
     */
    return (
    <div className="bg-[#1e5ca7]">
        <header className="relative w-full h-48 bg-zinc-900 border-b-4 border-[#1e5ca7] flex items-center justify-between px-8">
            <button 
                onClick={handleCerrarSesion} 
                className="bg-zinc-800 text-white px-4 py-2 rounded-lg font-bold hover:bg-[#1e5ca7] transition-all"
            >
                ← CERRAR SESION
            </button>
            
            <h1 className="text-white font-black text-2xl md:text-3xl tracking-tighter uppercase italic">
                Dejate llevar con <span className="text-[#1e5ca7]">la mejor pizza</span>
            </h1>
            
            <button 
                onClick={() => window.location.href = '/carrito'} 
                className="bg-[#1e5ca7] text-white px-6 py-2 rounded-lg font-black uppercase hover:bg-blue-700 transition-all flex items-center gap-2"
            >
                Carrito 🛒
            </button>
        </header>

        <div className="py-12 px-6">
            <h2 className="text-white font-black text-3xl mb-8 ml-2 uppercase tracking-wide">Recomendaciones</h2>
            
            <div className="overflow-hidden w-full max-w-7xl mx-auto">
                
                <div 
                    className={animation ? "flex transition-transform duration-500 ease-out" : "flex"} 
                    style={{ transform: `translateX(-${currentIndex * 33.33}%)` }}
                >
                    {/* mapeo de las pizzas a mostrar en el carrusel, se muestran 3 a la vez, por eso el 33.33% */}
                    
                    {completeCarrousel.map((pizza, index) => (
                        
                        // El 'key' es obligatorio en React cuando usamos .map() para que no se confunda
                        <div key={index} className="min-w-[33.33%] p-3 shrink-0">
                            {/* Invocacion del sub-componente enviandole la info de la pizza */}
                                <PizzaCard pizza={pizza} />
                                </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);
}