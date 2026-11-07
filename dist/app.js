// Naz-Store v1: demo frontend. Data produk dan harga di bawah adalah contoh.
// Tidak ada pembayaran, validasi akun game, atau pengiriman item sungguhan.

const games = [
  {
    slug: "mobile-legends", name: "Mobile Legends", category: "MOBA", item: "Diamonds",
    icon: "✦", poster: "poster-ml", label: "POPULAR", needsZone: true,
    packages: [{ name: "86 Diamonds", price: 23000 }, { name: "172 Diamonds", price: 44000 }, { name: "257 Diamonds", price: 65000 }, { name: "344 Diamonds", price: 87000 }, { name: "429 Diamonds", price: 108000 }, { name: "Weekly Pass", price: 30000 }]
  },
  {
    slug: "free-fire", name: "Free Fire", category: "Battle Royale", item: "Diamonds",
    icon: "🔥", poster: "poster-ff", label: "HOT", needsZone: false,
    packages: [{ name: "70 Diamonds", price: 10000 }, { name: "140 Diamonds", price: 20000 }, { name: "355 Diamonds", price: 48000 }, { name: "720 Diamonds", price: 95000 }, { name: "Member Mingguan", price: 30000 }, { name: "Member Bulanan", price: 90000 }]
  },
  {
    slug: "pubg-mobile", name: "PUBG Mobile", category: "Battle Royale", item: "UC",
    icon: "🎯", poster: "poster-pubg", label: "TRENDING", needsZone: false,
    packages: [{ name: "60 UC", price: 15000 }, { name: "120 UC", price: 30000 }, { name: "325 UC", price: 75000 }, { name: "660 UC", price: 146000 }, { name: "1800 UC", price: 380000 }, { name: "3850 UC", price: 750000 }]
  },
  {
    slug: "valorant", name: "VALORANT", category: "PC & Lainnya", item: "Points",
    icon: "⚡", poster: "poster-val", label: "PC GAME", needsZone: false,
    packages: [{ name: "125 Points", price: 15000 }, { name: "420 Points", price: 48000 }, { name: "700 Points", price: 77000 }, { name: "1375 Points", price: 145000 }, { name: "2400 Points", price: 245000 }, { name: "4000 Points", price: 400000 }]
  },
  {
    slug: "honor-of-kings", name: "Honor of Kings", category: "MOBA", item: "Tokens",
    icon: "👑", poster: "poster-hok", label: "MOBA", needsZone: false,
    packages: [{ name: "80 Tokens", price: 16000 }, { name: "240 Tokens", price: 46000 }, { name: "400 Tokens", price: 75000 }, { name: "800 Tokens", price: 150000 }, { name: "1200 Tokens", price: 225000 }, { name: "Weekly Card", price: 30000 }]
  },
  {
    slug: "roblox", name: "Roblox", category: "PC & Lainnya", item: "Robux",
    icon: "◈", poster: "poster-rob", label: "CREATIVE", needsZone: false,
    packages: [{ name: "80 Robux", price: 20000 }, { name: "160 Robux", price: 39000 }, { name: "400 Robux", price: 90000 }, { name: "800 Robux", price: 175000 }, { name: "1700 Robux", price: 350000 }, { name: "4500 Robux", price: 850000 }]
  },
  {
    slug: "genshin-impact", name: "Genshin Impact", category: "PC & Lainnya", item: "Crystals",
    icon: "🌙", poster: "poster-genshin", label: "ADVENTURE", needsZone: false,
    packages: [{ name: "60 Crystals", price: 16000 }, { name: "300 + 30 Crystals", price: 79000 }, { name: "980 + 110 Crystals", price: 249000 }, { name: "1980 + 260 Crystals", price: 480000 }, { name: "Welkin Moon", price: 79000 }, { name: "Battle Pass", price: 165000 }]
  },
  {
    slug: "call-of-duty", name: "Call of Duty Mobile", category: "Battle Royale", item: "CP",
    icon: "🎮", poster: "poster-cod", label: "ACTION", needsZone: false,
    packages: [{ name: "80 CP", price: 16000 }, { name: "420 CP", price: 80000 }, { name: "880 CP", price: 159000 }, { name: "2400 CP", price: 399000 }, { name: "5000 CP", price: 790000 }, { name: "10800 CP", price: 1550000 }]
  }
];

const currency = value => "Rp" + Number(value).toLocaleString("id-ID");
const $ = id => document.getElementById(id);
const escapeHtml = value => String(value).replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"})[ch]);
let category = "Semua";
let activeGame = null;
let selectedPackage = 0;
let lastOrderCode = "";

const storageKey = "naz-store-demo-orders-v1";
let orders = [];
try {
  const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
  orders = Array.isArray(saved) ? saved.filter(order => order && typeof order.code === "string").slice(0, 30) : [];
} catch { orders = []; }

function gameCard(game) {
  const startingAt = Math.min(...game.packages.map(p => p.price));
  return `<a class="game-card" href="#game/${game.slug}" aria-label="Lihat pilihan top up ${escapeHtml(game.name)}">
    <div class="game-poster ${game.poster}"><span class="poster-label">${game.label}</span><span class="poster-icon" aria-hidden="true">${game.icon}</span></div>
    <div class="game-card-info"><h3>${escapeHtml(game.name)}</h3><p>${escapeHtml(game.item)} · Produk Digital</p>
      <div class="game-card-bottom"><span><small>Mulai dari</small><strong>${currency(startingAt)}</strong></span><span class="card-arrow" aria-hidden="true">↗</span></div>
    </div>
  </a>`;
}

function renderCatalog() {
  const query = $("game-search").value.trim().toLocaleLowerCase("id-ID");
  const shown = games.filter(game => (category === "Semua" || game.category === category) && `${game.name} ${game.category} ${game.item}`.toLocaleLowerCase("id-ID").includes(query));
  $("game-grid").innerHTML = shown.map(gameCard).join("");
  $("no-results").hidden = shown.length !== 0;
}

function renderSummary() {
  if (!activeGame) return;
  const pack = activeGame.packages[selectedPackage];
  $("summary-product").innerHTML = `<span class="summary-thumbnail ${activeGame.poster}" aria-hidden="true">${activeGame.icon}</span><span><strong>${escapeHtml(activeGame.name)}</strong><small>${escapeHtml(pack.name)}</small></span>`;
  $("summary-price").textContent = currency(pack.price);
  $("summary-total").textContent = currency(pack.price);
}

function renderDetail(game) {
  activeGame = game;
  selectedPackage = 0;
  $("detail-intro").innerHTML = `<div class="detail-art ${game.poster}" aria-hidden="true">${game.icon}</div><div><h1 id="detail-title">Top Up ${escapeHtml(game.name)}</h1><p>Pilih produk ${escapeHtml(game.item)} favoritmu. Semua nominal di halaman ini hanya data contoh.</p><div class="detail-badges"><span>⚡ Alur Praktis</span><span>✧ Demo Interaktif</span><span>◈ Tanpa Transaksi Nyata</span></div></div>`;
  $("package-grid").innerHTML = game.packages.map((pack, i) => `<button class="package-option${i === 0 ? " selected" : ""}" data-pack="${i}" type="button" aria-pressed="${i === 0}"><span class="package-icon" aria-hidden="true">✦</span><strong>${escapeHtml(pack.name)}</strong><small>${currency(pack.price)}</small></button>`).join("");
  $("zone-field").hidden = !game.needsZone;
  $("player-id").value = "";
  $("zone-id").value = "";
  $("form-error").hidden = true;
  renderSummary();
}

function renderRecentOrders() {
  if (!orders.length) { $("recent-orders").innerHTML = ""; return; }
  $("recent-orders").innerHTML = `<h3>Pesanan demo terakhir di browser ini</h3>${orders.slice(0,5).map(o => `<div class="recent-order"><span>${escapeHtml(o.game)} — ${escapeHtml(o.package)}</span><button type="button" data-order-code="${escapeHtml(o.code)}">${escapeHtml(o.code)} ↗</button></div>`).join("")}`;
}

function lookupOrder(code) {
  const order = orders.find(o => o.code.toLowerCase() === code.trim().toLowerCase());
  if (!order) {
    $("order-lookup-result").innerHTML = `<div class="order-result"><h3>Pesanan tidak ditemukan</h3><p>Periksa kode pesanan demo. Pesanan dari browser lain tidak bisa dilacak pada versi ini.</p></div>`;
    return;
  }
  const date = new Date(order.createdAt);
  const dateText = Number.isNaN(date.valueOf()) ? "Tidak tersedia" : date.toLocaleString("id-ID", {dateStyle:"medium",timeStyle:"short"});
  $("order-lookup-result").innerHTML = `<div class="order-result"><span class="status-pill">● Simulasi — belum dibayar</span><h3 style="margin-top:15px">Pesanan ${escapeHtml(order.code)}</h3><dl><div><dt>Game</dt><dd>${escapeHtml(order.game)}</dd></div><div><dt>Paket</dt><dd>${escapeHtml(order.package)}</dd></div><div><dt>ID akun (contoh)</dt><dd>${escapeHtml(order.playerId)}</dd></div><div><dt>Metode demo</dt><dd>${escapeHtml(order.payment)}</dd></div><div><dt>Total</dt><dd>${currency(order.price)}</dd></div><div><dt>Waktu</dt><dd>${escapeHtml(dateText)}</dd></div></dl><p>Tidak ada transaksi sungguhan yang diproses oleh Naz-Store versi ini.</p></div>`;
}

function showRoute() {
  const hash = decodeURIComponent(location.hash || "#home");
  const slug = hash.startsWith("#game/") ? hash.slice(6) : null;
  const game = slug && games.find(item => item.slug === slug);
  const isOrders = hash === "#orders";
  $("home-page").hidden = Boolean(game) || isOrders;
  $("detail-page").hidden = !game;
  $("orders-page").hidden = !isOrders;
  document.querySelectorAll("[data-nav]").forEach(link => {
    const active = (link.dataset.nav === "home" && !isOrders && hash !== "#how-it-works") || (link.dataset.nav === "orders" && isOrders) || (link.dataset.nav === "how-it-works" && hash === "#how-it-works");
    link.classList.toggle("nav-active", active);
    if (active) link.setAttribute("aria-current", "page"); else link.removeAttribute("aria-current");
  });
  if (game) renderDetail(game);
  if (isOrders) renderRecentOrders();
  window.scrollTo({top:0,behavior:"instant"});
  if (hash === "#games" || hash === "#how-it-works") {
    requestAnimationFrame(() => $(hash === "#games" ? "games" : "how-section").scrollIntoView({behavior:"smooth",block:"start"}));
  }
  if (slug && !game) location.replace("#games");
}

function submitDemoOrder() {
  if (!activeGame) return;
  const playerId = $("player-id").value.trim();
  const zoneId = $("zone-id").value.trim();
  const error = $("form-error");
  if (playerId.length < 3 || (activeGame.needsZone && zoneId.length < 2)) {
    error.textContent = "Isi User ID dengan benar" + (activeGame.needsZone ? " dan tambahkan Zone / Server ID." : ".");
    error.hidden = false;
    $("player-id").focus();
    return;
  }
  error.hidden = true;
  const pack = activeGame.packages[selectedPackage];
  const order = {
    code: "NAZ-" + Math.random().toString(36).slice(2,8).toUpperCase(),
    game: activeGame.name, package: pack.name, price: pack.price,
    playerId: activeGame.needsZone ? `${playerId} (${zoneId})` : playerId,
    payment: document.querySelector('input[name="payment"]:checked').value,
    createdAt: new Date().toISOString()
  };
  orders.unshift(order);
  orders = orders.slice(0,30);
  try { localStorage.setItem(storageKey, JSON.stringify(orders)); } catch { /* Demo tetap jalan tanpa penyimpanan permanen. */ }
  lastOrderCode = order.code;
  $("created-order-code").textContent = order.code;
  $("success-modal").hidden = false;
  $("view-created-order").focus();
}

function closeModal() { $("success-modal").hidden = true; }

$("current-year").textContent = new Date().getFullYear();
$("game-search").addEventListener("input", renderCatalog);
$("category-tabs").addEventListener("click", event => {
  const btn = event.target.closest("[data-category]");
  if (!btn) return;
  category = btn.dataset.category;
  document.querySelectorAll("[data-category]").forEach(item => {
    const active = item === btn;
    item.classList.toggle("active", active);
    item.setAttribute("aria-pressed", String(active));
  });
  renderCatalog();
});
$("package-grid").addEventListener("click", event => {
  const btn = event.target.closest("[data-pack]");
  if (!btn) return;
  selectedPackage = Number(btn.dataset.pack);
  document.querySelectorAll("[data-pack]").forEach(item => {
    const active = item === btn;
    item.classList.toggle("selected", active);
    item.setAttribute("aria-pressed", String(active));
  });
  renderSummary();
});
$("submit-order").addEventListener("click", submitDemoOrder);
$("modal-close").addEventListener("click", () => { closeModal(); location.hash = "#games"; });
$("view-created-order").addEventListener("click", () => {
  closeModal(); location.hash = "#orders";
  $("order-code").value = lastOrderCode;
  lookupOrder(lastOrderCode);
});
$("success-modal").addEventListener("click", event => { if (event.target.id === "success-modal") closeModal(); });
document.addEventListener("keydown", event => { if (event.key === "Escape" && !$("success-modal").hidden) closeModal(); });
$("order-lookup-form").addEventListener("submit", event => { event.preventDefault(); lookupOrder($("order-code").value); });
$("recent-orders").addEventListener("click", event => {
  const button = event.target.closest("[data-order-code]");
  if (!button) return;
  $("order-code").value = button.dataset.orderCode;
  lookupOrder(button.dataset.orderCode);
});
window.addEventListener("hashchange", showRoute);
renderCatalog();
showRoute();
