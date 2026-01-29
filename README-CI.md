# 🇨🇮 Pharmacie Direct CI - E-Commerce pour la Côte d'Ivoire

Système e-commerce professionnel pour pharmacie adapté au marché ivoirien avec prix en FCFA, livraison à Abidjan et interface complète d'administration.

## 🌍 Spécificités Côte d'Ivoire

### 💰 Devise
- **Tous les prix affichés en FCFA** (Franc CFA)
- Conversion automatique depuis la base EUR (1 EUR ≈ 656 FCFA)
- Format d'affichage : `1 962 FCFA` au lieu de `€2.99`

### 🚚 Livraison à Abidjan
- **Livraison Standard** : GRATUITE (2-3 jours à Abidjan)
- **Livraison Express** : 2 500 FCFA (24h à Abidjan)
- Communes couvertes : Cocody, Yopougon, Plateau, Marcory, Adjamé, etc.

### 📱 Interface adaptée
- Formulaire avec champ "Commune" au lieu de "Code postal"
- Ville pré-remplie : Abidjan
- Numéros de téléphone au format ivoirien

## 🚀 Installation

### 1. Pré-requis
- Node.js (version 14+)
- npm

### 2. Installation
```bash
npm install
```

### 3. Démarrage
```bash
node server.js
```

Le serveur démarre sur **http://localhost:3000**

## 🎯 Accès aux interfaces

### Site Client
- URL: **http://localhost:3000/index.html**
- Parcourir les produits en FCFA
- Commander avec livraison à Abidjan

### Interface Admin
- URL: **http://localhost:3000/admin.html**
- Username: `admin`
- Password: `admin123`

## 💳 Système de prix

Les prix sont stockés en EUR dans la base de données et **convertis automatiquement en FCFA** côté client :

| Produit | Prix EUR (BD) | Prix FCFA (Affiché) |
|---------|---------------|---------------------|
| Doliprane 1000mg | 2.99 EUR | 1 961 FCFA |
| Vitamine C Bio | 9.99 EUR | 6 553 FCFA |
| Crème solaire SPF50+ | 14.99 EUR | 9 831 FCFA |

### Ajouter des produits
Dans l'interface admin, entrez les prix en EUR. La conversion en FCFA se fait automatiquement à l'affichage.

## 📦 Fonctionnalités

### Site Client
✅ Catalogue en FCFA avec filtres
✅ Panier intelligent avec sauvegarde
✅ 2 modes de livraison (Standard gratuit / Express 2500 FCFA)
✅ Formulaire adapté à Abidjan
✅ Design responsive

### Interface Admin
✅ Gestion complète des produits
✅ Upload d'images
✅ Gestion des commandes
✅ Statistiques en temps réel (montants en FCFA)
✅ Suivi des livraisons à Abidjan

## 🗄️ Base de données

### Tables principales
- **admins** - Comptes administrateurs
- **categories** - Catégories de produits
- **products** - Produits (prix en EUR)
- **orders** - Commandes clients
- **order_items** - Détails commandes

### Données pré-chargées
- 1 admin (admin/admin123)
- 6 catégories
- 8 produits d'exemple

## 🌟 Exemples de prix

```
Doliprane 1000mg        1 961 FCFA   (-30%)
Vitamine C Bio          6 553 FCFA   
Crème solaire SPF50+    9 831 FCFA   (-25%)
Spray nasal             3 601 FCFA   
Shampooing Bio          5 240 FCFA   
Crème hydratante        8 520 FCFA   
Sérum Anti-Age         16 392 FCFA   
Lait corporel Bébé      5 897 FCFA   
```

## 📍 Zones de livraison

### Livraison Standard (GRATUITE)
Toutes les communes d'Abidjan :
- Cocody, Yopougon, Plateau, Marcory, Adjamé
- Koumassi, Port-Bouët, Abobo, Attécoubé, Treichville

### Livraison Express (2500 FCFA)
Livraison en 24h dans toutes les communes d'Abidjan

## 🔧 Configuration

### Modifier le taux de conversion FCFA
Fichier : `public/app.js` et `public/admin.js`
```javascript
const FCFA_RATE = 655.957; // 1 EUR = X FCFA
```

### Modifier les frais de livraison
Fichier : `server.js`
```javascript
if (delivery_method === 'express') {
    delivery_cost = 3.81; // 2500 FCFA en EUR
}
```

Fichier : `public/app.js`
```javascript
const deliveryCost = selectedDelivery === 'express' ? 3.81 : 0;
```

## 📱 Contact

Pour adapter davantage le système à vos besoins (paiement mobile money, nouvelles zones de livraison, etc.), contactez votre développeur.

## 📄 Licence

MIT - Libre d'utilisation

---

**Bon commerce en Côte d'Ivoire ! 🇨🇮**
