/* Design philosophy: editorial food branding — cream paper canvas, saffron signature accents, olive structure, asymmetric menu layout. */
import { useMemo, useState } from "react";
import { Search, ShoppingBag, Plus, Minus, X, Clock3, MapPin, Phone, ArrowLeft, Sparkles, Utensils, Soup, Sandwich, CupSoda } from "lucide-react";

type Category = "همه" | "ساندویچ‌ها" | "سوخاری‌ها" | "نوشیدنی‌ها";
type Product = { id: number; name: string; price: number; category: Exclude<Category, "همه">; image?: string; featured?: boolean; note?: string };

const products: Product[] = [
  { id: 1, name: "ساندویچ بندری", price: 220, category: "ساندویچ‌ها", image: "/manus-storage/ovoof-sandwich_4aa3c590.jpg", featured: true, note: "تند و پرملات" },
  { id: 2, name: "ساندویچ هات داگ", price: 220, category: "ساندویچ‌ها", image: "/manus-storage/ovoof-hotdog_7e44294d.jpg", note: "با پنیر کش‌دار" },
  { id: 3, name: "ساندویچ مخلوط", price: 220, category: "ساندویچ‌ها", image: "/manus-storage/ovoof-sandwich_4aa3c590.jpg", note: "انتخاب همه‌پسند" },
  { id: 4, name: "ساندویچ همبرگر", price: 250, category: "ساندویچ‌ها", image: "/manus-storage/ovoof-sandwich_4aa3c590.jpg", featured: true, note: "برگر داغ و آبدار" },
  { id: 5, name: "فیله مرغ", price: 130, category: "سوخاری‌ها", image: "/manus-storage/ovoof-wings_a33a700a.jpg", featured: true, note: "تردِ طلایی" },
  { id: 6, name: "کتف بال", price: 80, category: "سوخاری‌ها", image: "/manus-storage/ovoof-wings_a33a700a.jpg" },
  { id: 7, name: "توپک پنیری", price: 30, category: "سوخاری‌ها", image: "/manus-storage/ovoof-fried-platter_84311014.jpg" },
  { id: 8, name: "پنیر سوخاری", price: 30, category: "سوخاری‌ها", image: "/manus-storage/ovoof-fried-platter_84311014.jpg" },
  { id: 9, name: "پیاز سوخاری", price: 30, category: "سوخاری‌ها", image: "/manus-storage/ovoof-fried-platter_84311014.jpg" },
  { id: 10, name: "کراکت مرغ", price: 60, category: "سوخاری‌ها", image: "/manus-storage/ovoof-fried-platter_84311014.jpg" },
  { id: 11, name: "کوردن بلو", price: 95, category: "سوخاری‌ها", image: "/manus-storage/ovoof-fried-platter_84311014.jpg", note: "ویژه اوووففف" },
  { id: 12, name: "قارچ سوخاری یک پرس", price: 140, category: "سوخاری‌ها", image: "/manus-storage/ovoof-potato_5b48b026.jpg" },
  { id: 13, name: "قارچ سوخاری نصف پرس", price: 70, category: "سوخاری‌ها", image: "/manus-storage/ovoof-potato_5b48b026.jpg" },
  { id: 14, name: "سیب‌زمینی یک پرس", price: 130, category: "سوخاری‌ها", image: "/manus-storage/ovoof-potato_5b48b026.jpg" },
  { id: 15, name: "سیب‌زمینی نصف پرس", price: 65, category: "سوخاری‌ها", image: "/manus-storage/ovoof-potato_5b48b026.jpg" },
  { id: 16, name: "سیب‌زمینی با قارچ و پنیر", price: 200, category: "سوخاری‌ها", image: "/manus-storage/ovoof-potato_5b48b026.jpg", featured: true, note: "پیشنهاد اوووففف" },
  { id: 17, name: "هات داگ سرخ شده", price: 120, category: "سوخاری‌ها", image: "/manus-storage/ovoof-hotdog_7e44294d.jpg" },
  { id: 18, name: "کوکتل سرخ شده", price: 80, category: "سوخاری‌ها", image: "/manus-storage/ovoof-fried-platter_84311014.jpg" },
  { id: 19, name: "نوشابه بطری", price: 60, category: "نوشیدنی‌ها", image: "/manus-storage/ovoof-drinks_7fc23616.jpg" },
  { id: 20, name: "نوشابه شیشه‌ای", price: 70, category: "نوشیدنی‌ها", image: "/manus-storage/ovoof-drinks_7fc23616.jpg" },
  { id: 21, name: "دلستر شیشه‌ای", price: 80, category: "نوشیدنی‌ها", image: "/manus-storage/ovoof-drinks_7fc23616.jpg" },
  { id: 22, name: "نوشیدنی‌های قوطی", price: 90, category: "نوشیدنی‌ها", image: "/manus-storage/ovoof-drinks_7fc23616.jpg" },
];

const categoryMeta = [
  { label: "همه", icon: Sparkles, caption: "کل منو" },
  { label: "ساندویچ‌ها", icon: Sandwich, caption: "داغ و دست‌ساز" },
  { label: "سوخاری‌ها", icon: Utensils, caption: "ترد و طلایی" },
  { label: "نوشیدنی‌ها", icon: CupSoda, caption: "خنک و تازه" },
] as const;

const formatPrice = (price: number) => new Intl.NumberFormat("fa-IR").format(price);

export default function Home() {
  const [category, setCategory] = useState<Category>("همه");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<Record<number, number>>({});
  const [cartOpen, setCartOpen] = useState(false);

  const visibleProducts = useMemo(() => products.filter((product) => (category === "همه" || product.category === category) && product.name.includes(query.trim())), [category, query]);
  const cartItems = products.filter((product) => cart[product.id]);
  const cartCount = Object.values(cart).reduce((sum, value) => sum + value, 0);
  const cartTotal = cartItems.reduce((sum, product) => sum + product.price * (cart[product.id] ?? 0), 0);

  const addToCart = (id: number) => setCart((current) => ({ ...current, [id]: (current[id] ?? 0) + 1 }));
  const removeFromCart = (id: number) => setCart((current) => { const next = { ...current }; if ((next[id] ?? 0) <= 1) delete next[id]; else next[id] -= 1; return next; });

  return (
    <div className="site-shell" dir="rtl">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="سوخاری سیب اوووففف">
          <span className="brand-mark"><img src="/manus-storage/ovoof-mark_52e8e115.png" alt="" /></span>
          <span><b>سوخاری سیب</b><small>اوووففف</small></span>
        </a>
        <nav className="topnav" aria-label="ناوبری اصلی">
          <a href="#menu">منوی امروز</a><a href="#about">داستان ما</a><a href="#contact">تماس</a>
        </nav>
        <button className="cart-button" onClick={() => setCartOpen(true)} aria-label="نمایش سبد سفارش">
          <ShoppingBag size={19} /><span>سفارش من</span>{cartCount > 0 && <em>{formatPrice(cartCount)}</em>}
        </button>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-copy">
            <div className="eyebrow"><span /> تازه از تابه، مستقیم برای تو</div>
            <h1>ترد، داغ،<br /><i>اوووففف!</i></h1>
            <p>هر چیزی که باید از یک سوخاری خوب بدانی: طلایی، پرملات و درست همان‌قدر خوشمزه که فکرش را می‌کنی.</p>
            <div className="hero-actions"><a href="#menu" className="primary-cta">دیدن منوی خوشمزه <ArrowLeft size={17} /></a><span className="hero-note">پخت تازه، هر روز<br /><b>از ساعت ۱۱ تا ۲۳</b></span></div>
          </div>
          <div className="hero-visual"><div className="hero-ring" /><img src="/manus-storage/ovoof-hero_5aeffec5.jpg" alt="سبد سوخاری طلایی و سیب‌زمینی" /><div className="hero-sticker"><Sparkles size={16} /><span>پیشنهاد<br /><b>اوووففف</b></span></div></div>
        </section>

        <section className="quick-strip" aria-label="اطلاعات سریع"><div><Clock3 size={21} /><span><b>سریع و تازه</b><small>سفارش تو همین حالا آماده می‌شود</small></span></div><div><MapPin size={21} /><span><b>تهران، همین حوالی</b><small>موقعیت دقیق را از ما بپرس</small></span></div><div><Phone size={21} /><span><b>۰۲۱-۱۲۳۴۵۶۷۸</b><small>برای سفارش تلفنی</small></span></div></section>

        <section id="menu" className="menu-section">
          <aside className="menu-aside"><div className="section-kicker">منوی امروز</div><h2>انتخاب کن،<br /><i>نوش جان.</i></h2><p>از ساندویچ‌های داغ تا سوخاری‌های ترد؛ همه‌چیز با عشق و روغن تازه آماده می‌شود.</p><div className="aside-line" /><span className="aside-tip">هر روز یک انتخاب تازه<br /><b>#سیب_اوووففف</b></span></aside>
          <div className="menu-content">
            <div className="menu-toolbar"><div className="category-tabs">{categoryMeta.map(({ label, icon: Icon, caption }) => <button key={label} className={category === label ? "active" : ""} onClick={() => setCategory(label)}><Icon size={17} /><span>{label}</span><small>{caption}</small></button>)}</div><label className="search-box"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="دنبال چی می‌گردی؟" aria-label="جست‌وجوی غذا" /></label></div>
            <div className="menu-heading"><div><span>{category === "همه" ? "همه انتخاب‌ها" : category}</span><b>{formatPrice(visibleProducts.length)} آیتم</b></div><span className="order-hint">برای اضافه‌کردن روی + بزن</span></div>
            <div className="product-grid">{visibleProducts.map((product, index) => <article className={`product-card ${product.featured ? "featured" : ""}`} key={product.id} style={{ "--delay": `${index * 35}ms` } as React.CSSProperties}><div className="product-image"><img src={product.image} alt={product.name} loading="lazy" />{product.note && <span className="product-tag">{product.note}</span>}<button className="add-float" onClick={() => addToCart(product.id)} aria-label={`افزودن ${product.name}`}><Plus size={19} /></button></div><div className="product-info"><div><h3>{product.name}</h3><span>{product.category === "سوخاری‌ها" ? "تازه و ترد" : product.category === "ساندویچ‌ها" ? "با نان تازه" : "خنک و دلچسب"}</span></div><strong>{formatPrice(product.price)} <small>تومان</small></strong></div></article>)}</div>
            {visibleProducts.length === 0 && <div className="empty-state"><Soup size={30} /><b>این یکی را پیدا نکردیم!</b><span>یک اسم دیگر را امتحان کن.</span></div>}
          </div>
        </section>

        <section id="about" className="about-section"><div className="about-image"><img src="/manus-storage/ovoof-fried-platter_84311014.jpg" alt="بشقاب سوخاری‌های تازه" /></div><div className="about-copy"><div className="section-kicker">چرا اوووففف؟</div><h2>ما با <i>تردی</i><br />شوخی نداریم.</h2><p>از انتخاب مواد تازه تا آخرین لحظه‌ی سرخ‌شدن، همه‌چیز برای یک گازِ درست‌وحسابی وسواس‌گونه انتخاب می‌شود. نتیجه؟ همان «اوووففف»ی که بعد از اولین گاز از دهانت درمی‌آید.</p><div className="about-signature"><span className="signature-dot" /> ساخته‌شده با عشق، روغن تازه و کمی شیطنت</div></div></section>
      </main>

      <footer id="contact" className="footer"><div className="footer-brand"><span className="brand-mark"><img src="/manus-storage/ovoof-mark_52e8e115.png" alt="" /></span><b>سوخاری سیب اوووففف</b></div><span>هر روز، از ۱۱ صبح تا ۱۱ شب</span><span>برای سفارش: ۰۲۱-۱۲۳۴۵۶۷۸</span></footer>

      {cartOpen && <div className="cart-backdrop" onClick={() => setCartOpen(false)}><aside className="cart-drawer" onClick={(event) => event.stopPropagation()}><div className="cart-header"><div><span className="section-kicker">سفارش تو</span><h2>سبد خوشمزه</h2></div><button className="close-button" onClick={() => setCartOpen(false)} aria-label="بستن"><X size={20} /></button></div>{cartItems.length === 0 ? <div className="cart-empty"><ShoppingBag size={34} /><b>سبدت هنوز خالیه</b><span>از منو یک چیز ترد انتخاب کن!</span></div> : <><div className="cart-list">{cartItems.map((product) => <div className="cart-item" key={product.id}><img src={product.image} alt="" /><div><b>{product.name}</b><span>{formatPrice(product.price)} تومان</span></div><div className="qty"><button onClick={() => removeFromCart(product.id)}><Minus size={13} /></button><b>{cart[product.id]}</b><button onClick={() => addToCart(product.id)}><Plus size={13} /></button></div></div>)}</div><div className="cart-total"><span>مجموع سفارش</span><b>{formatPrice(cartTotal)} <small>تومان</small></b></div><button className="checkout-button" onClick={() => alert("برای ثبت سفارش با ما تماس بگیرید: ۰۲۱-۱۲۳۴۵۶۷۸")}>ثبت سفارش تلفنی <Phone size={17} /></button></>}</aside></div>}
    </div>
  );
}
