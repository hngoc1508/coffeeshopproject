// DỮ LIỆU SẢN PHẨM GIẢ LẬP (MOCK DATA)
const products = [
    { id: 1, category: 'coffee', name: 'Espresso Đá', price: 35000, img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500', description: 'Espresso đá đậm vị, phù hợp cho sáng năng động.', options: { sugar: [0,50,70,100], ice: ['Đá thường','Ít đá','Không đá'], toppings: [{ id: 'milkfoam', name: 'Milk Foam', price: 5000 }, { id: 'caramel', name: 'Caramel', price: 6000 }, { id: 'boba', name: 'Trân châu', price: 8000 }] } },
    { id: 2, category: 'coffee', name: 'Capuchino nóng', price: 45000, img: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500', description: 'Capuchino bọt sữa mịn, hương cacao nhẹ.', options: { sugar: [0,30,50,70], ice: ['Nóng'], toppings: [{ id: 'cinnamon', name: 'Quế', price: 3000 }, { id: 'choco', name: 'Bột cacao', price: 3000 }] } },
    { id: 3, category: 'coffee', name: 'Cold Brew Cam Sả', price: 55000, img: 'https://images.unsplash.com/photo-1461023058943-48dbf1399192?w=500', description: 'Cold brew thơm mát kết hợp cam và sả.', options: { sugar: [0,50,70,100], ice: ['Đá thường','Ít đá','Không đá'], toppings: [{ id: 'mint', name: 'Lá bạc hà', price: 4000 }] } },
    { id: 4, category: 'tea', name: 'Trà Đào Cam Sả', price: 45000, img: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500', description: 'Trà đào thanh mát, vị cam tươi.', options: { sugar: [0,30,50,70], ice: ['Đá thường','Ít đá','Không đá'], toppings: [{ id: 'pearl', name: 'Trân châu', price: 8000 }] } },
    { id: 5, category: 'cake', name: 'Bánh Croissant', price: 25000, img: 'https://images.unsplash.com/photo-1555507036-ab1f40388085?w=500', description: 'Bánh bơ giòn rụm, ngon cùng cà phê.', options: { sugar: [], ice: [], toppings: [] } },
    { id: 6, category: 'cake', name: 'Tiramisu', price: 40000, img: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=500', description: 'Tiramisu mềm mịn với cà phê và kem.', options: { sugar: [], ice: [], toppings: [] } },
];

let cart = JSON.parse(localStorage.getItem('myCart')) || [];

// 1. HÀM RENDER SẢN PHẨM RA MÀN HÌNH
function renderProducts(filter = 'all') {
    const grid = document.getElementById('menu-grid');
    if (!grid) return; // Nếu không ở trang chủ thì thoát

    grid.innerHTML = ''; // Xóa cũ
    
    const filteredProducts = filter === 'all' 
        ? products 
        : products.filter(p => p.category === filter);

    filteredProducts.forEach(p => {
        grid.innerHTML += `
            <div class="product-card">
                <div class="card-img">
                    <img src="${p.img}" alt="${p.name}">
                </div>
                <div class="card-body">
                    <h4>${p.name}</h4>
                    <span class="price">${p.price.toLocaleString()} đ</span>
                    <div style="display:flex; gap:8px; align-items:center;">
                        <a class="btn-add" href="product.html?id=${p.id}" style="text-decoration:none;"><i class="fas fa-eye"></i> Chi tiết</a>
                        <button class="btn-add" onclick="addToCart(${p.id})">
                            <i class="fas fa-plus"></i> Thêm vào giỏ
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
}

// 2. XỬ LÝ LỌC DANH MỤC
function setupFilters() {
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Xóa class active cũ
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            // Thêm class active mới
            btn.classList.add('active');
            // Render lại grid
            renderProducts(btn.dataset.filter);
        });
    });
}

// 5. VIEW CONTROLS (grid / large / list) - persistent via localStorage
function applyViewMode(view) {
    const grid = document.getElementById('menu-grid');
    if(!grid) return;
    grid.classList.remove('view-grid','view-large','view-list');
    grid.classList.add(`view-${view}`);

    // update button states
    // update menu buttons (compact popover) if present
    document.querySelectorAll('.view-menu-btn').forEach(btn => {
        const isActive = btn.dataset.view === view;
        btn.classList.toggle('selected', isActive);
    });
}

// Setup compact view menu (single small icon -> popover)
function setupViewToggle() {
    const views = ['grid','large','list'];
    let idx = views.indexOf(localStorage.getItem('menuView'));
    if (idx === -1) idx = 0; // default grid

    const toggle = document.querySelector('.view-toggle');
    const toast = document.querySelector('.view-toast');
    if (!toggle) return;

    function setViewByIndex(i) {
        const view = views[i % views.length];
        applyViewMode(view);
        localStorage.setItem('menuView', view);
        // update icon
        const iconMap = {grid: 'fas fa-th', large: 'fas fa-th-large', list: 'fas fa-list'};
        toggle.innerHTML = `<i class="${iconMap[view]}"></i>`;
        // show toast
        if (toast) {
            toast.innerText = view === 'grid' ? 'Lưới' : (view === 'large' ? 'Lớn' : 'Danh sách');
            toast.hidden = false; toast.setAttribute('aria-hidden','false');
            clearTimeout(toggle._toastTimer);
            toggle._toastTimer = setTimeout(()=>{ if(toast){ toast.hidden = true; toast.setAttribute('aria-hidden','true'); } }, 1000);
        }
    }

    // init
    setViewByIndex(idx);

    toggle.addEventListener('click', () => {
        idx = (idx + 1) % views.length;
        setViewByIndex(idx);
    });

    toggle.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle.click(); } });
}

// 3. LOGIC GIỎ HÀNG
function updateCartCount() {
    const badge = document.getElementById('cart-count');
    if(badge) badge.innerText = cart.reduce((total, item) => total + item.qty, 0);
}

function addToCart(id, qty = 1, options = null) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    // compute price including toppings
    let extra = 0;
    if (options && options.toppings) {
        extra = options.toppings.reduce((s, t) => s + (t.price || 0), 0);
    }

    // find existing item with same id + options
    const existing = cart.find(item => item.id === id && JSON.stringify(item.options || null) === JSON.stringify(options || null));

    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({ id: product.id, name: product.name, basePrice: product.price, price: product.price + extra, qty: qty, options: options });
    }

    localStorage.setItem('myCart', JSON.stringify(cart));
    updateCartCount();
}

// 4. RENDER TRANG GIỎ HÀNG (Cart Page)
function renderCartPage() {
    const tbody = document.getElementById('cart-body');
    const totalSpan = document.getElementById('total-price');
    if (!tbody) return;

    tbody.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:20px;">Giỏ hàng trống</td></tr>';
    } else {
        cart.forEach((item, index) => {
            // compute subtotal
            const itemPrice = item.price || item.basePrice || 0;
            let subtotal = itemPrice * item.qty;
            total += subtotal;

            // show options summary
            let opts = '';
            if (item.options) {
                const parts = [];
                if (item.options.sugar) parts.push('Đường: ' + item.options.sugar + '%');
                if (item.options.ice) parts.push('Đá: ' + item.options.ice);
                if (item.options.toppings && item.options.toppings.length) parts.push('Topping: ' + item.options.toppings.map(t=>t.name).join(', '));
                if (parts.length) opts = '<div style="font-size:0.9rem; color:#666; margin-top:6px;">' + parts.join(' • ') + '</div>';
            }

            tbody.innerHTML += `
                <tr>
                    <td style="text-align:center; vertical-align:top;">${index+1}</td>
                    <td style="vertical-align:top;">${item.name} ${opts}</td>
                    <td style="vertical-align:top;">${itemPrice.toLocaleString()} đ</td>
                    <td style="text-align:center; vertical-align:top;">
                        <button onclick="changeQty(${index}, -1)">-</button> 
                        <span style="margin:0 5px;">${item.qty}</span> 
                        <button onclick="changeQty(${index}, 1)">+</button>
                    </td>
                    <td style="vertical-align:top;">${subtotal.toLocaleString()} đ</td>
                </tr>
            `;
        });
    }
    if(totalSpan) totalSpan.innerText = total.toLocaleString() + ' đ';
}

function changeQty(index, delta) {
    cart[index].qty += delta;
    if (cart[index].qty <= 0) cart.splice(index, 1);
    localStorage.setItem('myCart', JSON.stringify(cart));
    renderCartPage();
    updateCartCount();
}

// KHỞI CHẠY
document.addEventListener('DOMContentLoaded', () => {
    renderProducts(); // Mặc định hiện tất cả
    setupFilters();
    setupViewToggle();
    updateCartCount();
    renderCartPage();
    updateHeaderAuth();
    // bind checkout if present
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) checkoutBtn.addEventListener('click', checkout);
});

/* ======= AUTH / USERS (localStorage) ======= */
function loadUsers() { return JSON.parse(localStorage.getItem('users') || '[]'); }
function saveUsers(users) { localStorage.setItem('users', JSON.stringify(users)); }
function getCurrentUserId() { return localStorage.getItem('currentUser') ? parseInt(localStorage.getItem('currentUser')) : null; }
function getCurrentUser() { const id = getCurrentUserId(); if (!id) return null; return loadUsers().find(u => u.id === id) || null; }

function registerUser({name, phone, email, password}){
    const users = loadUsers();
    if (users.find(u => u.email === email)) { return { ok:false, error:'Email đã tồn tại' }; }
    const id = (users.length ? users[users.length-1].id + 1 : 1);
    const newUser = { id, name, phone, email, password, points:0 };
    users.push(newUser); saveUsers(users); localStorage.setItem('currentUser', id); updateHeaderAuth(); return { ok:true, user:newUser };
}

function loginUser(email, password){ const users = loadUsers(); const u = users.find(x => x.email === email && x.password === password); if (!u) return { ok:false }; localStorage.setItem('currentUser', u.id); updateHeaderAuth(); return { ok:true, user:u }; }

function logoutUser(){ localStorage.removeItem('currentUser'); updateHeaderAuth(); }

function updateHeaderAuth(){
    document.querySelectorAll('.account-area').forEach(el => {
        const cur = getCurrentUser();
        if (cur) {
            el.innerHTML = `<span style="font-weight:600; margin-right:8px;">${cur.name}</span> <span style="color:var(--accent-color); font-weight:700;">${cur.points} pts</span> <a href="account.html" style="margin-left:8px;">Hồ sơ</a> <button onclick="logoutUser()" style="margin-left:8px; background:none; border:none; color:var(--primary-color); cursor:pointer;">Đăng xuất</button>`;
        } else {
            el.innerHTML = `<a href="login.html">Đăng nhập</a> • <a href="register.html">Đăng ký</a>`;
        }
    });
}

/* ======= CHECKOUT SIMULATION (client-side) ======= */
function checkout(){
    if (cart.length === 0) { alert('Giỏ hàng trống'); return; }
    const total = cart.reduce((s, it) => s + ((it.price || it.basePrice || 0) * it.qty), 0);
    const cur = getCurrentUser();
    if (!cur) {
        if (!confirm('Bạn chưa đăng nhập. Đăng nhập/đăng ký để tích điểm thành viên?')) { return; }
        location.href = 'login.html'; return;
    }
    // award points: 1 point per 10,000đ
    const pointsEarned = Math.floor(total / 10000);
    const users = loadUsers();
    const uIndex = users.findIndex(u => u.id === cur.id);
    if (uIndex !== -1) { users[uIndex].points += pointsEarned; saveUsers(users); localStorage.setItem('currentUser', users[uIndex].id); }

    // simulate order placed
    cart = []; localStorage.setItem('myCart', JSON.stringify(cart)); updateCartCount(); renderCartPage(); updateHeaderAuth();
    alert(`Đơn hàng đã đặt. Bạn nhận được ${pointsEarned} điểm.`);
}