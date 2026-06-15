import {CartItem, useCart} from '../components/cartContext';
import {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../constants/api';

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
    const { updateItemExtras } = useCart();

    // Efecto para calcular el precio extra según las opciones seleccionadas y notificar el cambio al componente padre
    useEffect(() => {
        const extraPrice = selected.reduce((total, item) => total + Number(item.precio_adicional), 0);
        onPriceChange(pizza.id_variante, pizza.precio + extraPrice);
    }, [selected]);
    
    // Efecto para hidratar el listado de extras consumiendo la API al montar el componente
    useEffect(() => {
        const loadExtras = async () => {
            try{
                const response = await fetch(`${API_URL}/api/opciones`);
                const data = await response.json();
                setExtra(data);
            }
            catch(error){
                console.error("Error al obtener los extra", error)
            }
        };
        loadExtras();
    }, [])

    useEffect(() => {
    const extraPrice = selected.reduce((total, item) => total + Number(item.precio_adicional), 0);
    const finalPrice = pizza.precio + extraPrice;
    
    // Le enviamos al contexto los extras seleccionados y el nuevo precio
    updateItemExtras(pizza.id_variante, selected, finalPrice);
        }, [selected]);

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
        <div className="bg-white rounded-2xl p-5 flex flex-col gap-4 shadow-sm border border-slate-100">
            <div className="flex gap-4">
                <img src={`${API_URL}${pizza.imagen_url}`} alt={pizza.nombre} className="w-24 h-24 rounded-xl object-cover" />
                
                <div className="flex-1 flex justify-between items-start">
                    <div>
                        <h3 className="font-black text-gray-800 text-lg">{pizza.nombre}</h3>
                        <p className="text-sm text-gray-500">Tamaño: {pizza.tamano} | Cantidad: {pizza.cantidad}</p>
                
                        <button onClick={() => removeFromCart(pizza.id_variante)} className="text-red-500 text-sm mt-2 font-medium flex items-center gap-1">
                            🗑️ Eliminar
                        </button>
                    </div>
                    <span className="font-black text-xl text-gray-900">${finalPrice.toFixed(2)}</span>
                </div>
            </div>

            <button onClick={() => setOpen(!open)} className="text-sm text-[#1e5aa8] font-bold self-start hover:underline">
                {open ? "🔼 Ocultar opciones" : "🔽 Personalizar pizza"}
            </button>

            {open && (
                <div className="border-t pt-4 border-slate-100">
                    <h4 className="font-bold text-gray-700 mb-2">Selecciona tu borde:</h4>
                    {borders.map((borde) => (
                        <label key={borde.id_opcion} className="flex items-center gap-3 text-sm mb-1 cursor-pointer">
                            <input 
                                type="radio"
                                name="borde"
                                checked={!!selected.find(i => i.id_opcion === borde.id_opcion)}
                                onChange={() => toggleSelection(borde)}
                                className="accent-[#1e5aa8]"
                            />
                            <span>{borde.nombre} (+${Number(borde.precio_adicional).toFixed(2)})</span>
                        </label>
                    ))}

                    <h4 className="font-bold text-gray-700 mt-4 mb-2">Toppings extra:</h4>
                    {toppings.map((topping) => (
                        <label key={topping.id_opcion} className="flex items-center gap-3 text-sm mb-1 cursor-pointer">
                            <input 
                                type="checkbox"
                                checked={!!selected.find(i => i.id_opcion === topping.id_opcion)}
                                onChange={() => toggleSelection(topping)}
                                className="accent-[#1e5aa8]"
                            />
                            <span>{topping.nombre} (+${Number(topping.precio_adicional).toFixed(2)})</span>
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
    const navigate = useNavigate();

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

    //
    //Funcion que envia la informacion del carrito directamente a los detalles de compra y la facturacion
    const handleContinuarPagar = () => {
        navigate('/pagar', { 
            state: { 
                total: realTotal, 
                delivery: delivery, 
                items: cartItems // <--- Pasamos los productos
            } 
        });
    };

    // Retorno de la estructura principal dividida en el panel de pizzas (izq) y el resumen (der)
    return(
        <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl mx-auto p-6">
            <div className="w-full md:w-2/3 flex flex-col gap-4 bg-[#1e5aa8] p-8 rounded-3xl shadow-xl">
                <div className="text-white mb-2">
                    <h2 className="text-3xl font-black">Tu carrito</h2>
                    <p className="text-sm opacity-90">¡Las delicias que regalarás a tu paladar!</p>
                </div>

                {/* Mapeo del componente individual enviándole los manejadores de eventos */}
                {cartItems.map((pizza) => (
                    <CardItemCard key={pizza.id_variante} pizza={pizza} removeFromCart={removeFromCart} onPriceChange={handlePriceChange}/>
                ))}
            </div>

            <div className="w-full md:w-1/3 bg-[#1e5aa8] p-8 rounded-3xl shadow-xl h-fit text-white">
                <div className="mb-6">
                    <h2 className="text-2xl font-black">Resumen de compra</h2>
                    <p className="text-sm opacity-80 mt-1">Ningún precio es muy alto cuando se trata de hacer feliz a tu estómago</p>
                </div>
                
                <div className="flex gap-2 bg-black/20 p-1.5 rounded-xl mb-6">
                    <button 
                        onClick={() => setDelivery(true)}
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${delivery ? 'bg-white text-[#1e5aa8]' : 'text-white'}`}
                    >
                        🛵 Delivery
                    </button>
                    <button 
                        onClick={() => setDelivery(false)}
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${!delivery ? 'bg-white text-[#1e5aa8]' : 'text-white'}`}
                    >
                        🏪 Retiro
                    </button>
                </div>

                <div className="flex flex-col gap-3 border-t border-white/20 pt-4 mb-6 text-base font-bold">
                    <div className="flex justify-between"><span>Precio base:</span> <span>${realTotal.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>IVA (16%):</span> <span>${(realTotal * 0.16).toFixed(2)}</span></div>
                    {delivery && <div className="flex justify-between"><span>Costo de envío:</span> <span>$5.00</span></div>}
                </div>

                <div className="flex justify-between items-center text-2xl font-black mb-8">
                    <span>Total:</span>
                    <span>${delivery ? (realTotal + (realTotal * 0.16) + 5.00).toFixed(2) : (realTotal + (realTotal * 0.16)).toFixed(2)}</span>
                </div>
                

                <button onClick={handleContinuarPagar} className="w-full rounded-full bg-[#f08a5d] text-white text-base font-black px-6 py-4 hover:bg-orange-600 transition-all shadow-lg shadow-orange-900/20">
                    Continuar a Pagar
                </button>
            </div>
        </div>
    )
}