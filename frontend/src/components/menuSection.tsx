import {useState, useEffect} from 'react';
import {MenuProps, Variant} from './menuCarrousel';
import { useCart } from './cartContext';

/**
 * nombre de la funcion: PizzaCardWide
 * parametros: {pizza} (Tipo: MenuProps) - Objeto con la información completa de la pizza y sus variantes disponibles.
 * retorno: Componente JSX (Tarjeta de pizza extendida).
 * funcionalidad: Sub-componente encargado de renderizar una presentación horizontal "tipo banner" para cada pizza en el menú principal. Incluye controles selectores que actualizan en tiempo real el precio de la talla mostrada.
 */
function PizzaCardWide({pizza}: {pizza: MenuProps}){
    
    //Estado local para controlar cual variante esta seleccionada en el select, se inicializa con la primera variante disponible
    const [selectedVariant, setSelectedVariant] = useState<Variant>(pizza.variantes[0]);

    /**
     * nombre de la funcion: handleChange
     * parametros: e (React.ChangeEvent<HTMLSelectElement>) - El evento disparado al interactuar con el menú desplegable.
     * retorno: void (Sin retorno).
     * funcionalidad: Lee el nuevo valor (ID de variante) que escogió el usuario, filtra el arreglo de variantes buscando el registro que coincida y lo define en el estado interno para actualizar el valor visual.
     */
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = Number(e.target.value);
        const newVariant = pizza.variantes.find(v => v.id_variante == id);
        if (newVariant) {
            setSelectedVariant(newVariant);
        }
    }

    // Contexto del carrito para poder agregar items al carrito desde esta tarjeta
    const { addToCart } = useCart()
    
    
    //Retorno para mostrar la tarjeta de la pizza, con su imagen, nombre, select para elegir la variante y el precio actualizado segun la elegida
    return (
        <div className="bg-white rounded-3xl overflow-hidden shadow-xl flex flex-col w-full mb-8 border border-slate-100 transition-all hover:shadow-2xl">
            {/* 1. La imagen formato Wide (Banner) */}
            <div className="w-full h-56 md:h-72">
                <img 
                /* se coloca en localhost mientras no este desplegado en produccion  */
                    src={`http://localhost:3000${pizza.imagen_url}`} 
                    className="w-full h-full object-cover" 
                    alt={pizza.nombre}
                />
            </div>

            {/* 2. El contenido inferior */}
            <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                
                {/* Lado izquierdo: Textos */}
                <div className="w-full md:w-2/3">
                    <h3 className="font-black text-2xl text-slate-900">{pizza.nombre}</h3>
                    {/* line-clamp-2 recorta el texto si es muy largo para que no dañe el diseño */}
                    <p className="text-sm text-slate-500 mt-2 line-clamp-2">{pizza.descripcion}</p>
                    
                    {/* Las estrellitas estáticas por ahora */}
                    <div className="flex items-center mt-3 text-sm text-slate-600">
                        <span className="text-amber-400 mr-2">★★★★★</span> 
                        <span className="font-bold text-slate-700">4.7</span>
                    </div>
                </div>

                {/* Lado derecho: Controles y botón */}
                <div className="flex flex-row items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                    
                    <div className="flex flex-col items-end">
                        <select 
                            className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-[#1e5ca7] outline-none cursor-pointer focus:border-[#1e5ca7]"
                            value={selectedVariant.id_variante} 
                            onChange={handleChange}
                        >
                            {pizza.variantes.map((v) => (
                                <option key={v.id_variante} value={v.id_variante}>
                                    {v.tamano} - ${Number(v.precio).toFixed(2)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button onClick = {() => addToCart({
                        id_producto: pizza.id_producto,
                        id_variante: selectedVariant.id_variante,
                        nombre: pizza.nombre,
                        tamano: selectedVariant.tamano,
                        precio: Number(selectedVariant.precio),
                        imagen_url: pizza.imagen_url,
                        cantidad: 1
                    })} className="rounded-full bg-[#1e5ca7] text-white text-sm font-black px-6 py-3 hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20 whitespace-nowrap">
                        Añadir
                    </button>
                </div>
            </div>
        </div>
    )
}

/**
 * nombre de la funcion: MenuSection
 * parametros: Ninguno.
 * retorno: Componente JSX (Bloque estructural completo del menú).
 * funcionalidad: Actúa como el bloque contenedor de toda la oferta gastronómica. Pide el arreglo de productos al backend, maneja el estado de "Cargando" si los datos aún no llegan, y delega el renderizado de cada ítem a 'PizzaCardWide'.
 */
export default function MenuSection() {
    // Estado para controlar la pizzas obtenidas desde el backend
    const [pizzas, setPizzas] = useState<MenuProps[]>([]);

    // Efecto para cargar el menu desde el backend al iniciar el componente, guardandolo en el estado 'pizzas'
    useEffect(() => {
        /**
         * nombre de la funcion: loadProducts
         * parametros: Ninguno.
         * retorno: Promise<void> (Asíncrona).
         * funcionalidad: Consume la ruta GET '/api/productos' del backend local para hidratar el componente con la información normalizada de pizzas y tallas.
         */
        const loadProducts = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/productos');
                const data = await response.json();
                setPizzas(data);
            } catch(error) {
                console.error("Error al obtener el menu: ", error);
            }
        };
        loadProducts();
    }, []);

    //Mnesaje de carga mientras se obtienen las pizzas desde el backend
    if (pizzas.length === 0) {
        return (
            <div className="bg-[#1e5ca7] w-full py-20 px-4 text-center">
                <p className="text-white font-black text-xl animate-pulse">Cargando menú completo... 🍕</p>
            </div>
        );
    }

    // Retorno para mostrar la seccion del menu, con un titulo y mapear las pizzas obtenidas mostrando cada una con el componnente 'PizzaCardWide'
    return (
        <div className="bg-[#1e5ca7] w-full py-16 px-4">
            <div className="max-w-5xl mx-auto">
                
                <div className="text-center mb-12">
                    <h2 className="text-5xl font-black text-white mb-3 tracking-tighter">Menú</h2>
                    <p className="text-blue-100 text-base font-medium">Donde el paladar recibe un amor inigualable</p>
                </div>

                <div className="flex flex-col">
                    {pizzas.map((pizza) => (
                        <PizzaCardWide key={pizza.id_producto} pizza={pizza} />
                    ))}
                </div>

            </div>
        </div>
    )
}