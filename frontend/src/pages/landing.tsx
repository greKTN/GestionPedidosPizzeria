import React from 'react';
import { useNavigate } from 'react-router-dom';

// @ts-ignore: allow importing image assets without explicit type declarations
import pizzaPrincipalImg from '../assets/pizza1.png';
// @ts-ignore: allow importing image assets without explicit type declarations
import pizza1Img from '../assets/pizza2.png';
// @ts-ignore: allow importing image assets without explicit type declarations
import pizza2Img from '../assets/pizza3.png';

export default function Landing() {
    const navigate = useNavigate(); // 2. Inicializamos la función de navegación

    return(
        <div className='min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased selection:bg-[#1e5ca7] selection:text-white pb-12'>
            <header className='sticky top-0 z-50 backdrop-blur-md bg-zinc-950/90 border-b border-zinc-800/80 px-6 py-4 md:px-12 flex items-center justify-between'>
                <span className='text-2xl font-black tracking-tighter text-white uppercase italic'>
                    🍕 Pizza Panucci's <span className='text-[#1e5ca7]'>.</span>
                </span>

                <div className='flex items-center gap-4'>
                    <button
                        onClick={() => navigate('/login')} // 3. Navegamos a login
                        className='text-sm font-bold tracking-wide text-zinc-100 hover:text-[#1e5ca7] transition-colors uppercase'
                        >
                        Ingresar
                    </button>
                    <button
                        onClick={() => navigate('/register')} // 3. Navegamos a register
                        className='rounded-xl bg-[#1e5ca7] px-5 py-2.5 text-sm font-extrabold text-white shadow-[0-4px_14px_rgba(30,90,163,0.4)] active:scale-95 uppercase tracking-wider'
                        >
                        Unete
                    </button>
                </div>
            </header>

            {/**bento grid (estilo por moodulos con rectangulos)*/}
            <main className='max-w-7xl mx-auto p-4 md:p-8 lg:p-10'>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[240px]'>

                    {/**tarjeta 1 SUJETA A CAMBIOS POR VOTACION POPULAR*/}
                    <div className="md:col-span-2 md:row-span-1 rounded-3xl bg-[#cbd5e1] p-8 flex flex-col justify-center text-zinc-900 relative overflow-hidden group border border-white/20">
                        <div className='absolute -right-10 -top-10 w-48 h-48 bg-[#1e5ca7]/20 rounded-bl-full blur-3xl pointer-events-none'></div>
                        
                        <span className='text-xs font-black tracking-widest text-[#1e5ca7] uppercase mb-1 bg-[#1e5ca7]/10 px-2.5 py-1 rounded-md self-start'>
                            Receta Udo byte
                        </span>
                        <h1 className='text-3xl md:text-5xl font-black tracking-tighter leading-none uppercase italic'>
                            Sabor real.<br />
                            Sin rodeos<span className='text-[#1e5ca7]'>.</span>
                        </h1>
                        <p className='mt-3 text-zinc-700 max-w-md text-sm md:text-base font-medium'>
                            Nacidos en los pasillos de la Udo. Masa madre de panaderia tradicional, salsa secreta e ingredientes brutales
                        </p>
                    </div>

                    {/**tarjeta 2: mismas condiciones de la tarjeta anterior*/}
                    <div className='md:row-span-2 rounded-3xl bg-[#1e5ca7] overflow-hidden relative group border border-zinc-800 shadow-2xl'>
                        <div className='absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/20 to-transparent z-10'></div>

                        <img
                            src={pizzaPrincipalImg}
                            alt="Panucci's Pizza Slice"
                            className='w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out z-0 opacity-150'
                        />

                        <div className='absolute bottom-6 left-6 right-6 z-20 pb-10'> 
                            <span className='bg-[#1e5ca7] text-white-[10px] font-black uppercase px-2 py-0.5 rounded tracking-widest'>
                                El icono
                            </span>
                            <h3 className='text-xl font-black uppercase tracking-tight text-white mt-1 italic'>La de Pepperoni</h3>
                            <p className='text-xs text-zinc-300 font-medium'>Crocante, grasosa en su punto justo, legendaria</p>
                        </div>
                    </div>
                
                    {/*tarjeta 3 */}
                    <div className='rounded-3xl bg-[#1e5ca7] p-8 flex flex-col justify-end text-white relative overflow-hidden group shadow-lg'>
                        <div className='absolute top-4 right-4 text-8xl font-black text-white/5 select-none italic pointer-events-none'>Byte</div>
                        <p className='text-2xl font-black uppercase tracking-tighter leading-none italic'>
                            "Intensa<br />como debe ser"
                        </p>
                        <p>- Tradicion familiar, calidad insuperable</p>
                    </div>

                    {/**tarjeta 4 */}
                    <div className='rounded-3xl bg-zinc-900 overflow-hidden relative group borde-zinc-800'>
                        <div className='absolute inset-0 bg-linear-to-t from-gray-950/80 to-transparent z-10'></div>
                        <img
                        src={pizza1Img}
                        alt="Panucci's Oven Quality"
                        className='w-full h-full object-cover transform group-hover:scale-110 group-hover:rotate-1 transition-transform duration-700 ease-out opacity-85'
                        />
                        <div className='absolute bottom-5 left-5 z-20'>
                            <h4 className='text-sm font-black uppercase tracking-wider text-white'>Directo del horno</h4>
                            <p className='text-[-11px] text-zinc-400'>Sin filtros, directo a tu caja</p>
                        </div>
                    </div>

                    {/**tarjeta 5 */}
                    <div className='md:col-span-2 rounded-3xl bg-zinc-900 border border-zinc-800 overflow-hidden flex flex-col sm:flex-row relative group shadow-xl'>
                        <div className='p-8 flex flex-col justify-center flex-1 z-20 bg-linear-to-r from-zinc-900 via-zinc-900 to-zinc-900/40'>
                            <span className='text-xs font-black text-[#1e5ca7] uppercase tracking-widdest'>Estilo de vida</span>
                            <h3 className='text-2xl md:text-3xl font-black uppercase tracking-tight text-white mt-1 italic'>
                                Cero complicaciones
                            </h3>
                            <p className='tex-xs md:text-sm text-zinc-400 mt-1 max-w-xs font-medium'>
                                Abrimos hasta tarde. Para cuando programas, cuando juegas o cuando sales con tus panas.
                            </p>

                            <div className='mt-4 flex gap-2'>
                                <span className='inline-block text-[11px] font-bold tracking-wider border border-zinc-700 text-zinc-300 px-3 py-1.5 rounded-xl bg-zinc-800/50'>
                                    🛵 Delivery Activo 24/7
                                </span>
                            </div>
                        </div>
                    
                        {/**imagen de apoyo */}
                        <div>
                            <img
                            src={pizza2Img}
                            alt='Cultura Urbana Pizza'
                            className='absolute inset-0 w-50% h-50% object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out grayscale group-hover:grayscale-0'
                            />
                        </div>
                    </div>

                    {/**trajeta 6 */}
                    <div className='rounded-3xl bg-[#cbd5e1] p-6 flex flex-col justify-between text-zinc-900 border border-white/10 relative overflow-hidden'>
                        <div>
                            <h4 className='text-xs font-black uppercase tracking-widest text-zinc-500'>Unete al movimiento</h4>
                            <p className='text-base font-bold tect-zinc-800 mt-2 tracking-tight leading-snug'>
                                Captura tu rebanada, etiquetanos y obten codigos brutales en tus proximas ordenes.
                            </p>
                        </div>
                        <div className='flex items-center gap-2 mt-4'>
                            <span className='text-xs font-extrabold bg-zinc-950 text-white px-3 py-2 rounded-xl tracking-tight italic'>
                                @PizzasPanuccis
                            </span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}