// app.js - JavaScript pour le site client

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let allProducts = [];
let categories = [];
let selectedDelivery = 'standard';

// Taux de conversion EUR vers FCFA (approximatif)
const FCFA_RATE = 655.957;

// Fonction pour convertir et formater en FCFA
function formatFCFA(euroPrice) {
    const fcfa = Math.round(euroPrice * FCFA_RATE);
    return fcfa.toLocaleString('fr-FR') + ' FCFA';
}

// Fonction pour obtenir le prix en FCFA (nombre)
function getFCFA(euroPrice) {
    return Math.round(euroPrice * FCFA_RATE);
}

// Charger les données au démarrage
document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
    loadProducts();
    updateCartUI();
});

// Charger les catégories
async function loadCategories() {
    try {
        const response = await fetch('/api/categories');
        categories = await response.json();
        
        const container = document.getElementById('categoriesContainer');
        const allBtn = container.querySelector('.category-btn');
        
        categories.forEach(cat => {
            const btn = document.createElement('div');
            btn.className = 'category-btn';
            btn.onclick = () => filterByCategory(cat.id);
            btn.innerHTML = `
                <span class="icon">${cat.icon}</span>
                <span class="name">${cat.name}</span>
            `;
            container.appendChild(btn);
        });
    } catch (error) {
        console.error('Erreur chargement catégories:', error);
    }
}

// Charger les produits
async function loadProducts(filter = null) {
    try {
        let url = '/api/products';
        if (filter && filter !== 'all') {
            url += `?${filter}=true`;
        }
        
        const response = await fetch(url);
        allProducts = await response.json();
        
        displayProducts(allProducts);
    } catch (error) {
        console.error('Erreur chargement produits:', error);
    }
}

// Afficher les produits
function displayProducts(products) {
    const container = document.getElementById('productsContainer');
    
    if (products.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 3rem; color: #999;">Aucun produit trouvé</p>';
        return;
    }
    
    container.innerHTML = products.map(p => `
        <div class="product-card">
            <div class="product-image">
                ${p.is_promo ? '<span class="product-tag">-' + Math.round(((p.old_price - p.price) / p.old_price) * 100) + '%</span>' : ''}
                ${p.is_new ? '<span class="product-tag green">Nouveau</span>' : ''}
                ${p.is_bio ? '<span class="product-tag yellow">Bio</span>' : ''}
                ${p.image ? `<img src="${p.image}" style="max-width: 100%; max-height: 100%; object-fit: contain;">` : '💊'}
            </div>
            <div class="product-info">
                <div class="product-category">${p.category_icon || ''} ${p.category_name || 'Produit'}</div>
                <div class="product-name">${p.name}</div>
                <div class="product-price-row">
                    <div class="product-price">${formatFCFA(p.price)}</div>
                    ${p.old_price ? `<div class="old-price">${formatFCFA(p.old_price)}</div>` : ''}
                </div>
                <button class="add-to-cart" onclick="addToCart(${p.id}, '${p.name.replace(/'/g, "\\'")}', ${p.price})">
                    Ajouter au panier
                </button>
            </div>
        </div>
    `).join('');
}

// Filtrer par catégorie
function filterByCategory(categoryId) {
    // Mettre à jour l'UI des boutons
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.category-btn').classList.add('active');
    
    if (categoryId === 'all') {
        displayProducts(allProducts);
    } else {
        const filtered = allProducts.filter(p => p.category_id === categoryId);
        displayProducts(filtered);
    }
}

// Filtrer les produits
function filterProducts(type) {
    if (type === 'all') {
        loadProducts();
    } else if (type === 'promo') {
        loadProducts('promo');
    } else if (type === 'new') {
        loadProducts('new');
    }
}

// Ajouter au panier
function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    
    saveCart();
    updateCartUI();
    
    // Animation feedback
    event.target.textContent = '✓ Ajouté !';
    event.target.style.background = '#06D6A0';
    
    setTimeout(() => {
        event.target.textContent = 'Ajouter au panier';
        event.target.style.background = '';
    }, 1500);
}

// Mettre à jour l'UI du panier
function updateCartUI() {
    const badge = document.getElementById('cartBadge');
    const itemsContainer = document.getElementById('cartItems');
    const footer = document.getElementById('cartFooter');
    const totalElement = document.getElementById('cartTotal');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = totalItems;
    
    if (cart.length === 0) {
        itemsContainer.innerHTML = `
            <div class="empty-cart">
                <p style="font-size: 3rem;">🛒</p>
                <p>Votre panier est vide</p>
            </div>
        `;
        footer.style.display = 'none';
    } else {
        itemsContainer.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${formatFCFA(item.price)}</div>
                    <div class="cart-item-qty">
                        <button class="qty-btn" onclick="updateQuantity(${index}, -1)">-</button>
                        <span style="min-width: 30px; text-align: center; font-weight: 800;">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity(${index}, 1)">+</button>
                        <button class="remove-item" onclick="removeFromCart(${index})">Retirer</button>
                    </div>
                </div>
            </div>
        `).join('');
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        totalElement.textContent = formatFCFA(total);
        footer.style.display = 'block';
    }
}

// Mettre à jour la quantité
function updateQuantity(index, change) {
    cart[index].quantity += change;
    
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    
    saveCart();
    updateCartUI();
}

// Retirer du panier
function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartUI();
}

// Sauvegarder le panier
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Toggle panier
function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    sidebar.classList.toggle('open');
}

// Ouvrir le checkout
function openCheckout() {
    if (cart.length === 0) {
        alert('Votre panier est vide !');
        return;
    }
    
    updateCheckoutSummary();
    document.getElementById('checkoutModal').classList.add('show');
    toggleCart();
}

// Fermer le checkout
function closeCheckout() {
    document.getElementById('checkoutModal').classList.remove('show');
}

// Sélectionner mode de livraison
function selectDelivery(method) {
    selectedDelivery = method;
    
    document.querySelectorAll('.delivery-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    event.target.closest('.delivery-option').classList.add('selected');
    
    updateCheckoutSummary();
}

// Mettre à jour le récapitulatif
function updateCheckoutSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryCost = selectedDelivery === 'express' ? 3.81 : 0; // 2500 FCFA ≈ 3.81 EUR
    const total = subtotal + deliveryCost;
    
    document.getElementById('summarySubtotal').textContent = formatFCFA(subtotal);
    document.getElementById('summaryDelivery').textContent = formatFCFA(deliveryCost);
    document.getElementById('summaryTotal').textContent = formatFCFA(total);
}

// Soumettre la commande
document.getElementById('checkoutForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const orderData = {
        customer_name: document.getElementById('customerName').value,
        customer_email: document.getElementById('customerEmail').value,
        customer_phone: document.getElementById('customerPhone').value,
        customer_address: document.getElementById('customerAddress').value,
        customer_city: document.getElementById('customerCity').value,
        customer_postal: document.getElementById('customerPostal').value,
        delivery_method: selectedDelivery,
        items: cart
    };
    
    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert(`✅ Commande validée avec succès !\n\nNuméro de commande: #${data.orderId}\n\nVous recevrez un email de confirmation à ${orderData.customer_email}`);
            
            // Vider le panier
            cart = [];
            saveCart();
            updateCartUI();
            
            closeCheckout();
            document.getElementById('checkoutForm').reset();
        } else {
            alert('❌ Erreur lors de la commande: ' + data.error);
        }
    } catch (error) {
        alert('❌ Erreur de connexion');
        console.error('Erreur:', error);
    }
});
