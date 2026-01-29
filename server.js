// server.js - Backend Node.js avec Express
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const session = require('express-session');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = 3000;

// Configuration du stockage des images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    secret: 'pharmacie-secret-key-2026',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 heures
}));

// Initialisation de la base de données
const db = new sqlite3.Database('./pharmacie.db', (err) => {
    if (err) {
        console.error('Erreur connexion BD:', err);
    } else {
        console.log('✓ Base de données connectée');
        initDatabase();
    }
});

// Création des tables
function initDatabase() {
    db.serialize(() => {
        // Table Administrateurs
        db.run(`CREATE TABLE IF NOT EXISTS admins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            email TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Table Catégories
        db.run(`CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            icon TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Table Produits
        db.run(`CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            price REAL NOT NULL,
            old_price REAL,
            category_id INTEGER,
            image TEXT,
            stock INTEGER DEFAULT 0,
            is_promo BOOLEAN DEFAULT 0,
            is_new BOOLEAN DEFAULT 0,
            is_bio BOOLEAN DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (category_id) REFERENCES categories(id)
        )`);

        // Table Commandes
        db.run(`CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_name TEXT NOT NULL,
            customer_email TEXT NOT NULL,
            customer_phone TEXT NOT NULL,
            customer_address TEXT NOT NULL,
            customer_city TEXT NOT NULL,
            customer_postal TEXT NOT NULL,
            delivery_method TEXT NOT NULL,
            delivery_cost REAL DEFAULT 0,
            subtotal REAL NOT NULL,
            total REAL NOT NULL,
            status TEXT DEFAULT 'pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Table Détails commandes
        db.run(`CREATE TABLE IF NOT EXISTS order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER,
            product_id INTEGER,
            product_name TEXT,
            quantity INTEGER,
            price REAL,
            FOREIGN KEY (order_id) REFERENCES orders(id),
            FOREIGN KEY (product_id) REFERENCES products(id)
        )`);

        // Créer un admin par défaut
        const defaultPassword = bcrypt.hashSync('admin123', 10);
        db.run(`INSERT OR IGNORE INTO admins (username, password, email) 
                VALUES ('admin', ?, 'admin@pharmaciedirect.fr')`, [defaultPassword]);

        // Insérer des catégories par défaut
        const categories = [
            ['Médicaments', '💊'],
            ['Beauté', '💅'],
            ['Bébé & Maman', '👶'],
            ['Sport & Nutrition', '🏃'],
            ['Bio & Naturel', '🌿'],
            ['Hygiène', '🦷']
        ];

        categories.forEach(cat => {
            db.run(`INSERT OR IGNORE INTO categories (name, icon) VALUES (?, ?)`, cat);
        });

        // Insérer des produits d'exemple (prix en EUR, convertis en FCFA côté client)
        const sampleProducts = [
            ['Doliprane 1000mg - 8 comprimés', 'Paracétamol pour douleurs et fièvre', 2.99, 4.29, 1, null, 100, 1, 0, 0],
            ['Vitamine C 1000mg Bio - 60 gélules', 'Complément alimentaire vitamine C', 9.99, 14.99, 5, null, 50, 1, 0, 1],
            ['Crème solaire SPF50+ - 200ml', 'Protection solaire haute', 14.99, 19.99, 2, null, 75, 1, 0, 0],
            ['Spray nasal décongestionnant', 'Soulagement rapide nez bouché', 5.49, null, 1, null, 120, 0, 1, 0],
            ['Shampooing Bio Cheveux Secs', 'Shampooing naturel certifié bio', 7.99, null, 5, null, 60, 0, 1, 1],
            ['Crème hydratante visage', 'Hydratation 24h tous types de peaux', 12.99, 16.99, 2, null, 80, 1, 0, 0],
            ['Sérum Anti-Age', 'Sérum concentré pour peaux matures', 24.99, 29.99, 2, null, 40, 1, 0, 0],
            ['Lait corporel Bébé 500ml', 'Lait hydratant doux pour bébés', 8.99, null, 3, null, 90, 0, 0, 0]
        ];

        sampleProducts.forEach(product => {
            db.run(`INSERT OR IGNORE INTO products 
                    (name, description, price, old_price, category_id, image, stock, is_promo, is_new, is_bio)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, product);
        });
    });
}

// Middleware d'authentification
function requireAuth(req, res, next) {
    if (req.session.adminId) {
        next();
    } else {
        res.status(401).json({ error: 'Non autorisé' });
    }
}

// ==================== ROUTES ADMIN ====================

// Login admin
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    
    db.get('SELECT * FROM admins WHERE username = ?', [username], (err, admin) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        
        if (!admin) {
            return res.status(401).json({ error: 'Identifiants incorrects' });
        }
        
        if (bcrypt.compareSync(password, admin.password)) {
            req.session.adminId = admin.id;
            req.session.username = admin.username;
            res.json({ success: true, username: admin.username });
        } else {
            res.status(401).json({ error: 'Identifiants incorrects' });
        }
    });
});

// Logout admin
app.post('/api/admin/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

// Vérifier session
app.get('/api/admin/check', (req, res) => {
    if (req.session.adminId) {
        res.json({ authenticated: true, username: req.session.username });
    } else {
        res.json({ authenticated: false });
    }
});

// ==================== ROUTES CATÉGORIES ====================

// Liste des catégories
app.get('/api/categories', (req, res) => {
    db.all('SELECT * FROM categories ORDER BY name', (err, categories) => {
        if (err) {
            res.status(500).json({ error: 'Erreur serveur' });
        } else {
            res.json(categories);
        }
    });
});

// Ajouter catégorie (admin)
app.post('/api/admin/categories', requireAuth, (req, res) => {
    const { name, icon } = req.body;
    
    db.run('INSERT INTO categories (name, icon) VALUES (?, ?)', [name, icon], function(err) {
        if (err) {
            res.status(500).json({ error: 'Erreur lors de l\'ajout' });
        } else {
            res.json({ id: this.lastID, name, icon });
        }
    });
});

// ==================== ROUTES PRODUITS ====================

// Liste des produits
app.get('/api/products', (req, res) => {
    const { category, promo, new: isNew, bio } = req.query;
    
    let query = `SELECT p.*, c.name as category_name, c.icon as category_icon 
                 FROM products p 
                 LEFT JOIN categories c ON p.category_id = c.id 
                 WHERE 1=1`;
    const params = [];
    
    if (category) {
        query += ' AND p.category_id = ?';
        params.push(category);
    }
    if (promo === 'true') {
        query += ' AND p.is_promo = 1';
    }
    if (isNew === 'true') {
        query += ' AND p.is_new = 1';
    }
    if (bio === 'true') {
        query += ' AND p.is_bio = 1';
    }
    
    query += ' ORDER BY p.created_at DESC';
    
    db.all(query, params, (err, products) => {
        if (err) {
            res.status(500).json({ error: 'Erreur serveur' });
        } else {
            res.json(products);
        }
    });
});

// Produit par ID
app.get('/api/products/:id', (req, res) => {
    db.get(`SELECT p.*, c.name as category_name, c.icon as category_icon 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id 
            WHERE p.id = ?`, [req.params.id], (err, product) => {
        if (err) {
            res.status(500).json({ error: 'Erreur serveur' });
        } else if (!product) {
            res.status(404).json({ error: 'Produit introuvable' });
        } else {
            res.json(product);
        }
    });
});

// Ajouter produit (admin)
app.post('/api/admin/products', requireAuth, upload.single('image'), (req, res) => {
    const { name, description, price, old_price, category_id, stock, is_promo, is_new, is_bio } = req.body;
    const image = req.file ? '/uploads/' + req.file.filename : null;
    
    db.run(`INSERT INTO products 
            (name, description, price, old_price, category_id, image, stock, is_promo, is_new, is_bio)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, description, price, old_price || null, category_id, image, stock || 0, 
         is_promo ? 1 : 0, is_new ? 1 : 0, is_bio ? 1 : 0],
        function(err) {
            if (err) {
                res.status(500).json({ error: 'Erreur lors de l\'ajout' });
            } else {
                res.json({ id: this.lastID, message: 'Produit ajouté avec succès' });
            }
        }
    );
});

// Modifier produit (admin)
app.put('/api/admin/products/:id', requireAuth, upload.single('image'), (req, res) => {
    const { name, description, price, old_price, category_id, stock, is_promo, is_new, is_bio } = req.body;
    const image = req.file ? '/uploads/' + req.file.filename : req.body.current_image;
    
    db.run(`UPDATE products 
            SET name=?, description=?, price=?, old_price=?, category_id=?, image=?, 
                stock=?, is_promo=?, is_new=?, is_bio=?
            WHERE id=?`,
        [name, description, price, old_price || null, category_id, image, stock || 0,
         is_promo ? 1 : 0, is_new ? 1 : 0, is_bio ? 1 : 0, req.params.id],
        function(err) {
            if (err) {
                res.status(500).json({ error: 'Erreur lors de la modification' });
            } else {
                res.json({ message: 'Produit modifié avec succès' });
            }
        }
    );
});

// Supprimer produit (admin)
app.delete('/api/admin/products/:id', requireAuth, (req, res) => {
    db.run('DELETE FROM products WHERE id = ?', [req.params.id], function(err) {
        if (err) {
            res.status(500).json({ error: 'Erreur lors de la suppression' });
        } else {
            res.json({ message: 'Produit supprimé avec succès' });
        }
    });
});

// ==================== ROUTES COMMANDES ====================

// Créer commande
app.post('/api/orders', (req, res) => {
    const { 
        customer_name, customer_email, customer_phone, 
        customer_address, customer_city, customer_postal,
        delivery_method, items 
    } = req.body;
    
    // Calculer le coût de livraison (pour Abidjan, Côte d'Ivoire)
    let delivery_cost = 0;
    if (delivery_method === 'express') {
        delivery_cost = 3.81; // 2500 FCFA
    } else if (delivery_method === 'standard') {
        delivery_cost = 0; // Gratuit pour Abidjan
    }
    
    // Calculer le sous-total
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + delivery_cost;
    
    // Insérer la commande
    db.run(`INSERT INTO orders 
            (customer_name, customer_email, customer_phone, customer_address, 
             customer_city, customer_postal, delivery_method, delivery_cost, subtotal, total)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [customer_name, customer_email, customer_phone, customer_address, 
         customer_city, customer_postal, delivery_method, delivery_cost, subtotal, total],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Erreur lors de la commande' });
            }
            
            const orderId = this.lastID;
            
            // Insérer les items de la commande
            const stmt = db.prepare(`INSERT INTO order_items 
                                     (order_id, product_id, product_name, quantity, price)
                                     VALUES (?, ?, ?, ?, ?)`);
            
            items.forEach(item => {
                stmt.run([orderId, item.id, item.name, item.quantity, item.price]);
            });
            
            stmt.finalize();
            
            res.json({ 
                success: true, 
                orderId: orderId,
                message: 'Commande créée avec succès' 
            });
        }
    );
});

// Liste des commandes (admin)
app.get('/api/admin/orders', requireAuth, (req, res) => {
    db.all(`SELECT * FROM orders ORDER BY created_at DESC`, (err, orders) => {
        if (err) {
            res.status(500).json({ error: 'Erreur serveur' });
        } else {
            res.json(orders);
        }
    });
});

// Détails commande (admin)
app.get('/api/admin/orders/:id', requireAuth, (req, res) => {
    db.get('SELECT * FROM orders WHERE id = ?', [req.params.id], (err, order) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        
        db.all('SELECT * FROM order_items WHERE order_id = ?', [req.params.id], (err, items) => {
            if (err) {
                return res.status(500).json({ error: 'Erreur serveur' });
            }
            
            res.json({ ...order, items });
        });
    });
});

// Changer statut commande (admin)
app.put('/api/admin/orders/:id/status', requireAuth, (req, res) => {
    const { status } = req.body;
    
    db.run('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id], function(err) {
        if (err) {
            res.status(500).json({ error: 'Erreur lors de la mise à jour' });
        } else {
            res.json({ message: 'Statut mis à jour' });
        }
    });
});

// ==================== STATISTIQUES (admin) ====================

app.get('/api/admin/stats', requireAuth, (req, res) => {
    const stats = {};
    
    db.get('SELECT COUNT(*) as count FROM products', (err, result) => {
        stats.totalProducts = result.count;
        
        db.get('SELECT COUNT(*) as count FROM orders', (err, result) => {
            stats.totalOrders = result.count;
            
            db.get('SELECT COUNT(*) as count FROM orders WHERE status = "pending"', (err, result) => {
                stats.pendingOrders = result.count;
                
                db.get('SELECT SUM(total) as revenue FROM orders WHERE status = "completed"', (err, result) => {
                    stats.totalRevenue = result.revenue || 0;
                    
                    res.json(stats);
                });
            });
        });
    });
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    console.log(`📊 Admin: http://localhost:${PORT}/admin.html`);
    console.log(`🛒 Site: http://localhost:${PORT}/index.html`);
    console.log(`👤 Identifiants admin: admin / admin123`);
});
