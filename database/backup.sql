PGDMP  9                    }           CRM    17.2    17.4 (Homebrew) 0    M           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            N           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            O           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            P           1262    24902    CRM    DATABASE     g   CREATE DATABASE "CRM" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'C';
    DROP DATABASE "CRM";
                     postgres    false            �            1255    25047    secure_select(text)    FUNCTION       CREATE FUNCTION public.secure_select(name_of_table text) RETURNS json
    LANGUAGE plpgsql
    AS $$
DECLARE
	secure_query TEXT;
	result JSON;
BEGIN
	SELECT 'SELECT jsonb_agg(t) FROM (SELECT ' || array_to_string(ARRAY(
		SELECT column_name
	        FROM information_schema.columns
	            WHERE table_name = name_of_table
	            AND column_name NOT IN('password', 'password_changed_at')
	   			 ), ',') || ' FROM ' || name_of_table || ') t'
	INTO secure_query;
	EXECUTE secure_query INTO result;
	
	RETURN result;
END;
$$;
 8   DROP FUNCTION public.secure_select(name_of_table text);
       public               postgres    false            �            1259    24916 	   customers    TABLE       CREATE TABLE public.customers (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    email character varying(150) NOT NULL,
    phone character varying(15),
    company character varying(100),
    created_at timestamp without time zone DEFAULT now() NOT NULL
);
    DROP TABLE public.customers;
       public         heap r       postgres    false            �            1259    24915    customers_id_seq    SEQUENCE     �   CREATE SEQUENCE public.customers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.customers_id_seq;
       public               postgres    false    220            Q           0    0    customers_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.customers_id_seq OWNED BY public.customers.id;
          public               postgres    false    219            �            1259    24925    interactions    TABLE     �  CREATE TABLE public.interactions (
    id integer NOT NULL,
    customer_id integer NOT NULL,
    user_id integer NOT NULL,
    type character varying(7),
    notes text,
    date timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT interaction_type_check CHECK (((type)::text = ANY ((ARRAY['call'::character varying, 'email'::character varying, 'meeting'::character varying])::text[])))
);
     DROP TABLE public.interactions;
       public         heap r       postgres    false            �            1259    24924    interaction_id_seq    SEQUENCE     �   CREATE SEQUENCE public.interaction_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.interaction_id_seq;
       public               postgres    false    222            R           0    0    interaction_id_seq    SEQUENCE OWNED BY     J   ALTER SEQUENCE public.interaction_id_seq OWNED BY public.interactions.id;
          public               postgres    false    221            �            1259    24958 	   reminders    TABLE     �   CREATE TABLE public.reminders (
    id integer NOT NULL,
    customer_id integer NOT NULL,
    user_id integer NOT NULL,
    message text NOT NULL,
    reminder_date timestamp without time zone NOT NULL
);
    DROP TABLE public.reminders;
       public         heap r       postgres    false            �            1259    24957    reminders_id_seq    SEQUENCE     �   CREATE SEQUENCE public.reminders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.reminders_id_seq;
       public               postgres    false    226            S           0    0    reminders_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.reminders_id_seq OWNED BY public.reminders.id;
          public               postgres    false    225            �            1259    24945    sales    TABLE     v  CREATE TABLE public.sales (
    id integer NOT NULL,
    customer_id integer NOT NULL,
    amount smallint NOT NULL,
    status character varying(9) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT sales_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'completed'::character varying])::text[])))
);
    DROP TABLE public.sales;
       public         heap r       postgres    false            �            1259    24944    sales_id_seq    SEQUENCE     �   CREATE SEQUENCE public.sales_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.sales_id_seq;
       public               postgres    false    224            T           0    0    sales_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.sales_id_seq OWNED BY public.sales.id;
          public               postgres    false    223            �            1259    24904    users    TABLE     �  CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    email character varying(150) NOT NULL,
    password character varying(150) NOT NULL,
    role character varying(8) DEFAULT 'employee'::character varying NOT NULL,
    password_changed_at timestamp without time zone,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['admin'::character varying, 'employee'::character varying])::text[])))
);
    DROP TABLE public.users;
       public         heap r       postgres    false            �            1259    24903    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public               postgres    false    218            U           0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public               postgres    false    217            �           2604    24919    customers id    DEFAULT     l   ALTER TABLE ONLY public.customers ALTER COLUMN id SET DEFAULT nextval('public.customers_id_seq'::regclass);
 ;   ALTER TABLE public.customers ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    220    219    220            �           2604    24928    interactions id    DEFAULT     q   ALTER TABLE ONLY public.interactions ALTER COLUMN id SET DEFAULT nextval('public.interaction_id_seq'::regclass);
 >   ALTER TABLE public.interactions ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    221    222    222            �           2604    24961    reminders id    DEFAULT     l   ALTER TABLE ONLY public.reminders ALTER COLUMN id SET DEFAULT nextval('public.reminders_id_seq'::regclass);
 ;   ALTER TABLE public.reminders ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    226    225    226            �           2604    24948    sales id    DEFAULT     d   ALTER TABLE ONLY public.sales ALTER COLUMN id SET DEFAULT nextval('public.sales_id_seq'::regclass);
 7   ALTER TABLE public.sales ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    223    224    224            �           2604    24907    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    217    218    218            D          0    24916 	   customers 
   TABLE DATA           P   COPY public.customers (id, name, email, phone, company, created_at) FROM stdin;
    public               postgres    false    220   ];       F          0    24925    interactions 
   TABLE DATA           S   COPY public.interactions (id, customer_id, user_id, type, notes, date) FROM stdin;
    public               postgres    false    222   <       J          0    24958 	   reminders 
   TABLE DATA           U   COPY public.reminders (id, customer_id, user_id, message, reminder_date) FROM stdin;
    public               postgres    false    226   �<       H          0    24945    sales 
   TABLE DATA           L   COPY public.sales (id, customer_id, amount, status, created_at) FROM stdin;
    public               postgres    false    224   �=       B          0    24904    users 
   TABLE DATA           U   COPY public.users (id, name, email, password, role, password_changed_at) FROM stdin;
    public               postgres    false    218   >       V           0    0    customers_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.customers_id_seq', 10, true);
          public               postgres    false    219            W           0    0    interaction_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.interaction_id_seq', 13, true);
          public               postgres    false    221            X           0    0    reminders_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.reminders_id_seq', 9, true);
          public               postgres    false    225            Y           0    0    sales_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.sales_id_seq', 12, true);
          public               postgres    false    223            Z           0    0    users_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.users_id_seq', 104, true);
          public               postgres    false    217            �           2606    24923    customers customers_email_key 
   CONSTRAINT     Y   ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_email_key UNIQUE (email);
 G   ALTER TABLE ONLY public.customers DROP CONSTRAINT customers_email_key;
       public                 postgres    false    220            �           2606    24921    customers customers_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.customers DROP CONSTRAINT customers_pkey;
       public                 postgres    false    220            �           2606    24933    interactions interaction_pkey 
   CONSTRAINT     [   ALTER TABLE ONLY public.interactions
    ADD CONSTRAINT interaction_pkey PRIMARY KEY (id);
 G   ALTER TABLE ONLY public.interactions DROP CONSTRAINT interaction_pkey;
       public                 postgres    false    222            �           2606    24965    reminders reminders_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.reminders
    ADD CONSTRAINT reminders_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.reminders DROP CONSTRAINT reminders_pkey;
       public                 postgres    false    226            �           2606    24951    sales sales_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.sales DROP CONSTRAINT sales_pkey;
       public                 postgres    false    224            �           2606    24914    users users_email_key 
   CONSTRAINT     Q   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
 ?   ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_key;
       public                 postgres    false    218            �           2606    24912    users users_name_key 
   CONSTRAINT     O   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_name_key UNIQUE (name);
 >   ALTER TABLE ONLY public.users DROP CONSTRAINT users_name_key;
       public                 postgres    false    218            �           2606    24910    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public                 postgres    false    218            �           2606    24934 )   interactions interaction_customer_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.interactions
    ADD CONSTRAINT interaction_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);
 S   ALTER TABLE ONLY public.interactions DROP CONSTRAINT interaction_customer_id_fkey;
       public               postgres    false    222    220    3492            �           2606    24939 %   interactions interaction_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.interactions
    ADD CONSTRAINT interaction_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
 O   ALTER TABLE ONLY public.interactions DROP CONSTRAINT interaction_user_id_fkey;
       public               postgres    false    218    222    3488            �           2606    24966 $   reminders reminders_customer_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.reminders
    ADD CONSTRAINT reminders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);
 N   ALTER TABLE ONLY public.reminders DROP CONSTRAINT reminders_customer_id_fkey;
       public               postgres    false    3492    220    226            �           2606    24971     reminders reminders_user_id_fkey    FK CONSTRAINT        ALTER TABLE ONLY public.reminders
    ADD CONSTRAINT reminders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
 J   ALTER TABLE ONLY public.reminders DROP CONSTRAINT reminders_user_id_fkey;
       public               postgres    false    226    3488    218            �           2606    24952    sales sales_customer_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);
 F   ALTER TABLE ONLY public.sales DROP CONSTRAINT sales_customer_id_fkey;
       public               postgres    false    220    3492    224            D   �   x�}�;�0��>}Z�z��
n�!�8�|�����l������^���{Չ�����v]�y�⤐4�<���m�}�.r�� [�Vac�Ud��f���h�wְ&T��K��fHf�۩��fNf(�>�C2��ɬ5��;��� �cB�#j��s�C>t,��FJ�x�s�      F   �   x�}�M�0��p�^ 2-T~�z�nH�I��i��6��ɬ&y_�����\,��L�؂����FSL�*]bS��ԃl�Nk�u!�lH�e�FZs�;��e���<�K�r\�B�z��<hN.��i�����P�g��W�G�P���8fh�R�D��|��
���5$��ת(��5X;      J   �   x�]���0���)�0�Z~�)����K�%+KJ��=���盱�A�5�{������;V�!�n�hc�J�Ec�v���� �U
g�n��yp#�ۊ���P����Ɩ&���������-���*�tw�p���vu�C`!�����w���Fnk����^l)��PJ��gM=      H   _   x��α� E��1�H�(��)1&����P�S�Il�]���Bёa��Đ(6���fA��^툹��k.�Y�_�@�K����^�1��2�      B   S  x�m��r�0 �sx�@Pl�Ul�
�ʟ:^�FPx��x��e���,�e0�XD~�����Q1�9(d �AS����E<4����Or�:��nMé�v��-?!�=fY�<g�>fxK)8,(C�s'}@�K�ǲar��Mg2�$P��O�5/?]������΁�(������� L���ѫ� }�e�Yc�rLy�G��9��l�_�bt3R�yU%��5���??ߡ!���A��>dg/�iWRJf#8R�P}���W�m-nyq]Iץ����cEz
�s��F 5�齰j�����
8Z������~RX���hE�Rϝ��Vb�M��Q�?��     