'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from './lib/supabase';

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  stock: number;
  badge?: string;
};

type CartItem = {
  product: Product;
  quantity: number;
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(price);

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState('Todos');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      setError('');

      const { data, error } = await supabase
        .from('products')
        .select(
          'id, name, description, price, stock, image_url, category, active'
        )
        .eq('active', true)
        .order('id', { ascending: true });

      if (error) {
        console.error('Error al cargar productos:', error);
        setError(
          'No pudimos cargar los juguetes. Comprueba tu conexión e inténtalo nuevamente.'
        );
        setLoading(false);
        return;
      }

      const loadedProducts: Product[] = (data ?? []).map((item) => ({
        id: Number(item.id),
        name: item.name,
        category: item.category || 'Otros',
        price: Number(item.price),
        description: item.description || '',
        image: item.image_url || '',
        stock: Number(item.stock ?? 0),
        badge:
          item.name === 'Conejita de peluche'
            ? 'Favorito'
            : item.name === 'Bloques de madera'
              ? 'Educativo'
              : undefined,
      }));

      setProducts(loadedProducts);
      setLoading(false);
    }

    loadProducts();
  }, []);

  const categories = useMemo(
    () => ['Todos', ...new Set(products.map((product) => product.category))],
    [products]
  );

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        category === 'Todos' || product.category === category;

      const matchesSearch = [
        product.name,
        product.description,
        product.category,
      ]
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [products, category, search]);

  const cartCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  function addToCart(product: Product) {
    if (product.stock <= 0) {
      alert('Este juguete no está disponible por el momento. 💗');
      return;
    }

    setCart((current) => {
      const existing = current.find(
        (item) => item.product.id === product.id
      );

      if (existing) {
        if (existing.quantity >= product.stock) {
          alert('No hay más unidades disponibles de este juguete. 🧸');
          return current;
        }

        return current.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...current, { product, quantity: 1 }];
    });

    setCartOpen(true);
  }

  function changeQuantity(productId: number, change: number) {
    setCart((current) =>
      current
        .map((item) => {
          if (item.product.id !== productId) return item;

          const newQuantity = item.quantity + change;

          if (newQuantity > item.product.stock) {
            return item;
          }

          return { ...item, quantity: newQuantity };
        })
        .filter((item) => item.quantity > 0)
    );
  }

  function checkoutWhatsApp() {
    // Reemplaza este valor por el WhatsApp real de EliBoo.
    // Usa indicativo de país, sin +, espacios ni guiones.
    const whatsappNumber = '573135609207';

    if (cart.length === 0) {
      alert('Tu carrito está vacío. ¡Agrega tus juguetes favoritos! 💗');
      return;
    }

    if (whatsappNumber.includes('X')) {
      alert(
        'Antes de recibir pedidos, configura el número de WhatsApp de EliBoo en app/page.tsx.'
      );
      return;
    }

    const lines = cart.map(
      ({ product, quantity }) =>
        `• ${product.name} x${quantity} — ${formatPrice(
          product.price * quantity
        )}`
    );

    const message = [
      '¡Hola, EliBoo! 🧸💗 Quiero hacer este pedido:',
      '',
      ...lines,
      '',
      `*Total de productos: ${formatPrice(total)}*`,
      '',
      '¿Me ayudan a confirmar disponibilidad y envío?',
    ].join('\n');

    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
      '_blank',
      'noopener,noreferrer'
    );
  }

  return (
    <main>
      <div className="announcement">
        Un mundo de ternura te espera <span>♡</span> Envíos por confirmar
        según tu ciudad
      </div>

      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="EliBoo, inicio">
          <img
            src="/eliboo-logo.png"
            alt="Logo EliBoo: osito y letras pastel"
          />
        </a>

        <nav className="desktop-nav" aria-label="Navegación principal">
          <a href="#inicio">Inicio</a>
          <a href="#catalogo">Catálogo</a>
          <a href="#nosotros">Nosotros</a>
          <a href="#contacto">Contacto</a>
        </nav>

        <button
          className="cart-trigger"
          onClick={() => setCartOpen(true)}
          aria-label={`Abrir carrito, ${cartCount} productos`}
        >
          <span className="cart-icon">♡</span>
          <span>Mi carrito</span>
          <b>{cartCount}</b>
        </button>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-copy">
          <span className="eyebrow">✿ JUGUETES CON AMOR</span>

          <h1>
            Juguetes que hacen crecer <em>momentos felices</em> ♡
          </h1>

          <p>
            Descubre un mundo de juegos, imaginación y pequeñas sonrisas.
            Elegimos cada detalle para acompañar sus grandes aventuras.
          </p>

          <a className="button button-primary" href="#catalogo">
            Explorar catálogo <span>→</span>
          </a>

          <div className="hero-note">
            <span>♡</span> Hecho para jugar, descubrir y soñar.
          </div>
        </div>

        <div
          className="hero-art"
          role="img"
          aria-label="Selección de juguetes tiernos en tonos pastel"
        >
          <div className="art-halo"></div>
          <div className="floating-heart heart-one">♥</div>
          <div className="floating-heart heart-two">✦</div>

          <div className="toy-stage">
            <div className="rainbow">
              <i></i>
              <i></i>
              <i></i>
              <i></i>
            </div>

            <div className="toy-bear">🧸</div>
            <div className="toy-block block-one"></div>
            <div className="toy-block block-two"></div>
            <div className="toy-block block-three"></div>
          </div>

          <div className="art-caption">
            Pequeños juguetes, grandes recuerdos
          </div>
        </div>
      </section>

      <section className="benefits" aria-label="Beneficios">
        <div className="benefit">
          <span className="benefit-icon pink">♡</span>
          <div>
            <strong>Detalles que enamoran</strong>
            <small>Elegidos con cariño</small>
          </div>
        </div>

        <div className="benefit">
          <span className="benefit-icon lilac">✧</span>
          <div>
            <strong>Juego e imaginación</strong>
            <small>Ideas para cada etapa</small>
          </div>
        </div>

        <div className="benefit">
          <span className="benefit-icon peach">♧</span>
          <div>
            <strong>Compra acompañada</strong>
            <small>Te ayudamos por WhatsApp</small>
          </div>
        </div>
      </section>

      <section className="catalog-section" id="catalogo">
        <div className="section-heading">
          <div>
            <span className="eyebrow">NUESTROS FAVORITOS</span>

            <h2>
              Un juguete para cada aventura <span>♡</span>
            </h2>

            <p>
              Encuentra ese detalle especial para llenar sus días de magia.
            </p>
          </div>

          <span className="product-count">
            {loading ? 'Cargando...' : `${filteredProducts.length} productos`}
          </span>
        </div>

        <div className="catalog-tools">
          <div className="category-pills" aria-label="Filtrar por categoría">
            {categories.map((item) => (
              <button
                key={item}
                className={category === item ? 'pill active' : 'pill'}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <label className="search-box">
            <span>⌕</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Busca tu próximo favorito..."
            />
          </label>
        </div>

        {loading && (
          <div className="empty-state">
            🧸 Estamos preparando un mundo de juguetes para ti...
          </div>
        )}

        {!loading && error && (
          <div className="empty-state">
            <p>{error}</p>
            <button
              className="button button-primary"
              onClick={() => window.location.reload()}
            >
              Intentar nuevamente
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <article className="product-card" key={product.id}>
                  <div className="product-image-wrap">
                    {product.badge && (
                      <span className="product-badge">{product.badge}</span>
                    )}

                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="product-image"
                        loading="lazy"
                      />
                    ) : (
                      <div className="product-image empty-state">
                        🧸
                      </div>
                    )}

                    <button
                      className="favorite"
                      aria-label={`Guardar ${product.name}`}
                      onClick={(event) =>
                        event.currentTarget.classList.toggle('is-favorite')
                      }
                    >
                      ♡
                    </button>
                  </div>

                  <div className="product-info">
                    <span className="product-category">
                      {product.category}
                    </span>

                    <h3>{product.name}</h3>
                    <p>{product.description}</p>

                    <div className="product-bottom">
                      <strong>{formatPrice(product.price)}</strong>

                      {product.stock > 0 ? (
                        <button
                          className="add-button"
                          onClick={() => addToCart(product)}
                        >
                          ＋ <span>Agregar</span>
                        </button>
                      ) : (
                        <button className="add-button" disabled>
                          Agotado
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="empty-state">
                No encontramos juguetes con esa búsqueda. Intenta con otra
                palabra 💗
              </div>
            )}
          </>
        )}
      </section>

      <section className="love-banner" id="nosotros">
        <div className="love-sticker">♡</div>

        <div>
          <span className="eyebrow">BIENVENIDOS A ELIBOO</span>

          <h2>
            La infancia está hecha de pequeños grandes momentos.
          </h2>

          <p>
            Queremos ayudarte a encontrar juguetes que inspiren historias,
            despierten curiosidad y se conviertan en recuerdos bonitos.
          </p>
        </div>

        <a className="button button-light" href="#catalogo">
          Conocer juguetes →
        </a>
      </section>

      <footer id="contacto">
        <a className="footer-brand" href="#inicio">
          EliBoo <span>♡</span>
        </a>

        <p>Un poquito de magia en cada juego.</p>

        <div className="footer-links">
          <a href="#catalogo">Catálogo</a>
          <a href="#nosotros">Nuestra historia</a>
          <button onClick={() => setCartOpen(true)}>Ver carrito</button>
        </div>

        <small>© {new Date().getFullYear()} EliBoo. Hecho con amor.</small>
      </footer>

      {cartOpen && (
        <div
          className="drawer-backdrop"
          onClick={() => setCartOpen(false)}
        >
          <aside
            className="cart-drawer"
            onClick={(event) => event.stopPropagation()}
            aria-label="Tu carrito"
          >
            <div className="drawer-heading">
              <div>
                <span className="eyebrow">TU SELECCIÓN</span>
                <h2>
                  Mi carrito <span>♡</span>
                </h2>
              </div>

              <button
                className="close-button"
                onClick={() => setCartOpen(false)}
                aria-label="Cerrar carrito"
              >
                ×
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="cart-empty">
                <span>🧸</span>
                <h3>Tu carrito está esperando magia</h3>
                <p>Agrega tus juguetes favoritos y aparecerán aquí.</p>

                <button
                  className="button button-primary"
                  onClick={() => {
                    setCartOpen(false);
                    document
                      .getElementById('catalogo')
                      ?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Explorar juguetes
                </button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map(({ product, quantity }) => (
                    <div className="cart-item" key={product.id}>
                      <img src={product.image} alt={product.name} />

                      <div className="cart-item-main">
                        <strong>{product.name}</strong>
                        <b>{formatPrice(product.price)}</b>

                        <div className="quantity-control">
                          <button
                            onClick={() => changeQuantity(product.id, -1)}
                            aria-label="Quitar uno"
                          >
                            −
                          </button>

                          <span>{quantity}</span>

                          <button
                            onClick={() => changeQuantity(product.id, 1)}
                            aria-label="Agregar uno"
                            disabled={quantity >= product.stock}
                          >
                            ＋
                          </button>
                        </div>
                      </div>

                      <button
                        className="remove-item"
                        onClick={() =>
                          setCart((current) =>
                            current.filter(
                              (item) => item.product.id !== product.id
                            )
                          )
                        }
                        aria-label={`Eliminar ${product.name}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                <div className="cart-summary">
                  <div>
                    <span>Subtotal</span>
                    <strong>{formatPrice(total)}</strong>
                  </div>

                  <p>
                    El costo de envío se confirma por WhatsApp según tu
                    ubicación.
                  </p>

                  <div className="total-line">
                    <span>Total de productos</span>
                    <strong>{formatPrice(total)}</strong>
                  </div>

                  <button
                    className="whatsapp-button"
                    onClick={checkoutWhatsApp}
                  >
                    <span>☏</span> Finalizar pedido por WhatsApp
                  </button>

                  <small>
                    Tu pedido se confirmará directamente con EliBoo.
                  </small>
                </div>
              </>
            )}
          </aside>
        </div>
      )}
    </main>
  );
}