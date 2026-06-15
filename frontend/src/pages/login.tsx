import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// importamos la imagen de la pizza //

import { API_URL } from '../constants/api';

// @ts-ignore: allow importing image assets without explicit type declarations
import pizzaImage from '../assets/pizza-login.png'

export default function Login() {
// estados para el formulario de login //
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // manejo del formulario de login //
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('user', JSON.stringify(data.user))
                alert("¡Bienvenido a Pizza Panucci's, " + data.user.nombre + "!");
                navigate('/menu'); 
            } else {
                alert("Acceso denegado: " + data.message);
            }
        } catch (error) {
            console.error("Error de conexión:", error);
            alert("El servidor no responde, verifica que esté encendido.");
        }
    };
    const navigate = useNavigate();
    
    return (
        // contenedor principal: contiene el contenido cetrado y el fondo negro //
        <div className='flex min-h-screen items-center justify-center bg-zinc-950 p-4 font-sans select-none'>
            {/* tarjeta del login */}
            <div className='flex w-full max-w-4xl overflow-hidden rounded-2x1 bg-[#c8d4ef] shadow-2x1 md:flex-row flex-col'>

                <Link 
                    to="/" 
                    className="absolute top-6 left-6 z-30 flex items-center gap-2 text-zinc-400 hover:text-white transition-all hover:scale-105 active:scale-95"
                >
                    {/* Icono de flecha */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    Volver al inicio
                </Link>

                {/* columna izquierda: imagen de la pizza*/}
                <div className='relative hidden w-1/3 bg-[#c8d4ef] p-6 md:flex items-center justify-center overflow-visible'>
                    {/*tarjeta que enmarca a la pizza */}
                    <div className='absolute left-16 right-16 top-1 bottom-1 rounded-xl bg-[#1e5ca7] z-10 shadow-lg'></div>
                    <div className='relative z-20 flex items-center justify-center h-full w-full overflow-visible'>
                        <img
                            src={pizzaImage}
                            alt="Pizzas Panucci's"
                            className='w-11/12 object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.5)] transform scale-125 transition-transform duration-300 hover:scale-130'
                        />
                    </div>
                </div>

                {/* columna derecha: formulario de login */}
                <div className='flex flex-col justify-center flex-1 px-8 py-12 md:px-16 text-center'>
                    
                    {/*encabezados*/}
                    <h2 className='text-3x1 font-semibold tracking-tight text-zinc-900 md:text-4x1'>
                        Bienvenidos a Pizza Panucci's
                    </h2>
                    <p className='mt-2 text-base text-zinc-600'>
                        Rellene la siguiente informacion para acceder
                    </p>

                    {/*formulario*/}
                    <form onSubmit={handleSubmit} className='mt-8 space-y-4 text-left'>

                        {/*campo de email*/}
                        <div>
                            <input
                                id='email'
                                type='email'
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder='Email'
                                className='w-full rounded-lg bg[#ede8f0] px-4 py-3 text-zinc-800 placeholder-zinc-500 outline-none transition-all border border-transparent focus:border-[#1e5aa3] focus:bg-white'
                            />
                        </div>

                        {/*campo de contraseña con botoncito de ojo*/}
                        <div className='relative'>
                            <input
                                id='password'
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder='Contraseña'
                                className='w-full rounded-lg bg[#ede8f0] px-4 py-3 pr-12 text-zinc-800 placeholder-zinc-500 outline-none transition-all border border-transparent focus:border-[#1e5aa3] focus:bg-white'
                            />
                            {/*boton de ojo para mostrar y ocultar la contraseña*/}
                            <button
                                type='button'
                                onClick={() => setShowPassword(!showPassword)}
                                className='absolute right-3 top-1/2 text-zinc-600 hover:text-zinc-800'
                            >
                                {showPassword ? (
                                    // icono de ojo abierto //
                                    <svg xmlns='http//:www.w3.org/2000/svg'  fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-5 h-5'>
                                        <path strokeLinecap='round' strokeLinejoin='round' d='M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z' />
                                        <path strokeLinecap='round' strokeLinejoin='round' d='M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z' />
                                    </svg>
                                ) : (
                                    // icono de ojo cerrado //
                                    <svg xmlns='http//:www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-5 h-5'>
                                        <path strokeLinecap='round' strokeLinejoin='round' d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.822 7.822L21 21m-2.228-2.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"/>
                                    </svg>
                                )}
                            </button>
                        </div>

                        {/*boton ingresar*/}
                        <button
                            type="submit"
                            className="w-full rounded-lg bg-[#1e5aa3] py-3 font-medium text-white shadow-md transition-colors hover:bg-[#164680] active:scale-[0.99]">
                            Ingresar
                        </button>

                        {/*boton para registro de ususario nuevo*/}
                        <div className='mt-4 text-center text-sm text-zinc-600'>
                            ¿No tienes una cuenta? 
                            <button
                                type='button'
                                className='font-semibold text-[#1e5aa3] hover:underline...'
                                onClick={() => navigate('/register')} // Cambia el console.log por esto
                            >
                                Registrate
                            </button>
                        </div>
                    </form>

                    {/*divisor or*/}
                    <div className='relative my-6 flex items-center justify-center'>
                        <div className='absolute w-full border-t border-zinc-400'></div>
                        <span className='relative bg-[#cbd5e1] px-3 text-sm text-zinc-600'>or</span>
                    </div>

                    {/*loggeo con redes sociales*/}
                    <div className='flex flex-col gap-4 sm:flex-row'>
                        {/*boton de google*/}
                        <button className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#1e5aa3] bg-transparent px-4 py-2.5 text-zinc-800 transition-colors hover:bg-zinc-100">
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5" />
                            <span className="text-sm font-medium">Google</span>
                        </button>
                    
                    {/*boton de facebook*/}
                    <button className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#1e5aa3] bg-transparent px-4 py-2.5 text-zinc-800 transition-colors hover:bg-zinc-100">
                        <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook" className="h-5 w-5" />
                        <span className="text-sm font-medium">Facebook</span>
                    </button>
                    </div>
                </div>
            </div>  
        </div>
    );
}