import {CartItem, useCart} from '../components/cartContext';
import {useState, useEffect} from 'react';

// Definición de tipos para las props del submenú y opciones adicionales
interface SubMenuProps {
    pizza: CartItem;
    removeFromCart: (id_variante: number) => void;
    onPriceChange: (id_variante: number, newPrice: number) => void;
}

interface OpcionExtra {
    id_opcion: number;
    nombre: string;
    categoria: string;
    precio_adicional: number;
}

/**
 * nombre de la funcion: CardItemCard
 * parametros: {pizza, removeFromCart, onPriceChange} (Tipo: SubMenuProps) - Datos de la pizza y funciones de gestión.
 * retorno: Componente JSX (Tarjeta de pizza en el carrito).
 * funcionalidad: Sub-componente que renderiza una pizza individual dentro de la vista del carrito. Administra internamente su estado para desplegar opciones extras (bordes y toppings) y notifica al componente padre sobre cualquier modificación en su precio final.
 */
export function CardItemCard({pizza, removeFromCart, onPriceChange}: SubMenuProps){
    
    // Estados locales para el menú desplegable, las opciones obtenidas desde el backend y las selecciones actuales del usuario
    const [open, setOpen] = useState(false);
    const [extra, setExtra] = useState<OpcionExtra[]>([]);
    const [selected, setSelected] = useState<OpcionExtra[]>([]);

    // Efecto para calcular el precio extra según las opciones seleccionadas y notificar el cambio al componente padre
    useEffect(() => {
        const extraPrice = selected.reduce((total, item) => total + Number(item.precio_adicional), 0);
        onPriceChange(pizza.id_variante, pizza.precio + extraPrice);
    }, [selected]);
    
    // Efecto para hidratar el listado de extras consumiendo la API al montar el componente
    useEffect(() => {
        const loadExtras = async () => {
            try{
                const response = await fetch('http://localhost:3000/api/opciones');
                const data = await response.json();
                setExtra(data);
            }
            catch(error){
                console.error("Error al obtener los extra", error)
            }
        };
        loadExtras();
    }, [])

    // Clasificación de opciones extras separando en arreglos según su categoría
    const borders = extra.filter(i => i.categoria != "Topping");
    const toppings = extra.filter(i => i.categoria != "Borde");
    
    /**
     * nombre de la funcion: toggleSelection
     * parametros: opcion (Tipo: OpcionExtra) - La opción adicional a añadir o remover.
     * retorno: void (Sin retorno).
     * funcionalidad: Aplica las reglas de negocio en la selección de extras: reemplaza si es un borde (selección única), o permite añadir/quitar si es un topping (selección múltiple).
     */
    const toggleSelection = (opcion: OpcionExtra) => {
        if (opcion.categoria === "Borde") {
            setSelected(prev => [
                ...prev.filter(i => i.categoria !== "Borde"), 
                opcion
            ]);
        } else {
            const isSelected = selected.find(i => i.id_opcion === opcion.id_opcion);
            if (isSelected) {
                setSelected(prev => prev.filter(i => i.id_opcion !== opcion.id_opcion));
            } else {
                setSelected(prev => [...prev, opcion]);
            }
        }
    };

    // Cálculos locales para mostrar el precio actualizado dentro de la UI de la tarjeta
    const extraPrice = selected.reduce((total, item) => total + Number(item.precio_adicional), 0);
    const finalPrice = pizza.precio + extraPrice;

    // Retorno de la UI de la tarjeta de la pizza individual
    return (
        <div className="bg-white rounded-xl p-4 flex flex-col gap-3 shadow-sm">
            <div>
                <div>
                    <img src={pizza.imagen_url} alt={pizza.nombre} />
                    
                    <div>
                        <h3 className="font-bold text-gray-800 text-lg">{pizza.nombre}</h3>
                        <p className="text-sm text-gray-500">Tamaño: {pizza.tamano} | Cantidad: {pizza.cantidad}</p>
                
                        <button onClick={() => removeFromCart(pizza.id_variante)} className="text-red-500 text-xs mt-1">
                            🗑️ Eliminar
                        </button>
                    </div>
                </div>
        
                <div>
                    <span className="font-bold text-lg">${finalPrice.toFixed(2)}</span>

                    <button onClick={() => setOpen(!open)} className="text-sm text-[#1e5aa8] font-semibold">
                        {open ? "🔼 Ocultar opciones" : "🔽 Personalizar"}
                    </button>
                </div>
            </div>

            {open && (
                <div>
                    <h4 className="font-semibold text-gray-700">Selecciona tu borde:</h4>
                    {borders.map((borde) => (
                        <label key={borde.id_opcion} className="flex items-center gap-2">
                            <input 
                                type={borde.categoria === "Borde" ? "radio" : "checkbox"}
                                checked={!!selected.find(i => i.id_opcion === borde.id_opcion)}
                                onChange={() => toggleSelection(borde)}
                            />
                            <span>{borde.nombre} (+${borde.precio_adicional})</span>
                        </label>
                    ))}

                    <h4 className="font-semibold text-gray-700 mt-4">Toppings extra:</h4>
                    {toppings.map((topping) => (
                        <label key={topping.id_opcion} className="flex items-center gap-2">
                            <input 
                                type={topping.categoria === "Borde" ? "radio" : "checkbox"}
                                checked={!!selected.find(i => i.id_opcion === topping.id_opcion)}
                                onChange={() => toggleSelection(topping)}
                            />
                            <span>{topping.nombre} (+${topping.precio_adicional})</span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    )
}

/**
 * nombre de la funcion: Carrito
 * parametros: Ninguno.
 * retorno: Componente JSX (Página de carrito y checkout).
 * funcionalidad: Componente principal que actúa como contenedor global del carrito de compras. Renderiza cada producto, calcula subtotales y presenta el panel lateral interactivo con cálculos de IVA y opciones de delivery.
 */
export default function Carrito() {
    // Consumo del estado global y estados locales para preferencias de envío y seguimiento de precios personalizados
    const {cartItems, removeFromCart} = useCart();
    const [delivery, setDelivery] = useState(true);
    const [prices, setPrices] = useState<Record<number, number>>({});

    /**
     * nombre de la funcion: handlePriceChange
     * parametros: id_variante (Tipo: number), newPrice (Tipo: number)
     * retorno: void (Sin retorno).
     * funcionalidad: Actualiza el estado de seguimiento global cada vez que una pizza modifica su precio local al añadirle extras.
     */
    const handlePriceChange = (id_variante: number, newPrice: number) => {
        setPrices(prev => ({...prev, [id_variante]: newPrice}))
    };

    // Reductor que calcula el total real mapeando las pizzas y tomando su precio modificado (si existe) o su precio base
    const realTotal = cartItems.reduce((acc, pizza) => {
        const actualPrice = prices[pizza.id_variante] || pizza.precio;
        return acc + actualPrice    
    }, 0);

    // Retorno de la estructura principal dividida en el panel de pizzas (izq) y el resumen (der)
    return(
        <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl mx-auto p-6">
            <div className="w-full md:w-2/3 flex flex-col gap-4 bg-[#1e5aa8] p-6 rounded-2xl shadow-lg">
                <div className="text-white mb-2">
                    <h2 className="text-2xl font-bold">Tu carrito</h2>
                    <p className="text-sm opacity-80">¡Las delicias que regalarás a tu paladar!</p>
                </div>

                {/* Mapeo del componente individual enviándole los manejadores de eventos */}
                {cartItems.map((pizza) => (
                    <CardItemCard key={pizza.id_variante} pizza={pizza} removeFromCart={removeFromCart} onPriceChange={handlePriceChange}/>
                ))}
            </div>

            <div className="w-full md:w-1/3 gap-4 bg-[#1e5aa8] p-6 rounded-2xl shadow-lg">
                <div className="text-white mb-2">
                    <h2 className="text-2xl font-bold">Resumen de compra</h2>
                    <p className="text-sm opacity-80">Ningún precio es muy alto cuando se trata de hacer feliz a tu estomago</p>
                </div>
                
                <div className="flex gap-2 bg-white/20 p-1 rounded-lg mb-4">
                    <button 
                        onClick={() => setDelivery(true)}
                        className={`flex-1 py-1 text-sm font-semibold rounded-md ${delivery ? 'bg-white text-[#1e5aa8]' : 'text-white'}`}
                    >
                        🛵 Delivery
                    </button>
                    <button 
                        onClick={() => setDelivery(false)}
                        className={`flex-1 py-1 text-sm font-semibold rounded-md ${!delivery ? 'bg-white text-[#1e5aa8]' : 'text-white'}`}
                    >
                        🏪 Retiro
                    </button>
                </div>

                <div className="flex flex-col gap-4 justify-between items-start">
                    <span className="font-bold text-lg">Precio base: ${realTotal.toFixed(2)}</span>
                    <span className="font-bold text-lg">IVA (16%): ${(realTotal * 0.16).toFixed(2)}</span>
                    <span className="font-bold text-lg">{delivery ? <p>Costo de envio: $5.00</p> : ""}</span>
                    <span className="font-bold text-lg">Total: ${!delivery ? (realTotal + (realTotal * 0.16)).toFixed(2) : (realTotal + (realTotal * 0.16) + 5.00).toFixed(2)}</span>
                </div>

                <div className ="py-4">
                    <button className="rounded-full bg-[#f08a5d] text-white text-sm font-semibold px-6 py-2 hover:bg-orange-600 transition-colors shadow-sm whitespace-nowrap">Pagar ahora</button>
                </div>
            </div>
        </div>
    )
}