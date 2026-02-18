const products = [
    { 
        id: 1, 
        name: "Pro Camera 4K", 
        price: 899.00, 
        category: "Photography", 
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80" 
    },
    { 
        id: 2, 
        name: "Studio Microphone", 
        price: 120.00, 
        category: "Audio", 
        image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80" 
    },
    { 
        id: 3, 
        name: "Portable Speaker", 
        price: 85.00, 
        category: "Audio", 
        image: "https://images.unsplash.com/photo-1608223652591-62d2944b361a?auto=format&fit=crop&w=800&q=80" 
    },
    { 
        id: 4, 
        name: "Neural Headphones", 
        price: 299.00, 
        category: "Audio", 
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80" 
    },
    { 
        id: 5, 
        name: "Smart Watch Ultra", 
        price: 450.00, 
        category: "Wearables", 
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80" 
    },
    { 
        id: 6, 
        name: "Mech Keyboard", 
        price: 150.00, 
        category: "Tech", 
        image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=800&q=80" 
    }
];

let cart = JSON.parse(localStorage.getItem('future_cart')) || [];

// 1. Initial Render
function init() {
    renderProducts(products);
    updateCartUI();
}

// 2. Render Products to Grid
function renderProducts(items) {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = items.map(product => `
        <div class="product-card">
            <div class="img-container">
                <img src="${product.image}" alt="${product.name}" class="product-image" 
                     onerror="this.src='https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=500'">
            </div>
            <div class="product-info">
                <span class="category">${product.category}</span>
                <h3>${product.name}</h3>
                <div class="price-row">
                    <span class="price">$${product.price.toFixed(2)}</span>
                    <button class="add-btn" onclick="addToCart(${product.id})">Add to Cart</button>
                </div>
            </div>
        </div>
    `).join('');
}

// 3. Search Logic
document.getElementById('search-input').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(term));
    renderProducts(filtered);
});

// 4. Cart Logic
function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existing = cart.find(item => item.id === id);
    
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    syncCart();
}

function updateQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== id);
        }
    }
    syncCart();
}

function syncCart() {
    localStorage.setItem('future_cart', JSON.stringify(cart));
    updateCartUI();
}

function updateCartUI() {
    const container = document.getElementById('cart-items-container');
    const totalEl = document.getElementById('cart-total');
    const countEl = document.getElementById('cart-count');

    countEl.innerText = cart.reduce((acc, item) => acc + item.quantity, 0);
    
    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}">
            <div class="item-info">
                <h4>${item.name}</h4>
                <p>$${item.price.toFixed(2)}</p>
                <div>
                    <button class="qty-btn" onclick="updateQty(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
                </div>
            </div>
        </div>
    `).join('');

    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    totalEl.innerText = `$${total.toFixed(2)}`;
}

// 5. Sidebar Controls
const cartBtn = document.getElementById('cart-btn');
const closeBtn = document.getElementById('close-cart');
const sidebar = document.getElementById('cart-sidebar');
const overlay = document.getElementById('overlay');

cartBtn.onclick = () => { sidebar.classList.add('open'); overlay.classList.add('active'); };
closeBtn.onclick = () => { sidebar.classList.remove('open'); overlay.classList.remove('active'); };
overlay.onclick = () => { sidebar.classList.remove('open'); overlay.classList.remove('active'); };

init();