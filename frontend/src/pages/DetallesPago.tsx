import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DATOS_PAGO_MOVIL } from '../constants/pagoInfo';
import { useCart } from '../components/cartContext';

interface OrdenData {
    id_pedido: number;
    tipo_entrega: string;
    estado_pedido: string;
    fecha: string;
    total: number; // Este será el total final (subtotal + iva + envío)
    items: any[];  // Agregamos los items acá para el recibo
    cliente: {
        nombre: string;
        telefono: string;
        direccion: string;
    };
}

export default function DetallesPago() {
    const location = useLocation();
    const navigate = useNavigate();
    const { clearCart } = useCart();
    
    // Acá recupero los datos que envié desde el Carrito. 
    // Si no vienen items, inicializo vacío para no romper nada.
    const { total, delivery, items } = location.state || { total: 0, delivery: true, items: [] };
    
    const [orden, setOrden] = useState<OrdenData | null>(null);
    const [loading, setLoading] = useState(true);
    const [enviandoPago, setEnviandoPago] = useState(false);
    const [pagoConfirmado, setPagoConfirmado] = useState(false);
    const [idPedidoRecibido, setIdPedidoRecibido] = useState<number | null>(null);

    // Calculo los valores reales antes de setear el estado
    const iva = total * 0.16;
    const costoEnvio = delivery ? 5.00 : 0.00;
    const finalTotal = total + iva + costoEnvio;

    useEffect(() => {
        // Validación de seguridad: si no hay total, me largo de acá al menú
        if (total === 0) {
            navigate('/menu'); 
            return;
        }

        // Construyo la orden con los datos reales calculados
        setOrden({
            id_pedido: Math.floor(Math.random() * 10000),
            tipo_entrega: delivery ? 'Delivery' : 'Retiro',
            estado_pedido: 'Preparando',
            fecha: new Date().toISOString(),
            total: finalTotal, // Ya incluye iva y envío
            items: items,      // Paso los items reales acá
            cliente: {
                nombre: 'Cliente Pizza Panucci\'s',
                telefono: '0424-0000000',
                direccion: 'Por definir',
            },
        });
        setLoading(false);
    }, [total, delivery, navigate, items, finalTotal]);

    const handleReportarPago = async () => {
        if (!orden) return;
        setEnviandoPago(true);

        try{
            const userStr = localStorage.getItem('user');
            if(!userStr){
                alert("Error, debe iniciar sesion para procesar");
                navigate('/login');
                return;
            }
            const user = JSON.parse(userStr);

            //preparacion del paquete para la API
            const payload = {
                id_usuario: user.id,
                tipo_entrega: orden.tipo_entrega,
                total: orden.total,
                items: orden.items
            }

            const response = await fetch('http://localhost:3000/api/pedidos',{
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            const data = await response.json();

            if (response.ok){
                setIdPedidoRecibido(data.id_pedido); //Se guarda el ID que nos dio la DB
                 setTimeout(() => {
                    setPagoConfirmado(true);
                }, 1000);
                setPagoConfirmado(true);
                clearCart(); //se vacia el carrito porque ya se pago
            } else{
                alert("Error al procesar: " + data.error);
            }
        } catch(error) {
            console.error("Fallo la conexion: ", error);
            alert("No se pudo conectar con el servidor");
        } finally{
            setEnviandoPago(false);
        }
        
    };

    if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-black text-slate-900 animate-pulse">Cargando...</div>;
    if (!orden) return null;

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans">
            <div className="max-w-2xl mx-auto">
                
                {pagoConfirmado ? (
                    /* --- RECIBO CON LISTA DE PRODUCTOS --- */
                    <div className="bg-white rounded-[2rem] shadow-2xl border border-blue-100 overflow-hidden text-center p-12">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 mb-2">PAGO EXITOSO</h1>
                        <p className="text-slate-500 font-medium mb-8">Orden #{orden.id_pedido} confirmada.</p>
                        
                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 text-left">
                            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Detalle de tu orden</p>
                            <div className="space-y-3">
                                {/* Mapeo los productos reales que compré */}
                                {orden.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between font-bold text-slate-700">
                                        <span>{item.nombre} x{item.cantidad}</span>
                                        <span>${(item.precio * item.cantidad).toFixed(2)}</span>
                                    </div>
                                ))}
                                {/* Desglose de costos */}
                                <div className="border-t border-slate-200 pt-3 mt-3 text-sm text-slate-500">
                                    <div className="flex justify-between"><span>IVA (16%)</span><span>${iva.toFixed(2)}</span></div>
                                    {delivery && <div className="flex justify-between"><span>Envío</span><span>$5.00</span></div>}
                                </div>
                                <div className="border-t border-slate-200 pt-3 mt-3 flex justify-between font-black text-lg text-slate-900">
                                    <span>Total Pagado</span>
                                    <span>${orden.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* --- VISTA DE PAGO --- */
                    <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden">
                        <div className="p-8 border-b border-slate-100">
                            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Monto Total a Pagar</p>
                            <h1 className="text-6xl font-black text-slate-900 tracking-tighter">${orden.total.toFixed(2)}</h1>
                        </div>

                        <div className="p-8 space-y-8">
                            <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800">
                                <p className="text-xs font-black text-blue-400 uppercase tracking-[0.2em] mb-4">Datos de Pago Móvil</p>
                                <div className="space-y-2 text-sm text-white font-medium">
                                    <p><span className="font-bold text-slate-400">Banco:</span> {DATOS_PAGO_MOVIL.banco}</p>
                                    <p><span className="font-bold text-slate-400">Cédula:</span> {DATOS_PAGO_MOVIL.cedula}</p>
                                    <p><span className="font-bold text-slate-400">Teléfono:</span> {DATOS_PAGO_MOVIL.telefono}</p>
                                    <p className="mt-3 font-mono text-lg bg-black/30 px-3 py-2 rounded-lg inline-block tracking-wider">{DATOS_PAGO_MOVIL.cuenta}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-slate-50 border-t border-slate-100">
                            <button
                                onClick={handleReportarPago}
                                disabled={enviandoPago}
                                className={`w-full py-5 rounded-2xl font-black uppercase text-sm tracking-[0.15em] transition-all ${
                                    enviandoPago ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-black'
                                }`}
                            >
                                {enviandoPago ? 'Validando transferencia...' : 'Marcar como Pagado'}
                            </button>
                        </div>
                    </div>
                )}
                
                <button 
                    onClick={() => navigate('/menu')}
                    className="w-full mt-6 text-slate-400 font-black hover:text-slate-900 transition-colors uppercase text-xs tracking-[0.2em]"
                >
                    Volver al menú
                </button>
            </div>
        </div>
    );
}