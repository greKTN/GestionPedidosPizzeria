require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const app = express();

// Middlewares
app.use(cors()); // Permite que React se conecte
app.use(express.json()); // Permite recibir datos en formato JSON (para el carrito)

// Permite servir archivos estáticos (nuestro bucket local de imágenes)
app.use(express.static(path.join(__dirname, '../public/images')));
console.log("Ruta estática apuntando a:", path.join(__dirname, '../../public'));

/**
 * nombre de la funcion: Conexión a PostgreSQL (Instancia de Pool)
 * parametros: Objeto de configuración con credenciales tomadas de process.env
 * retorno: Objeto 'pool' para realizar consultas a la base de datos.
 * funcionalidad: Establece y gestiona un pool de conexiones seguras hacia la base de datos PostgreSQL usando las variables de entorno (.env) para proteger los datos sensibles del servidor.
 */
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
});

// Prueba de conexion a la DB al iniciar el servidor
pool.connect()
    .then(() => console.log('🔥 Conexión exitosa a PostgreSQL'))
    .catch(err => console.error('Error conectando a la BD', err));


// --- RUTAS DE LA API ---

/**
 * nombre de la funcion: Callback de la ruta GET '/api/productos'
 * parametros: req (Object) - Petición del cliente, res (Object) - Objeto de respuesta de Express.
 * retorno: Promise<void> - Envía una respuesta HTTP en formato JSON.
 * funcionalidad: Ejecuta una consulta SQL relacional combinando la tabla madre 'pizzas' con la tabla hija 'variantes' mediante un LEFT JOIN. Utiliza 'json_agg' para empaquetar las tallas correspondientes dentro de cada pizza y devuelve el catálogo estructurado al frontend.
 */
app.get('/api/productos', async (req, res) => {
    try {
        const query = `
            SELECT 
                p.id_pizza AS id_producto,
                p.nombre,
                p.descripcion,
                p.imagen_url,
                json_agg(
                    json_build_object(
                        'id_variante', v.id_variante,
                        'tamano', v.tamano,
                        'precio', v.precio
                    )
                ) AS variantes
            FROM pizzas p
            LEFT JOIN variantes v ON p.id_pizza = v.id_pizza
            GROUP BY p.id_pizza, p.nombre, p.descripcion, p.imagen_url
            ORDER BY p.id_pizza;
        `;
        const resultado = await pool.query(query);
        
        // Enviamos el paquete listo con la pizza y sus variantes por dentro
        res.json(resultado.rows); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

/**
 * nombre de la funcion: Callback de la ruta GET '/api/opciones'
 * parametros: req (Object) - Petición del cliente, res (Object) - Objeto de respuesta de Express.
 * retorno: Promise<void> - Envía una respuesta HTTP en formato JSON.
 * funcionalidad: Consulta la tabla 'Opcion_Extra' en PostgreSQL para obtener la lista de todos los ingredientes adicionales o personalizaciones disponibles para el usuario y los envía al cliente.
 */
app.get('/api/opciones', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM Opcion_Extra');
        res.json(resultado.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las opciones extra' });
    }
});

app.post('/api/register', async (req, res) => {
    // Estos nombres deben coincidir con los que envías desde el React
    const { nombre, email, password, telefono } = req.body;

    try {
        // 1. Verificamos si el correo ya está registrado en la cocina (DB)
        const userCheck = await pool.query('SELECT * FROM usuario WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ message: 'Ese correo ya está registrado' });
        }

        // 2. Encriptamos la contraseña (esto genera el password_hash)
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);

        // 3. Insertamos el nuevo usuario en la tabla
        const query = `
            INSERT INTO usuario (nombre, email, password_hash, telefono) 
            VALUES ($1, $2, $3, $4) RETURNING id_usuario, nombre, email;
        `;
        const values = [nombre, email, password_hash, telefono];
        const nuevoUsuario = await pool.query(query, values);

        // Le avisamos al mesero (React) que todo salió fino
        res.status(201).json({ message: 'Usuario registrado con éxito', user: nuevoUsuario.rows[0] });

    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ message: 'Error interno del servidor al registrar.' });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Buscamos al usuario por correo
        const resultado = await pool.query('SELECT * FROM usuario WHERE email = $1', [email]);
        
        if (resultado.rows.length === 0) {
            return res.status(401).json({ message: 'Correo o contraseña incorrectos.' });
        }

        const usuario = resultado.rows[0];

        // 2. Comparamos la contraseña que escribió el cliente con el hash de la DB
        const passwordValida = await bcrypt.compare(password, usuario.password_hash);

        if (!passwordValida) {
            return res.status(401).json({ message: 'Correo o contraseña incorrectos.' });
        }

        // 3. Si pasó las pruebas, le damos acceso
        res.json({ 
            message: 'Login exitoso', 
            user: { id: usuario.id_usuario, nombre: usuario.nombre, email: usuario.email } 
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ message: 'Error interno del servidor al iniciar sesión.' });
    }
});

/**
 * POST /api/pedidos
 * Recibe el carrito y registra el pedido completo en la base de datos.
 */
app.post('/api/pedidos', async (req, res) => {
    const { id_usuario, tipo_entrega, total, items } = req.body;
    
    // Obtenemos un cliente dedicado del pool para hacer la transacción segura
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN'); // Iniciamos la transacción

        // 1. Crear el registro en la tabla 'pedido'
        const queryPedido = `
            INSERT INTO pedido (id_usuario, tipo_entrega, estado_pedido, total, fecha_creacion)
            VALUES ($1, $2, $3, $4, NOW()) RETURNING id_pedido;
        `;
        const resPedido = await client.query(queryPedido, [id_usuario, tipo_entrega, 'Preparando', total]);
        const id_pedido = resPedido.rows[0].id_pedido;

        // 2. Recorrer las pizzas compradas
        for (let item of items) {
            // Se inserta en detalle_pedido y pedimos que nos devuelva el id_detalle generado
            const queryDetalle = `
                INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, subtotal)
                VALUES ($1, $2, $3, $4) RETURNING id_detalle;
            `;
            const subtotal = (item.precio_final || item.precio) * item.cantidad;
            const resDetalle = await client.query(queryDetalle, [id_pedido, item.id_producto, item.cantidad, subtotal]);
            const id_detalle = resDetalle.rows[0].id_detalle;

            // 3. Si la pizza tiene extras, los guardamos en personalizacion_detalle
            if (item.extras && item.extras.length > 0) {
                for (let extra of item.extras) {
                    const queryExtra = `
                        INSERT INTO personalizacion_detalle (id_detalle, id_opcion)
                        VALUES ($1, $2);
                    `;
                    await client.query(queryExtra, [id_detalle, extra.id_opcion]);
                }
            }
        }

        // 4. Registrar el pago en la tabla 'pago'
        const queryPago = `
            INSERT INTO pago (id_pedido, estado_pago)
            VALUES ($1, $2);
        `;
        await client.query(queryPago, [id_pedido, 'Completado']);

        await client.query('COMMIT'); // Confirmamos y guardamos todo
        res.status(201).json({ message: 'Pedido registrado con éxito', id_pedido });

    } catch (error) {
        await client.query('ROLLBACK'); // Si algo explota, deshacemos todo
        console.error('Error al registrar pedido:', error);
        res.status(500).json({ error: 'Error interno al procesar el pedido' });
    } finally {
        client.release(); // Soltamos la conexión
    }
});

/**
 * nombre de la funcion: Callback de inicialización del servidor (app.listen)
 * parametros: Ninguno.
 * retorno: void.
 * funcionalidad: Abre el puerto especificado en las variables de entorno (o el 3000 por defecto) para empezar a escuchar peticiones HTTP entrantes, mostrando un mensaje de confirmación en la consola.
 */
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});