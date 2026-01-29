# 🏥 Pharmacie Direct - E-Commerce Complet

Système e-commerce professionnel pour pharmacie avec interface admin, gestion des produits, commandes et livraisons.

## 🚀 Fonctionnalités

### Site Client
- ✅ Catalogue de produits dynamique avec filtres
- ✅ Panier d'achat avec mise à jour en temps réel
- ✅ Système de commande complet
- ✅ Deux modes de livraison (Standard gratuite / Express 4.99€)
- ✅ Interface moderne style supermarché
- ✅ Design responsive (mobile, tablette, desktop)

### Interface Admin
- ✅ Authentification sécurisée (bcrypt)
- ✅ Dashboard avec statistiques
- ✅ Gestion complète des produits (CRUD)
- ✅ Upload d'images pour les produits
- ✅ Gestion des catégories
- ✅ Gestion des commandes avec changement de statut
- ✅ Détails complets des commandes

### Base de Données
- ✅ SQLite (légère, sans installation)
- ✅ 5 tables relationnelles
- ✅ Données de démonstration pré-chargées

## 📦 Installation

### 1. Pré-requis
- Node.js (version 14 ou supérieure)
- npm (inclus avec Node.js)

### 2. Installation des dépendances

```bash
npm install
```

### 3. Créer le dossier uploads

```bash
mkdir -p public/uploads
```

### 4. Démarrer le serveur

```bash
npm start
```

Le serveur démarre sur **http://localhost:3000**

## 🎯 Accès aux interfaces

### Site Client
- URL: **http://localhost:3000/index.html**
- Parcourir les produits, ajouter au panier, commander

### Interface Admin
- URL: **http://localhost:3000/admin.html**
- **Identifiants par défaut:**
  - Username: `admin`
  - Password: `admin123`

## 📚 Structure du projet

```
pharmacie-direct/
├── server.js              # Serveur Express + API REST
├── package.json           # Dépendances npm
├── pharmacie.db          # Base de données SQLite (créée automatiquement)
├── public/
│   ├── index.html        # Page principale du site
│   ├── app.js            # JavaScript client
│   ├── admin.html        # Interface d'administration
│   ├── admin.js          # JavaScript admin
│   └── uploads/          # Images des produits (à créer)
└── README.md             # Ce fichier
```

## 🗄️ Base de Données

### Tables

1. **admins** - Comptes administrateurs
2. **categories** - Catégories de produits
3. **products** - Catalogue de produits
4. **orders** - Commandes clients
5. **order_items** - Détails des commandes

### Données de démo

Le système vient avec:
- 1 compte admin (admin/admin123)
- 6 catégories pré-configurées
- 6 produits d'exemple

## 🔧 API Endpoints

### Publics
- `GET /api/categories` - Liste des catégories
- `GET /api/products` - Liste des produits (avec filtres optionnels)
- `GET /api/products/:id` - Détails d'un produit
- `POST /api/orders` - Créer une commande

### Admin (authentification requise)
- `POST /api/admin/login` - Connexion admin
- `POST /api/admin/logout` - Déconnexion
- `GET /api/admin/check` - Vérifier session
- `GET /api/admin/stats` - Statistiques
- `GET /api/admin/orders` - Liste des commandes
- `GET /api/admin/orders/:id` - Détails commande
- `PUT /api/admin/orders/:id/status` - Changer statut
- `POST /api/admin/products` - Ajouter produit
- `PUT /api/admin/products/:id` - Modifier produit
- `DELETE /api/admin/products/:id` - Supprimer produit
- `POST /api/admin/categories` - Ajouter catégorie

## 💳 Système de Livraison

### Mode Standard
- **Prix:** GRATUIT
- **Délai:** 2-3 jours ouvrés
- Automatiquement sélectionné

### Mode Express
- **Prix:** 4.99€
- **Délai:** 24h
- Option premium

## 🛡️ Sécurité

- Mots de passe hashés avec bcrypt
- Sessions sécurisées avec express-session
- Authentification requise pour toutes les routes admin
- Protection CSRF native d'Express

## 📱 Interface

### Design
- Typographie moderne (Bebas Neue + Work Sans)
- Palette de couleurs énergique (Rouge, Bleu, Jaune, Vert)
- Style "supermarché" pour familiarité client
- Animations et transitions fluides

### Responsive
- Mobile-first design
- Adapté tablette et desktop
- Menu burger automatique sur mobile

## 🔄 Workflow typique

1. **Admin se connecte** → Ajoute des produits avec images
2. **Client visite le site** → Parcourt les catégories
3. **Client ajoute au panier** → Valide avec informations livraison
4. **Commande créée** → Visible dans l'admin
5. **Admin traite** → Change le statut de la commande

## 🆘 Dépannage

### Le serveur ne démarre pas
```bash
# Vérifier que le port 3000 est libre
lsof -i :3000

# Ou utiliser un autre port
PORT=8080 npm start
```

### Erreur de base de données
```bash
# Supprimer et recréer la BD
rm pharmacie.db
npm start
```

### Images ne s'affichent pas
```bash
# Vérifier que le dossier existe
mkdir -p public/uploads

# Vérifier les permissions
chmod 755 public/uploads
```

## 📈 Améliorations futures

- [ ] Paiement en ligne (Stripe, PayPal)
- [ ] Notifications email automatiques
- [ ] Recherche de produits
- [ ] Avis clients
- [ ] Programme de fidélité
- [ ] Multi-langues
- [ ] Export des commandes (PDF, Excel)
- [ ] Statistiques avancées (graphiques)

## 📄 Licence

MIT - Libre d'utilisation pour projets personnels et commerciaux

## 👨‍💻 Support

Pour toute question ou problème:
1. Vérifier ce README
2. Consulter les logs du serveur
3. Vérifier la console du navigateur

---

**Bon commerce ! 🚀**
