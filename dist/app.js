// Naz-Store: prototipe khusus Point Blank. Seluruh data produk, karakter,
// nominal dan harga adalah contoh. Tidak ada transaksi atau transfer akun.

const games = [
  {
    slug: "pb-cash", name: "PB Cash via ID", category: "PB Cash", item: "PB Cash",
    icon: "🎯", poster: "poster-pubg", label: "TOP UP PB", needsZone: false, requiresId: true,
    packages: [{ name: "1.200 PB Cash", price: 12000 }, { name: "2.400 PB Cash", price: 24000 }, { name: "6.000 PB Cash", price: 60000 }, { name: "12.000 PB Cash", price: 120000 }, { name: "24.000 PB Cash", price: 240000 }, { name: "60.000 PB Cash", price: 600000 }]
  },
  {
    slug: "voucher-pb", name: "Voucher Point Blank", category: "Voucher", item: "Voucher Digital",
    icon: "🎟️", poster: "poster-val", label: "VOUCHER", needsZone: false, requiresId: false,
    packages: [{ name: "Voucher Rp10.000", price: 10000 }, { name: "Voucher Rp20.000", price: 20000 }, { name: "Voucher Rp50.000", price: 50000 }, { name: "Voucher Rp100.000", price: 100000 }, { name: "Voucher Rp200.000", price: 200000 }, { name: "Voucher Rp500.000", price: 500000 }]
  },
  {
    slug: "epin-pb", name: "PB E-PIN", category: "Voucher", item: "E-PIN Digital",
    icon: "⚡", poster: "poster-hok", label: "DIGITAL PIN", needsZone: false, requiresId: false,
    packages: [{ name: "E-PIN 10K", price: 10000 }, { name: "E-PIN 25K", price: 25000 }, { name: "E-PIN 50K", price: 50000 }, { name: "E-PIN 100K", price: 100000 }, { name: "E-PIN 200K", price: 200000 }, { name: "E-PIN 500K", price: 500000 }]
  }
];

// Profil di bawah fiktif, bukan akun nyata, dan tidak untuk diperjualbelikan.
const accountListings = [
  { slug:"char-major", name:"Char PB — Major", category:"Major", icon:"🎖️", poster:"poster-ml", price:350000, rank:"Major", kd:"68%", hs:"42%", collection:"12 item contoh", label:"CONTOH" },
  { slug:"char-colonel", name:"Char PB — Colonel", category:"Colonel", icon:"🛡️", poster:"poster-pubg", price:650000, rank:"Colonel", kd:"71%", hs:"47%", collection:"20 item contoh", label:"CONTOH" },
  { slug:"char-general", name:"Char PB — General", category:"General", icon:"⭐", poster:"poster-hok", price:1250000, rank:"General", kd:"75%", hs:"51%", collection:"28 item contoh", label:"CONTOH" },
  { slug:"char-commander", name:"Char PB — Commander", category:"Commander", icon:"👑", poster:"poster-val", price:1950000, rank:"Commander", kd:"78%", hs:"55%", collection:"34 item contoh", label:"CONTOH" }
];

const currency = value => "Rp" + Number(value).toLocaleString("id-ID");
const $ = id => document.getElementById(id);
const escapeHtml = value => String(value).replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"})[ch]);
let category = "Semua";
let accountCategory = "Semua";
let activeGame = null;
let selectedPackage = 0;
let lastOrderCode = "";

const storageKey = "naz-store-pb-demo-orders-v2";
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

function accountCard(listing) {
  return `<a class="account-card" href="#account/${listing.slug}" aria-label="Lihat profil contoh ${escapeHtml(listing.name)}">
    <div class="account-cover ${listing.poster}"><span class="poster-label">PROFIL FIKTIF</span><span class="account-cover-icon" aria-hidden="true">${listing.icon}</span><span class="account-rank">${escapeHtml(listing.rank)}</span></div>
    <div class="account-card-body"><span class="account-card-type">CHAR POINT BLANK • DEMO</span><h3>${escapeHtml(listing.name)}</h3>
      <div class="account-stats"><span>K/D <strong>${listing.kd}</strong></span><span>Headshot <strong>${listing.hs}</strong></span></div>
      <div class="game-card-bottom"><span><small>Harga simulasi</small><strong>${currency(listing.price)}</strong></span><span class="card-arrow" aria-hidden="true">↗</span></div>
    </div>
  </a>`;
}

function renderAccounts() {
  const query = $("account-search").value.trim().toLocaleLowerCase("id-ID");
  const shown = accountListings.filter(item => (accountCategory === "Semua" || item.category === accountCategory) && `${item.name} ${item.rank} ${item.collection}`.toLocaleLowerCase("id-ID").includes(query));
  $("account-grid").innerHTML = shown.map(accountCard).join("");
  $("no-account-results").hidden = shown.length !== 0;
}

function renderAccountDetail(listing) {
  $("account-detail-content").innerHTML = `<div class="account-detail-layout">
    <div class="account-profile-art ${listing.poster}" aria-label="Ilustrasi abstrak untuk profil akun fiktif"><span aria-hidden="true">${listing.icon}</span><strong>POINT BLANK</strong><small>DEMO CHARACTER PROFILE</small></div>
    <div class="account-profile-info"><span class="section-kicker">KATALOG KARAKTER • DEMO</span><h1 id="account-detail-title">${escapeHtml(listing.name)}</h1><p>Ini adalah contoh tampilan profil char Point Blank, bukan akun yang tersedia untuk dijual.</p>
      <div class="profile-stat-grid"><div><small>Pangkat</small><strong>${escapeHtml(listing.rank)}</strong></div><div><small>K/D Ratio</small><strong>${listing.kd}</strong></div><div><small>Headshot</small><strong>${listing.hs}</strong></div><div><small>Koleksi</small><strong>${escapeHtml(listing.collection)}</strong></div></div>
      <div class="profile-sample-price"><span>Harga ilustrasi (bukan penawaran)</span><strong>${currency(listing.price)}</strong></div>
      <button class="button button-primary" id="ask-account-demo" type="button">Tentang Marketplace Akun →</button>
      <p class="profile-legal-note">ⓘ Zepetto tidak merekomendasikan jual-beli ID atau karakter. Naz-Store belum memproses transaksi, transfer akun, atau data login.</p>
    </div>
  </div>`;
  $("ask-account-demo").addEventListener("click", () => { $("account-modal").hidden = false; $("close-account-modal").focus(); });
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
  $("player-field").hidden = !game.requiresId;
  $("account-title").textContent = game.requiresId ? "ID Zepetto (Demo)" : "Detail Pesanan Voucher";
  $("account-subtitle").textContent = game.requiresId ? "Masukkan contoh ID akun game, tanpa kata sandi." : "Voucher digital ini masih simulasi dan belum dikirimkan.";
  $("player-id").required = game.requiresId;
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
  const accountSlug = hash.startsWith("#account/") ? hash.slice(9) : null;
  const account = accountSlug && accountListings.find(item => item.slug === accountSlug);
  const isOrders = hash === "#orders";
  $("home-page").hidden = Boolean(game) || Boolean(account) || isOrders;
  $("detail-page").hidden = !game;
  $("account-detail-page").hidden = !account;
  $("orders-page").hidden = !isOrders;
  document.querySelectorAll("[data-nav]").forEach(link => {
    const active = (link.dataset.nav === "home" && !isOrders && !account && hash !== "#how-it-works" && hash !== "#accounts" && hash !== "#events") || (link.dataset.nav === "events" && hash === "#events") || (link.dataset.nav === "accounts" && (hash === "#accounts" || Boolean(account))) || (link.dataset.nav === "orders" && isOrders) || (link.dataset.nav === "how-it-works" && hash === "#how-it-works");
    link.classList.toggle("nav-active", active);
    if (active) link.setAttribute("aria-current", "page"); else link.removeAttribute("aria-current");
  });
  if (game) renderDetail(game);
  if (account) renderAccountDetail(account);
  if (isOrders) renderRecentOrders();
  window.scrollTo({top:0,behavior:"instant"});
  if (hash === "#games" || hash === "#how-it-works" || hash === "#accounts" || hash === "#events") {
    const target = hash === "#games" ? "games" : hash === "#accounts" ? "accounts" : hash === "#events" ? "events" : "how-section";
    requestAnimationFrame(() => $(target).scrollIntoView({behavior:"smooth",block:"start"}));
  }
  if (slug && !game) location.replace("#games");
  if (accountSlug && !account) location.replace("#accounts");
}

function submitDemoOrder() {
  if (!activeGame) return;
  const playerId = $("player-id").value.trim();
  const zoneId = $("zone-id").value.trim();
  const error = $("form-error");
  if ((activeGame.requiresId && playerId.length < 3) || (activeGame.needsZone && zoneId.length < 2)) {
    error.textContent = "Isi ID Zepetto contoh dengan benar" + (activeGame.needsZone ? " dan tambahkan Zone / Server ID." : ".");
    error.hidden = false;
    $("player-id").focus();
    return;
  }
  error.hidden = true;
  const pack = activeGame.packages[selectedPackage];
  const order = {
    code: "NAZ-" + Math.random().toString(36).slice(2,8).toUpperCase(),
    game: activeGame.name, package: pack.name, price: pack.price,
    playerId: !activeGame.requiresId ? "Tidak diperlukan (demo voucher)" : activeGame.needsZone ? `${playerId} (${zoneId})` : playerId,
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

// Status event mengikuti tanggal dengan offset WIB; kontennya diperbarui manual.
const pbEvents = [
  { prefix: "season", start: "2026-11-03T00:00:00+07:00", end: "2026-12-22T23:59:00+07:00" },
  { prefix: "sale", start: "2026-11-03T00:00:00+07:00", end: "2026-11-09T23:59:00+07:00" }
];
function updateEventStatus() {
  const now = Date.now();
  pbEvents.forEach(event => {
    const badge = $(event.prefix + "-status");
    const start = Date.parse(event.start);
    const end = Date.parse(event.end);
    const live = now >= start && now <= end;
    const past = now > end;
    badge.textContent = live ? "● BERLANGSUNG" : past ? "SUDAH BERAKHIR" : "SEGERA HADIR";
    badge.classList.toggle("event-ended", past);
    badge.classList.toggle("event-upcoming", !past && !live);
  });
  const sale = pbEvents[1];
  const remaining = $("sale-remaining");
  const timeLeft = Date.parse(sale.end) - now;
  if (timeLeft >= 0 && now >= Date.parse(sale.start)) {
    const days = Math.floor(timeLeft / 86400000);
    const hours = Math.floor((timeLeft % 86400000) / 3600000);
    remaining.textContent = "Sisa " + days + " hari " + hours + " jam";
  } else if (timeLeft < 0) {
    remaining.textContent = "Promo selesai";
  } else {
    remaining.textContent = "Mulai 3 November 2026";
  }
}

$("current-year").textContent = new Date().getFullYear();
updateEventStatus();
setInterval(updateEventStatus, 60000);
$("game-search").addEventListener("input", renderCatalog);
$("account-search").addEventListener("input", renderAccounts);
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
$("account-filters").addEventListener("click", event => {
  const btn = event.target.closest("[data-account-category]");
  if (!btn) return;
  accountCategory = btn.dataset.accountCategory;
  document.querySelectorAll("[data-account-category]").forEach(item => {
    const active = item === btn;
    item.classList.toggle("active", active);
    item.setAttribute("aria-pressed", String(active));
  });
  renderAccounts();
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
$("close-account-modal").addEventListener("click", () => { $("account-modal").hidden = true; });
$("account-modal").addEventListener("click", event => { if (event.target.id === "account-modal") $("account-modal").hidden = true; });
document.addEventListener("keydown", event => { if (event.key === "Escape") { if (!$("success-modal").hidden) closeModal(); $("account-modal").hidden = true; } });
$("order-lookup-form").addEventListener("submit", event => { event.preventDefault(); lookupOrder($("order-code").value); });
$("recent-orders").addEventListener("click", event => {
  const button = event.target.closest("[data-order-code]");
  if (!button) return;
  $("order-code").value = button.dataset.orderCode;
  lookupOrder(button.dataset.orderCode);
});
window.addEventListener("hashchange", showRoute);
renderCatalog();
renderAccounts();
showRoute();
