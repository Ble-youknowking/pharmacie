// admin.js - JavaScript pour l'interface admin

let currentEditId = null;
let categories = [];

// Taux de conversion EUR vers FCFA
const FCFA_RATE = 655.957;

// Fonction pour formater en FCFA
function formatFCFA(euroPrice) {
    const fcfa = Math.round(euroPrice * FCFA_RATE);
    return fcfa.toLocaleString('fr-FR') + ' FCFA';
}

// Vérifier l'authentification au chargement
window.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('/api/admin/check');
    const data = await response.json();
    
    if (data.authenticated) {
        showAdminPage(data.username);
    }
});

// Login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch('/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showAdminPage(data.username);
        } else {
            alert(data.error);
        }
    } catch (error) {
        alert('Erreur de connexion');
    }
});

function showAdminPage(username) {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('adminPage').style.display = 'block';
    document.getElementById('adminUsername').textContent = '👤 ' + username;
    
    loadStats();
    loadProducts();
    loadOrders();
    loadCategories();
    loadCategoriesForSelect();
}

async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    location.reload();
}

// Navigation
function showSection(sectionName) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(sectionName).classList.add('active');
    
    document.querySelectorAll('.sidebar-menu li').forEach(li => li.classList.remove('active'));
    event.target.classList.add('active');
    
    if (sectionName === 'dashboard') loadStats();
    if (sectionName === 'products') loadProducts();
    if (sectionName === 'orders') loadOrders();
    if (sectionName === 'categories') loadCategories();
}

// Charger les statistiques
async function loadStats() {
    try {
        const response = await fetch('/api/admin/stats');
        const stats = await response.json();
        
        document.getElementById('statProducts').textContent = stats.totalProducts;
        document.getElementById('statOrders').textContent = stats.totalOrders;
        document.getElementById('statPending').textContent = stats.pendingOrders;
        document.getElementById('statRevenue').textContent = formatFCFA(stats.totalRevenue);
    } catch (error) {
        console.error('Erreur chargement stats:', error);
    }
}

// Charger les produits
async function loadProducts() {
    try {
        const response = await fetch('/api/products');
        const products = await response.json();
        
        const tbody = document.getElementById('productsTable');
        tbody.innerHTML = products.map(p => `
            <tr>
                <td>${p.id}</td>
                <td>${p.name}</td>
                <td>${formatFCFA(p.price)} ${p.old_price ? `<br><span style="text-decoration: line-through; color: #999;">${formatFCFA(p.old_price)}</span>` : ''}</td>
                <td>${p.stock}</td>
                <td>${p.category_icon || ''} ${p.category_name || 'N/A'}</td>
                <td>
                    ${p.is_promo ? '<span class="badge badge-promo">Promo</span>' : ''}
                    ${p.is_new ? '<span class="badge badge-new">Nouveau</span>' : ''}
                    ${p.is_bio ? '<span class="badge badge-bio">Bio</span>' : ''}
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-small btn-edit" onclick="editProduct(${p.id})">Modifier</button>
                        <button class="btn btn-small btn-delete" onclick="deleteProduct(${p.id})">Supprimer</button>
                    </div>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Erreur chargement produits:', error);
    }
}

// Charger les commandes
async function loadOrders() {
    try {
        const response = await fetch('/api/admin/orders');
        const orders = await response.json();
        
        const tbody = document.getElementById('ordersTable');
        tbody.innerHTML = orders.map(o => `
            <tr>
                <td>#${o.id}</td>
                <td>${o.customer_name}<br><small>${o.customer_email}</small></td>
                <td>${o.delivery_method === 'express' ? '🚀 Express (24h)' : '📦 Standard (2-3j)'}<br><small>${formatFCFA(o.delivery_cost)}</small></td>
                <td><strong>${formatFCFA(o.total)}</strong></td>
                <td>
                    <span class="badge badge-${o.status}">
                        ${o.status === 'pending' ? 'En attente' : o.status === 'completed' ? 'Complétée' : 'Annulée'}
                    </span>
                </td>
                <td>${new Date(o.created_at).toLocaleDateString('fr-FR')}</td>
                <td>
                    <button class="btn btn-small btn-edit" onclick="viewOrder(${o.id})">Voir</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Erreur chargement commandes:', error);
    }
}

// Charger les catégories
async function loadCategories() {
    try {
        const response = await fetch('/api/categories');
        categories = await response.json();
        
        const tbody = document.getElementById('categoriesTable');
        tbody.innerHTML = categories.map(c => `
            <tr>
                <td>${c.id}</td>
                <td style="font-size: 2rem;">${c.icon || ''}</td>
                <td>${c.name}</td>
                <td>${new Date(c.created_at).toLocaleDateString('fr-FR')}</td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Erreur chargement catégories:', error);
    }
}

// Charger catégories pour le select
async function loadCategoriesForSelect() {
    try {
        const response = await fetch('/api/categories');
        const cats = await response.json();
        
        const select = document.getElementById('productCategory');
        select.innerHTML = cats.map(c => `<option value="${c.id}">${c.icon || ''} ${c.name}</option>`).join('');
    } catch (error) {
        console.error('Erreur chargement catégories:', error);
    }
}

// Modal Produit
function openProductModal(id = null) {
    currentEditId = id;
    document.getElementById('productModalTitle').textContent = id ? 'Modifier le produit' : 'Ajouter un produit';
    
    if (id) {
        loadProductForEdit(id);
    } else {
        document.getElementById('productForm').reset();
        document.getElementById('productId').value = '';
    }
    
    document.getElementById('productModal').classList.add('show');
}

function closeProductModal() {
    document.getElementById('productModal').classList.remove('show');
    currentEditId = null;
}

async function loadProductForEdit(id) {
    try {
        const response = await fetch(`/api/products/${id}`);
        const product = await response.json();
        
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productDescription').value = product.description || '';
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productOldPrice').value = product.old_price || '';
        document.getElementById('productCategory').value = product.category_id;
        document.getElementById('productStock').value = product.stock;
        document.getElementById('productPromo').checked = product.is_promo;
        document.getElementById('productNew').checked = product.is_new;
        document.getElementById('productBio').checked = product.is_bio;
    } catch (error) {
        console.error('Erreur chargement produit:', error);
    }
}

function editProduct(id) {
    openProductModal(id);
}

async function deleteProduct(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;
    
    try {
        const response = await fetch(`/api/admin/products/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('Produit supprimé avec succès');
            loadProducts();
            loadStats();
        }
    } catch (error) {
        alert('Erreur lors de la suppression');
    }
}

// Soumettre le formulaire produit
document.getElementById('productForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('name', document.getElementById('productName').value);
    formData.append('description', document.getElementById('productDescription').value);
    formData.append('price', document.getElementById('productPrice').value);
    formData.append('old_price', document.getElementById('productOldPrice').value);
    formData.append('category_id', document.getElementById('productCategory').value);
    formData.append('stock', document.getElementById('productStock').value);
    formData.append('is_promo', document.getElementById('productPromo').checked);
    formData.append('is_new', document.getElementById('productNew').checked);
    formData.append('is_bio', document.getElementById('productBio').checked);
    
    const imageFile = document.getElementById('productImage').files[0];
    if (imageFile) {
        formData.append('image', imageFile);
    }
    
    const productId = document.getElementById('productId').value;
    const url = productId ? `/api/admin/products/${productId}` : '/api/admin/products';
    const method = productId ? 'PUT' : 'POST';
    
    try {
        const response = await fetch(url, {
            method: method,
            body: formData
        });
        
        if (response.ok) {
            alert('Produit enregistré avec succès');
            closeProductModal();
            loadProducts();
            loadStats();
        }
    } catch (error) {
        alert('Erreur lors de l\'enregistrement');
    }
});

// Modal Commande
async function viewOrder(id) {
    try {
        const response = await fetch(`/api/admin/orders/${id}`);
        const order = await response.json();
        
        const detailsHtml = `
            <div class="order-details">
                <h4>Informations client</h4>
                <p><strong>Nom:</strong> ${order.customer_name}</p>
                <p><strong>Email:</strong> ${order.customer_email}</p>
                <p><strong>Téléphone:</strong> ${order.customer_phone}</p>
                <p><strong>Adresse:</strong> ${order.customer_address}, ${order.customer_postal} ${order.customer_city}</p>
            </div>
            
            <div class="order-details">
                <h4>Livraison</h4>
                <p><strong>Méthode:</strong> ${order.delivery_method === 'express' ? 'Express (24h) - Abidjan' : 'Standard (2-3 jours) - Abidjan'}</p>
                <p><strong>Frais:</strong> ${formatFCFA(order.delivery_cost)}</p>
            </div>
            
            <div class="order-details">
                <h4>Produits commandés</h4>
                <ul class="order-items">
                    ${order.items.map(item => `
                        <li>
                            ${item.product_name} - Quantité: ${item.quantity} - Prix: ${formatFCFA(item.price)}
                            <br><strong>Total: ${formatFCFA(item.quantity * item.price)}</strong>
                        </li>
                    `).join('')}
                </ul>
            </div>
            
            <div class="order-details">
                <h4>Récapitulatif</h4>
                <p><strong>Sous-total:</strong> ${formatFCFA(order.subtotal)}</p>
                <p><strong>Livraison:</strong> ${formatFCFA(order.delivery_cost)}</p>
                <p style="font-size: 1.3rem;"><strong>TOTAL:</strong> ${formatFCFA(order.total)}</p>
            </div>
            
            <div class="order-details">
                <h4>Statut de la commande</h4>
                <select id="orderStatus" class="form-group" style="margin-bottom: 1rem;">
                    <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>En attente</option>
                    <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>En traitement</option>
                    <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Expédiée</option>
                    <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Complétée</option>
                    <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Annulée</option>
                </select>
                <button class="btn btn-primary" onclick="updateOrderStatus(${order.id})">Mettre à jour le statut</button>
            </div>
        `;
        
        document.getElementById('orderDetails').innerHTML = detailsHtml;
        document.getElementById('orderModal').classList.add('show');
    } catch (error) {
        console.error('Erreur chargement commande:', error);
    }
}

async function updateOrderStatus(orderId) {
    const status = document.getElementById('orderStatus').value;
    
    try {
        const response = await fetch(`/api/admin/orders/${orderId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        
        if (response.ok) {
            alert('Statut mis à jour avec succès');
            closeOrderModal();
            loadOrders();
            loadStats();
        }
    } catch (error) {
        alert('Erreur lors de la mise à jour');
    }
}

function closeOrderModal() {
    document.getElementById('orderModal').classList.remove('show');
}

// Modal Catégorie
function openCategoryModal() {
    document.getElementById('categoryForm').reset();
    document.getElementById('categoryModal').classList.add('show');
}

function closeCategoryModal() {
    document.getElementById('categoryModal').classList.remove('show');
}

document.getElementById('categoryForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('categoryName').value;
    const icon = document.getElementById('categoryIcon').value;
    
    try {
        const response = await fetch('/api/admin/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, icon })
        });
        
        if (response.ok) {
            alert('Catégorie ajoutée avec succès');
            closeCategoryModal();
            loadCategories();
            loadCategoriesForSelect();
        }
    } catch (error) {
        alert('Erreur lors de l\'ajout');
    }
});
