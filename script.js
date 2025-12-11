// 1. БАЗА ДАННЫХ (Цены в Тенге ₸)
const products = [
    { id: 1, brand: "Nike", name: "Air jordan-1", price: 55000, images: ["01-air-jordan-1.webp", "01-air-jordan-1.webp"], desc: "Классика уличного стиля.", sizes: [40, 41, 42, 43, 44] },
    { id: 2, brand: "Nike", name: "Air jordan-3", price: 40000, images: ["04-air-jordan-3.jpg", "04-air-jordan-3.jpg"], desc: "Ретро-баскетбол.", sizes: [39, 40, 42] },
    { id: 3, brand: "Nike", name: "Air jordan-4", price: 35000, images: ["07-air-jordan-4.jpg", "07-air-jordan-4.jpg"], desc: "Максимальный комфорт.", sizes: [40, 41, 42, 43] },
    { id: 4, brand: "Nike", name: "Air max-95", price: 38000, images: ["08-nike-air-max-95.jpg", "08-nike-air-max-95.jpg"], desc: "Стиль с 1968 года.", sizes: [38, 39, 40] },
    { id: 5, brand: "Nike", name: "Air jordan-5", price: 45000, images: ["10-air-jordan-5.webp", "10-air-jordan-5.webp"], desc: "Футуристичный дизайн.", sizes: [41, 42, 44] },
    { id: 6, brand: "Nike", name: "Air-yeezy-1", price: 40000, images: ["17-nike-air-yeezy-1-sg.webp", "17-nike-air-yeezy-1-sg.webp"], desc: "Теннисный минимализм.", sizes: [40, 41, 42] },
    { id: 7, brand: "Nike", name: "Nike-blazer", price: 50000, images: ["20-nike-blazer.webp", "20-nike-blazer.webp"], desc: "Футбольная икона.", sizes: [39, 40, 41] },
    { id: 8, brand: "Nike", name: "Air-max-plus", price: 58000, images: ["23-nike-air-max-plus.jpg", "23-nike-air-max-plus.jpg"], desc: "Баскетбольная база.", sizes: [40, 42, 44] },
    { id: 9, brand: "Nike", name: "Nike-mag-sg", price: 45000, images: ["26-nike-mag-sg.jpg", "26-nike-mag-sg.jpg"], desc: "Беговой стиль 2000-х.", sizes: [41, 42, 43] },
    { id: 10, brand: "Nike", name: "Nike-hyperdunk", price: 25000, images: ["35-nike-hyperdunk.webp", "35-nike-hyperdunk.webp"], desc: "Легенда с 1985.", sizes: [40, 41, 42, 43, 44, 45] }
];

// СОСТОЯНИЕ
let cart = [];
let orders = [];
let favorites = [];
let userProfile = { name: "", email: "guest@sneaker.kz" };

let currentProduct = null;
let currentImgIndex = 0;
let selectedSize = null;
let navigationStack = ['home-screen'];
let categoryData = ['All', 'Nike', 'Adidas', 'Jordan', 'Puma', 'New Balance', 'Reebok', 'Asics'];
let currentCategory = 'All';

// ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ ДЛЯ ЦЕНЫ (10 000 ₸)
function formatPrice(price) {
    return price.toLocaleString('ru-RU') + ' ₸';
}

document.addEventListener('DOMContentLoaded', () => {
    renderCategoriesList();
    renderProducts(products);
    updateProfileUI();
});

// КАТЕГОРИИ
function renderCategoriesList() {
    const list = document.getElementById('category-list');
    list.innerHTML = '';
    categoryData.forEach(brand => {
        const btn = document.createElement('button');
        btn.innerText = (brand === 'All') ? 'Все' : brand;
        btn.className = 'cat-btn';
        if (brand === currentCategory) btn.classList.add('active');
        btn.onclick = () => filterCategory(brand);
        list.appendChild(btn);
    });
}
function rotateCategories(dir) {
    if (dir === 'right') categoryData.push(categoryData.shift());
    else categoryData.unshift(categoryData.pop());
    renderCategoriesList();
}
function filterCategory(brand) {
    currentCategory = brand;
    renderCategoriesList();
    if (brand === 'All') renderProducts(products);
    else renderProducts(products.filter(p => p.brand === brand));
}

// КАТАЛОГ
function renderProducts(data) {
    const list = document.getElementById('product-list');
    list.innerHTML = '';
    data.forEach(p => list.appendChild(createProductCard(p)));
}

function createProductCard(p) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.onclick = () => openDetails(p.id);
    const heartClass = favorites.includes(p.id) ? 'bxs-heart active' : 'bx-heart';

    // Используем formatPrice
    card.innerHTML = `
        <i class='bx ${heartClass} fav-icon-small' onclick="toggleFavorite(${p.id}, event)"></i>
        <div class="product-img"><img src="${p.images[0]}"></div>
        <div class="product-info"><p class="brand">${p.brand}</p><h3>${p.name}</h3>
        <div class="price-row"><span class="price">${formatPrice(p.price)}</span></div></div>
    `;
    return card;
}
function searchProducts(query) {
    const filtered = products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
    renderProducts(filtered);
}

// ДЕТАЛИ
function openDetails(id) {
    currentProduct = products.find(p => p.id === id);
    selectedSize = null; currentImgIndex = 0;
    document.getElementById('detail-main-img').src = currentProduct.images[0];
    updateDots();
    document.getElementById('details-text-content').innerHTML = `<div class="detail-info"><h2>${currentProduct.name}</h2><p class="detail-desc">${currentProduct.desc}</p></div>`;
    document.getElementById('detail-price').innerText = formatPrice(currentProduct.price);
    const sc = document.getElementById('size-options'); sc.innerHTML = '';
    currentProduct.sizes.forEach(s => {
        const b = document.createElement('div'); b.className = 'size-btn'; b.innerText = s;
        b.onclick = () => { document.querySelectorAll('.size-btn').forEach(x => x.classList.remove('selected')); b.classList.add('selected'); selectedSize = s; };
        sc.appendChild(b);
    });
    updateDetailHeart(id);
    showScreen('details-screen');
}
function changeImage(dir) {
    if (!currentProduct) return;
    currentImgIndex += dir;
    if (currentImgIndex < 0) currentImgIndex = currentProduct.images.length - 1;
    if (currentImgIndex >= currentProduct.images.length) currentImgIndex = 0;
    document.getElementById('detail-main-img').src = currentProduct.images[currentImgIndex];
    updateDots();
}
function updateDots() {
    const dc = document.getElementById('gallery-dots'); dc.innerHTML = '';
    currentProduct.images.forEach((_, i) => { const d = document.createElement('div'); d.className = `dot ${i === currentImgIndex ? 'active' : ''}`; dc.appendChild(d); });
}

// КОРЗИНА И ОФОРМЛЕНИЕ
function addToCartFromDetails() {
    if (!selectedSize) { showPush("Ошибка", "Выберите размер!"); return; }
    cart.push({ ...currentProduct, selectedSize, uId: Date.now() });
    updateCartCount(); showPush("Корзина", "Добавлено!"); showScreen('home-screen');
}

function renderCart() {
    const c = document.getElementById('cart-items'); c.innerHTML = '';
    let total = 0;
    if (cart.length === 0) { c.innerHTML = '<div class="empty-msg">Пусто</div>'; document.getElementById('total-price').innerText = '0 ₸'; return; }
    cart.forEach((item, i) => {
        total += item.price;
        c.innerHTML += `<div class="cart-item"><img src="${item.images[0]}"><div style="flex:1"><h4>${item.name}</h4><span>Размер: ${item.selectedSize}</span><p>${formatPrice(item.price)}</p></div><i class='bx bx-trash' style="color:#ff5e57; font-size:20px;" onclick="removeFromCart(${i})"></i></div>`;
    });
    document.getElementById('total-price').innerText = formatPrice(total);
}

// ПЕРЕХОД К ОФОРМЛЕНИЮ
function goToCheckout() {
    if (cart.length === 0) { showPush("Ошибка", "Корзина пуста"); return; }
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    document.getElementById('checkout-total-amount').innerText = formatPrice(total);
    if (userProfile.name) document.getElementById('order-name').value = userProfile.name;
    showScreen('checkout-screen');
}

// ОПЛАТА
function confirmOrder() {
    const name = document.getElementById('order-name').value;
    const city = document.getElementById('order-city').value;
    const street = document.getElementById('order-street').value;
    const card = document.getElementById('payment-card-number').value;

    if (!name || !city || !street || !card) { showPush("Ошибка", "Заполните все поля!"); return; }
    if (card.length < 16) { showPush("Ошибка", "Неверный номер карты!"); return; }

    const newOrder = {
        id: 'ORD-' + Math.floor(Math.random() * 10000),
        date: new Date().toLocaleDateString(),
        items: [...cart],
        total: cart.reduce((sum, item) => sum + item.price, 0),
        address: `${city}, ${street}`
    };

    orders.unshift(newOrder);
    cart = []; updateCartCount();
    showPush("Успешно", "Рахмет! Заказ оплачен! 🎉");
    setTimeout(() => { showScreen('history-screen'); renderHistory(); }, 1500);
}

function removeFromCart(i) { cart.splice(i, 1); updateCartCount(); renderCart(); }
function clearCart() { cart = []; updateCartCount(); renderCart(); }
function updateCartCount() { document.querySelector('.notification').innerText = cart.length; }

function renderHistory() {
    const l = document.getElementById('history-list'); l.innerHTML = '';
    if (orders.length === 0) { l.innerHTML = '<div class="empty-msg">Нет заказов</div>'; return; }
    orders.forEach(o => {
        const names = o.items.map(i => `${i.name} (${i.selectedSize})`).join(', ');
        l.innerHTML += `<div class="history-item"><div class="history-header"><span class="history-date">${o.date} • ${o.id}</span><span class="history-status">Оплачено</span></div><div class="history-body"><h4>${names}</h4><div class="history-total">Адрес: ${o.address}<br>Итого: ${formatPrice(o.total)}</div></div></div>`;
    });
}

// ИЗБРАННОЕ (ИСПРАВЛЕНО)
function toggleFavorite(id, e) {
    if (e) e.stopPropagation();
    const idx = favorites.indexOf(id);
    if (idx === -1) { favorites.push(id); showPush("Избранное", "Добавлено ❤️"); }
    else { favorites.splice(idx, 1); showPush("Избранное", "Удалено 💔"); }

    renderProducts(products); // Обновляем сердечки в каталоге
    renderFavorites(); // Обновляем список избранного, если мы там
    if (currentProduct && currentProduct.id === id) updateDetailHeart(id);
}

function renderFavorites() {
    const list = document.getElementById('favorites-list');
    list.innerHTML = '';
    // Фильтруем товары, ID которых есть в массиве favorites
    const favProducts = products.filter(p => favorites.includes(p.id));

    if (favProducts.length === 0) {
        list.innerHTML = '<div class="empty-msg">В избранном пусто</div>';
        return;
    }

    // Используем ту же функцию создания карточки, что и для каталога
    favProducts.forEach(p => {
        list.appendChild(createProductCard(p));
    });
}

function updateDetailHeart(id) {
    const b = document.getElementById('detail-fav-btn');
    if (favorites.includes(id)) { b.classList.remove('bx-heart'); b.classList.add('bxs-heart'); }
    else { b.classList.remove('bxs-heart'); b.classList.add('bx-heart'); }
    b.onclick = () => toggleFavorite(id);
}

// ПРОФИЛЬ И НАВИГАЦИЯ
function showPush(t, txt) {
    const p = document.getElementById('push-notification');
    document.getElementById('push-title').innerText = t; document.getElementById('push-text').innerText = txt;
    p.classList.add('show'); setTimeout(() => p.classList.remove('show'), 3000);
}
function saveProfile() {
    userProfile.name = document.getElementById('input-name').value || userProfile.name;
    updateProfileUI(); showPush("Профиль", "Сохранено"); showScreen('profile-screen');
}
function updateProfileUI() { document.getElementById('profile-name-display').innerText = userProfile.name || "Гость"; }
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active-screen'));
    document.getElementById(id).classList.add('active-screen');
    if (id === 'cart-screen') renderCart();
    if (id === 'favorites-screen') renderFavorites(); // Обновляем избранное при входе
    if (id !== navigationStack[navigationStack.length - 1]) navigationStack.push(id);
}
function goBack() {
    if (navigationStack.length > 1) { navigationStack.pop(); showScreen(navigationStack[navigationStack.length - 1]); navigationStack.pop(); }
    else showScreen('home-screen');
}
function setActiveNav(el) { document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active')); el.classList.add('active'); }