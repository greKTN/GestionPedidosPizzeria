--
-- PostgreSQL database dump
--



-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

-- Started on 2026-06-07 12:57:22

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 228 (class 1259 OID 16431)
-- Name: detalle_pedido; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.detalle_pedido (
    id_detalle integer NOT NULL,
    id_pedido integer,
    id_producto integer,
    cantidad integer,
    subtotal numeric(10,2)
);


ALTER TABLE public.detalle_pedido OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16430)
-- Name: detalle_pedido_id_detalle_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.detalle_pedido_id_detalle_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.detalle_pedido_id_detalle_seq OWNER TO postgres;

--
-- TOC entry 5050 (class 0 OID 0)
-- Dependencies: 227
-- Name: detalle_pedido_id_detalle_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.detalle_pedido_id_detalle_seq OWNED BY public.detalle_pedido.id_detalle;


--
-- TOC entry 224 (class 1259 OID 16410)
-- Name: opcion_extra; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.opcion_extra (
    id_opcion integer NOT NULL,
    categoria character varying(50),
    nombre character varying(100),
    precio_adicional numeric(8,2)
);


ALTER TABLE public.opcion_extra OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16409)
-- Name: opcion_extra_id_opcion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.opcion_extra_id_opcion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.opcion_extra_id_opcion_seq OWNER TO postgres;

--
-- TOC entry 5051 (class 0 OID 0)
-- Dependencies: 223
-- Name: opcion_extra_id_opcion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.opcion_extra_id_opcion_seq OWNED BY public.opcion_extra.id_opcion;


--
-- TOC entry 231 (class 1259 OID 16466)
-- Name: pago; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pago (
    id_pago integer NOT NULL,
    id_pedido integer,
    comprobante_url text,
    estado_pago character varying(50)
);


ALTER TABLE public.pago OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 16465)
-- Name: pago_id_pago_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pago_id_pago_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pago_id_pago_seq OWNER TO postgres;

--
-- TOC entry 5052 (class 0 OID 0)
-- Dependencies: 230
-- Name: pago_id_pago_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pago_id_pago_seq OWNED BY public.pago.id_pago;


--
-- TOC entry 226 (class 1259 OID 16418)
-- Name: pedido; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pedido (
    id_pedido integer NOT NULL,
    id_usuario integer,
    tipo_entrega character varying(50),
    estado_pedido character varying(50),
    total numeric(10,2),
    fecha_creacion timestamp without time zone
);


ALTER TABLE public.pedido OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16417)
-- Name: pedido_id_pedido_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pedido_id_pedido_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pedido_id_pedido_seq OWNER TO postgres;

--
-- TOC entry 5053 (class 0 OID 0)
-- Dependencies: 225
-- Name: pedido_id_pedido_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pedido_id_pedido_seq OWNED BY public.pedido.id_pedido;


--
-- TOC entry 229 (class 1259 OID 16448)
-- Name: personalizacion_detalle; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.personalizacion_detalle (
    id_detalle integer NOT NULL,
    id_opcion integer NOT NULL
);


ALTER TABLE public.personalizacion_detalle OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16507)
-- Name: pizzas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pizzas (
    id_pizza integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text,
    imagen_url text
);


ALTER TABLE public.pizzas OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 16506)
-- Name: pizzas_id_pizza_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pizzas_id_pizza_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pizzas_id_pizza_seq OWNER TO postgres;

--
-- TOC entry 5054 (class 0 OID 0)
-- Dependencies: 232
-- Name: pizzas_id_pizza_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pizzas_id_pizza_seq OWNED BY public.pizzas.id_pizza;


--
-- TOC entry 222 (class 1259 OID 16400)
-- Name: producto; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.producto (
    id_producto integer NOT NULL,
    nombre character varying(100),
    descripcion text,
    precio_base numeric(8,2),
    imagen_url text
);


ALTER TABLE public.producto OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16399)
-- Name: producto_id_producto_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.producto_id_producto_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.producto_id_producto_seq OWNER TO postgres;

--
-- TOC entry 5055 (class 0 OID 0)
-- Dependencies: 221
-- Name: producto_id_producto_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.producto_id_producto_seq OWNED BY public.producto.id_producto;


--
-- TOC entry 220 (class 1259 OID 16390)
-- Name: usuario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuario (
    id_usuario integer NOT NULL,
    nombre character varying(100),
    email character varying(150),
    password_hash character varying(255),
    telefono character varying(20)
);


ALTER TABLE public.usuario OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16389)
-- Name: usuario_id_usuario_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuario_id_usuario_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuario_id_usuario_seq OWNER TO postgres;

--
-- TOC entry 5056 (class 0 OID 0)
-- Dependencies: 219
-- Name: usuario_id_usuario_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuario_id_usuario_seq OWNED BY public.usuario.id_usuario;


--
-- TOC entry 235 (class 1259 OID 16518)
-- Name: variantes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.variantes (
    id_variante integer NOT NULL,
    id_pizza integer,
    tamano character varying(50) NOT NULL,
    precio numeric(10,2) NOT NULL
);


ALTER TABLE public.variantes OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 16517)
-- Name: variantes_id_variante_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.variantes_id_variante_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.variantes_id_variante_seq OWNER TO postgres;

--
-- TOC entry 5057 (class 0 OID 0)
-- Dependencies: 234
-- Name: variantes_id_variante_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.variantes_id_variante_seq OWNED BY public.variantes.id_variante;


--
-- TOC entry 4852 (class 2604 OID 16434)
-- Name: detalle_pedido id_detalle; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalle_pedido ALTER COLUMN id_detalle SET DEFAULT nextval('public.detalle_pedido_id_detalle_seq'::regclass);


--
-- TOC entry 4850 (class 2604 OID 16413)
-- Name: opcion_extra id_opcion; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.opcion_extra ALTER COLUMN id_opcion SET DEFAULT nextval('public.opcion_extra_id_opcion_seq'::regclass);


--
-- TOC entry 4853 (class 2604 OID 16469)
-- Name: pago id_pago; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pago ALTER COLUMN id_pago SET DEFAULT nextval('public.pago_id_pago_seq'::regclass);


--
-- TOC entry 4851 (class 2604 OID 16421)
-- Name: pedido id_pedido; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedido ALTER COLUMN id_pedido SET DEFAULT nextval('public.pedido_id_pedido_seq'::regclass);


--
-- TOC entry 4854 (class 2604 OID 16510)
-- Name: pizzas id_pizza; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pizzas ALTER COLUMN id_pizza SET DEFAULT nextval('public.pizzas_id_pizza_seq'::regclass);


--
-- TOC entry 4849 (class 2604 OID 16403)
-- Name: producto id_producto; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producto ALTER COLUMN id_producto SET DEFAULT nextval('public.producto_id_producto_seq'::regclass);


--
-- TOC entry 4848 (class 2604 OID 16393)
-- Name: usuario id_usuario; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario ALTER COLUMN id_usuario SET DEFAULT nextval('public.usuario_id_usuario_seq'::regclass);


--
-- TOC entry 4855 (class 2604 OID 16521)
-- Name: variantes id_variante; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.variantes ALTER COLUMN id_variante SET DEFAULT nextval('public.variantes_id_variante_seq'::regclass);


--
-- TOC entry 5037 (class 0 OID 16431)
-- Dependencies: 228
-- Data for Name: detalle_pedido; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.detalle_pedido (id_detalle, id_pedido, id_producto, cantidad, subtotal) FROM stdin;
1	1	1	1	19.00
2	2	2	1	24.50
\.


--
-- TOC entry 5033 (class 0 OID 16410)
-- Dependencies: 224
-- Data for Name: opcion_extra; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.opcion_extra (id_opcion, categoria, nombre, precio_adicional) FROM stdin;
1	Borde	Borde relleno de queso	3.00
2	Borde	Borde de salchicha	4.00
3	Topping	Extra Champiñones	2.00
4	Topping	Extra Tocineta	2.50
\.


--
-- TOC entry 5040 (class 0 OID 16466)
-- Dependencies: 231
-- Data for Name: pago; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pago (id_pago, id_pedido, comprobante_url, estado_pago) FROM stdin;
\.


--
-- TOC entry 5035 (class 0 OID 16418)
-- Dependencies: 226
-- Data for Name: pedido; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pedido (id_pedido, id_usuario, tipo_entrega, estado_pedido, total, fecha_creacion) FROM stdin;
1	1	Delivery	Entregado	19.00	2026-06-05 19:30:00
2	3	Recogida en tienda	Preparando	24.50	2026-06-06 10:15:00
\.


--
-- TOC entry 5038 (class 0 OID 16448)
-- Dependencies: 229
-- Data for Name: personalizacion_detalle; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.personalizacion_detalle (id_detalle, id_opcion) FROM stdin;
1	1
2	4
\.


--
-- TOC entry 5042 (class 0 OID 16507)
-- Dependencies: 233
-- Data for Name: pizzas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pizzas (id_pizza, nombre, descripcion, imagen_url) FROM stdin;
1	Hawaiiana Respetable	Los haters de nuestra pizza hawaiiana no existen, con sus tomates cherry, aceitunas y trozos de piña, esta pizza es un viaje de ida y vuelta a la hermosa isla de hawaii	/images/hawaiiana.jpg
2	Arizona Peperonni	Clasica pizza de peperonni con full queso	/images/peperonni.jpg
3	Beggin  Veggie	favorita de los vegetarianos, con ingredientes naturales, trozos de zanahoria, pimenton, cebolla	/images/veggie.jpg
4	La italiana	traida desde italia con sus aceitunas, peperonni, trozos de cebolla y pimenton	/images/italiana.jpg
\.


--
-- TOC entry 5031 (class 0 OID 16400)
-- Dependencies: 222
-- Data for Name: producto; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.producto (id_producto, nombre, descripcion, precio_base, imagen_url) FROM stdin;
1	Arizona's Peperonni (Mediana)	Clásica pizza de pepperoni con full queso.	16.00	\N
2	Arizona's Peperonni (Grande)	Clásica pizza de pepperoni con full queso.	22.00	\N
3	Hawaiiana Respetable (Mediana)	Jamón, piña fresca en trozos y extra queso mozzarella.	16.00	\N
4	Hawaiiana Respetable (Grande)	Jamón, piña fresca en trozos y extra queso mozzarella.	22.00	\N
5	Beggin' Veggie (Mediana)	Pimentón, cebolla, champiñones, aceitunas y maíz.	16.00	\N
\.


--
-- TOC entry 5029 (class 0 OID 16390)
-- Dependencies: 220
-- Data for Name: usuario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuario (id_usuario, nombre, email, password_hash, telefono) FROM stdin;
1	Arnoldo Hernandez	arnoloH@gmail.com	hash_falso_123	0414-1234567
2	Gregorit Brito	gregorit2b@gmail.com	1qx4srt3efa	0414-7848740
3	Jose Hernandez	josejose123@gmail.com	wqds34djoa	0422-5674345
\.


--
-- TOC entry 5044 (class 0 OID 16518)
-- Dependencies: 235
-- Data for Name: variantes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.variantes (id_variante, id_pizza, tamano, precio) FROM stdin;
1	1	Mediana	16.00
2	1	Grande	22.00
5	2	Mediana	15.00
6	2	Grande	21.00
7	3	Mediana	19.00
8	3	Grande	25.00
9	4	Mediana	16.00
10	4	Grande	22.00
\.


--
-- TOC entry 5058 (class 0 OID 0)
-- Dependencies: 227
-- Name: detalle_pedido_id_detalle_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.detalle_pedido_id_detalle_seq', 2, true);


--
-- TOC entry 5059 (class 0 OID 0)
-- Dependencies: 223
-- Name: opcion_extra_id_opcion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.opcion_extra_id_opcion_seq', 4, true);


--
-- TOC entry 5060 (class 0 OID 0)
-- Dependencies: 230
-- Name: pago_id_pago_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pago_id_pago_seq', 1, false);


--
-- TOC entry 5061 (class 0 OID 0)
-- Dependencies: 225
-- Name: pedido_id_pedido_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pedido_id_pedido_seq', 2, true);


--
-- TOC entry 5062 (class 0 OID 0)
-- Dependencies: 232
-- Name: pizzas_id_pizza_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pizzas_id_pizza_seq', 4, true);


--
-- TOC entry 5063 (class 0 OID 0)
-- Dependencies: 221
-- Name: producto_id_producto_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.producto_id_producto_seq', 5, true);


--
-- TOC entry 5064 (class 0 OID 0)
-- Dependencies: 219
-- Name: usuario_id_usuario_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuario_id_usuario_seq', 3, true);


--
-- TOC entry 5065 (class 0 OID 0)
-- Dependencies: 234
-- Name: variantes_id_variante_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.variantes_id_variante_seq', 10, true);


--
-- TOC entry 4865 (class 2606 OID 16437)
-- Name: detalle_pedido detalle_pedido_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalle_pedido
    ADD CONSTRAINT detalle_pedido_pkey PRIMARY KEY (id_detalle);


--
-- TOC entry 4861 (class 2606 OID 16416)
-- Name: opcion_extra opcion_extra_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.opcion_extra
    ADD CONSTRAINT opcion_extra_pkey PRIMARY KEY (id_opcion);


--
-- TOC entry 4869 (class 2606 OID 16474)
-- Name: pago pago_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pago
    ADD CONSTRAINT pago_pkey PRIMARY KEY (id_pago);


--
-- TOC entry 4863 (class 2606 OID 16424)
-- Name: pedido pedido_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedido
    ADD CONSTRAINT pedido_pkey PRIMARY KEY (id_pedido);


--
-- TOC entry 4867 (class 2606 OID 16454)
-- Name: personalizacion_detalle personalizacion_detalle_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personalizacion_detalle
    ADD CONSTRAINT personalizacion_detalle_pkey PRIMARY KEY (id_detalle, id_opcion);


--
-- TOC entry 4871 (class 2606 OID 16516)
-- Name: pizzas pizzas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pizzas
    ADD CONSTRAINT pizzas_pkey PRIMARY KEY (id_pizza);


--
-- TOC entry 4859 (class 2606 OID 16408)
-- Name: producto producto_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producto
    ADD CONSTRAINT producto_pkey PRIMARY KEY (id_producto);


--
-- TOC entry 4857 (class 2606 OID 16398)
-- Name: usuario usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id_usuario);


--
-- TOC entry 4873 (class 2606 OID 16526)
-- Name: variantes variantes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.variantes
    ADD CONSTRAINT variantes_pkey PRIMARY KEY (id_variante);


--
-- TOC entry 4875 (class 2606 OID 16438)
-- Name: detalle_pedido detalle_pedido_id_pedido_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalle_pedido
    ADD CONSTRAINT detalle_pedido_id_pedido_fkey FOREIGN KEY (id_pedido) REFERENCES public.pedido(id_pedido);


--
-- TOC entry 4876 (class 2606 OID 16443)
-- Name: detalle_pedido detalle_pedido_id_producto_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalle_pedido
    ADD CONSTRAINT detalle_pedido_id_producto_fkey FOREIGN KEY (id_producto) REFERENCES public.producto(id_producto);


--
-- TOC entry 4879 (class 2606 OID 16475)
-- Name: pago pago_id_pedido_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pago
    ADD CONSTRAINT pago_id_pedido_fkey FOREIGN KEY (id_pedido) REFERENCES public.pedido(id_pedido);


--
-- TOC entry 4874 (class 2606 OID 16425)
-- Name: pedido pedido_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedido
    ADD CONSTRAINT pedido_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario);


--
-- TOC entry 4877 (class 2606 OID 16455)
-- Name: personalizacion_detalle personalizacion_detalle_id_detalle_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personalizacion_detalle
    ADD CONSTRAINT personalizacion_detalle_id_detalle_fkey FOREIGN KEY (id_detalle) REFERENCES public.detalle_pedido(id_detalle);


--
-- TOC entry 4878 (class 2606 OID 16460)
-- Name: personalizacion_detalle personalizacion_detalle_id_opcion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personalizacion_detalle
    ADD CONSTRAINT personalizacion_detalle_id_opcion_fkey FOREIGN KEY (id_opcion) REFERENCES public.opcion_extra(id_opcion);


--
-- TOC entry 4880 (class 2606 OID 16527)
-- Name: variantes variantes_id_pizza_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.variantes
    ADD CONSTRAINT variantes_id_pizza_fkey FOREIGN KEY (id_pizza) REFERENCES public.pizzas(id_pizza) ON DELETE CASCADE;


-- Completed on 2026-06-07 12:57:22

--
-- PostgreSQL database dump complete
--


