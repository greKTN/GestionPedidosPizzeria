import React, { useEffect, useState } from 'react';
import { DATOS_PAGO_MOVIL } from '../constants/pagoInfo';

interface OrdenData {
    id_pedido: number;
    tipo_entrega: string;
    estado_pedido: string;
    fecha: string;
    total: number;
    monto_base: number;
    iva: number;
    costo_envio: number;
    cliente: {
        nombre: string;
        telefono: string;
        direccion: string;
    };
    items_resumen: string[];
}

export default function DetallesPago() {
    const id_pedido = '1';
    const [orden, setOrden] = useState<OrdenData | null>(null);
    const [loading, setLoading] = useState(true);
    const [enviandoPago, setEnviandoPago] = useState(false);
    const [pagoConfirmado, setPagoConfirmado] = useState(false); // Nuevo estado para cambiar la vista

    useEffect(() => {
        // --- MOCK DATA ---
        setOrden({
            id_pedido: 1,
            tipo_entrega: 'Delivery',
            estado_pedido: 'Preparando',
            fecha: new Date().toISOString(),
            total: 49.4,
            monto_base: 40.0,
            iva: 6.4,
            costo_envio: 3.0,
            cliente: {
                nombre: 'Elon Musk',
                telefono: '0424-8284023',
                direccion: 'Tronconal III, Calle 4, Barcelona, Anzoátegui',
            },
            items_resumen: [
                'Pasticho "D\'Junior" (Cant: 1)',
                "Arizona's Peperonni (Cant: 2)",
            ],
        });
        setLoading(false);
    }, []);

    const handleReportarPago = async () => {
        if (!orden) return;
        setEnviandoPago(true);
        
        // Simulamos la espera de n (se puede cambiar a conveniencia mientras se hace el enlace con el backend)segundos
        setTimeout(() => {
            setPagoConfirmado(true);
            setEnviandoPago(false);
        }, 1000);
    };

    if (loading)
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center font-black text-slate-900 animate-pulse">
                Cargando...
            </div>
        );

    if (!orden)
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                Orden no encontrada.
            </div>
        );

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-2xl mx-auto">
                
                {/* --- VISTA DE RECIBO (SE MUESTRA TRAS EL PAGO) --- */}
                {pagoConfirmado ? (
                    <div className="bg-white rounded-[2rem] shadow-2xl shadow-blue-500/10 border border-blue-100 overflow-hidden text-center p-12">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 mb-2">PAGO EXITOSO</h1>
                        <p className="text-slate-500 font-medium mb-8">Tu orden #{orden.id_pedido} está siendo preparada con mucho sabor.</p>
                        
                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 text-left">
                            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Resumen de compra</p>
                            <div className="space-y-3">
                                {orden.items_resumen.map((item, idx) => (
                                    <p key={idx} className="font-bold text-slate-700">{item}</p>
                                ))}
                                <div className="border-t border-slate-200 pt-3 mt-3 flex justify-between">
                                    <span className="font-bold text-slate-400">Total</span>
                                    <span className="font-black text-slate-900">${orden.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* --- VISTA DE PAGO (ORIGINAL) --- */
                    <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden">
                        <div className="p-8 border-b border-slate-100">
                            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Monto a pagar</p>
                            <h1 className="text-6xl font-black text-slate-900 tracking-tighter">${orden.total.toFixed(2)}</h1>
                        </div>

                        <div className="p-8 space-y-8">
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Fecha</p>
                                    <p className="font-bold text-slate-900">{new Date(orden.fecha).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Orden #</p>
                                    <p className="font-bold text-slate-900">{orden.id_pedido}</p>
                                </div>
                            </div>

                            {/* Datos de Pago */}
                            <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800">
                                <p className="text-xs font-black text-blue-400 uppercase tracking-[0.2em] mb-4">Datos de Pago Móvil</p>
                                <div className="space-y-2 text-sm text-white font-medium">
                                    <p><span className="font-bold text-slate-400">Banco:</span> {DATOS_PAGO_MOVIL.banco}</p>
                                    <p><span className="font-bold text-slate-400">Cédula:</span> {DATOS_PAGO_MOVIL.cedula}</p>
                                    <p><span className="font-bold text-slate-400">Teléfono:</span> {DATOS_PAGO_MOVIL.telefono}</p>
                                    <p className="mt-3 font-mono text-lg bg-black/30 px-3 py-2 rounded-lg inline-block tracking-wider">
                                        {DATOS_PAGO_MOVIL.cuenta}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center font-black text-white">
                                    {orden.cliente.nombre.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-black text-slate-900">{orden.cliente.nombre}</p>
                                    <p className="text-sm text-slate-500 font-medium">{orden.cliente.telefono}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-slate-50 border-t border-slate-100">
                            <button
                                onClick={handleReportarPago}
                                disabled={enviandoPago}
                                className={`w-full py-5 rounded-2xl font-black uppercase text-sm tracking-[0.15em] transition-all transform active:scale-[0.98] ${
                                    enviandoPago 
                                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                                    : 'bg-slate-900 text-white shadow-xl shadow-slate-900/20 hover:bg-black hover:shadow-2xl'
                                }`}
                            >
                                {enviandoPago ? 'Validando transferencia...' : 'Marcar como Pagado'}
                            </button>
                        </div>
                    </div>
                )}
                
                <button className="w-full mt-6 text-slate-400 font-black hover:text-slate-900 transition-colors uppercase text-xs tracking-[0.2em]">
                    Volver al menú
                </button>
            </div>
        </div>
    );
}