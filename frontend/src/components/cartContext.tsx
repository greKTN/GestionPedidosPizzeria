import {useState, useEffect, createContext, useContext, ReactNode} from 'react';

// Definición de tipos para los items del carrito
export interface CartItem {
    id_producto: number;
    id_variante: number;
    nombre: string;
    tamano: string;
    precio: number;
    precio_final?: number;
    imagen_url: string;
    cantidad: number;
    extras?: OpcionExtra[];
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id_variante: number) => void;
    clearCart: () => void;
    totalPrice: number;
    updateItemExtras: (id_variante: number, extras: OpcionExtra[], nuevoPrecio: number) => void;
}

export interface OpcionExtra {
    id_opcion: number;
    nombre: string;
    categoria: string;
    precio_adicional: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

//Funcion para obtener la llave unica del carrito
    const getCartKey = () =>{
        const userStr = localStorage.getItem('user');
        if(userStr){
            const user = JSON.parse(userStr);
                return `cart_${user.id}`;
        }
       return ""
    }

/**
 * nombre de la funcion: CartProvider
 * parametros: {children} (Tipo: ReactNode) - Componentes hijos que tendrán acceso al contexto.
 * retorno: Componente JSX (Proveedor de contexto del carrito).
 * funcionalidad: Actúa como el estado global de la aplicación para gestionar los productos añadidos al carrito. Inicializa el estado desde localStorage para persistencia y provee las funciones necesarias para modificar el carrito.
 */
export function CartProvider({children}: {children: ReactNode}) {
    // Estado local inicializado con los datos de localStorage si existen, de lo contrario un arreglo vacío
    const [cartItems, setCartItems] = useState<CartItem[]>(() => {
        const key = getCartKey();
        const storedCart = localStorage.getItem(key);
        return storedCart ? JSON.parse(storedCart) : [];
    });

    

    // Efecto para sincronizar el estado del carrito con localStorage cada vez que hay un cambio en cartItems
    useEffect(() => {
        const key = getCartKey();
        localStorage.setItem(key, JSON.stringify(cartItems));
    }, [cartItems]);

    /**
     * nombre de la funcion: addToCart
     * parametros: item (Tipo: CartItem) - El producto a añadir o actualizar.
     * retorno: void (Sin retorno).
     * funcionalidad: Busca si el producto con la misma variante ya existe en el carrito. Si existe, incrementa su cantidad; si no, lo añade como un nuevo item al arreglo.
     */
    const addToCart = (item: CartItem) =>{
        setCartItems((prevItems) => {
            const existingItemIndex = prevItems.findIndex(i => i.id_producto == item.id_producto && i.id_variante == item.id_variante);
            if(existingItemIndex >= 0) {
                return prevItems.map((i, index) => index == existingItemIndex ? {
                    ...i, cantidad: i.cantidad + 1} : item);
                }
            return [...prevItems, item]});
    };

    /**
     * nombre de la funcion: removeFromCart
     * parametros: id_variante (Tipo: number) - El ID de la variante a eliminar.
     * retorno: void (Sin retorno).
     * funcionalidad: Filtra el arreglo actual del carrito, eliminando el producto que coincida con el ID de la variante proporcionada.
     */
    const removeFromCart = (id_variante: number) => {
        setCartItems((prevItems) => prevItems.filter(i => i.id_variante !== id_variante));
    };

    /**
     * nombre de la funcion: clearCart
     * parametros: Ninguno.
     * retorno: void (Sin retorno).
     * funcionalidad: Reinicia el estado del carrito a un arreglo vacío, eliminando todos los productos listados.
     */
    const clearCart = () => {
        setCartItems([]);
    }

    const updateItemExtras = (id_variante: number, extras: OpcionExtra[], nuevoPrecio: number) => {
    setCartItems(prevItems => prevItems.map(item =>
        item.id_variante === id_variante
            ? { ...item, extras, precio_final: nuevoPrecio }
            : item
        ));
    };

    // Cálculo acumulativo del precio total multiplicando el precio base de cada item por su cantidad
    const totalPrice = cartItems.reduce((total, item) => {
    const itemPrice = item.precio_final !== undefined ? item.precio_final : item.precio;
    return total + (itemPrice * item.cantidad);
        }, 0);

    // Retorno del provider inyectando los valores del contexto
    return (
        <CartContext.Provider value = {{ cartItems, addToCart, removeFromCart, clearCart, totalPrice, updateItemExtras }}>
            {children}
        </CartContext.Provider>
    )
}

/**
 * nombre de la funcion: useCart
 * parametros: Ninguno.
 * retorno: CartContextType (Objeto con el estado y métodos del carrito).
 * funcionalidad: Hook personalizado para consumir el contexto del carrito de forma segura. Lanza un error si se intenta usar fuera del bloque de un CartProvider.
 */
export function useCart() {
    const context = useContext(CartContext);
    if(!context) {
        throw new Error('useCart debe ser utilizado dentro de un CartProvider');
    }
    return context;
}