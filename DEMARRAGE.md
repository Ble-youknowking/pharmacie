# 🚀 GUIDE DE DÉMARRAGE RAPIDE

## Installation en 3 étapes

### 1️⃣ Installer les dépendances
```bash
npm install
```

### 2️⃣ Démarrer le serveur
```bash
npm start
```

### 3️⃣ Accéder aux interfaces

**Site Client:** http://localhost:3000/index.html
- Parcourir les produits
- Ajouter au panier
- Commander avec livraison

**Interface Admin:** http://localhost:3000/admin.html
- Username: `admin`
- Password: `admin123`

---

## 🎯 Que faire après l'installation ?

### En tant qu'Admin :
1. **Se connecter** à l'interface admin
2. **Ajouter des produits** avec images
3. **Créer des catégories** personnalisées
4. **Consulter les commandes** des clients
5. **Gérer les statuts** de livraison

### En tant que Client :
1. **Parcourir** les produits par catégorie
2. **Filtrer** par promotions/nouveautés
3. **Ajouter** des produits au panier
4. **Choisir** mode de livraison (Standard GRATUIT ou Express 4.99€)
5. **Commander** avec formulaire complet

---

## 📦 Structure du projet

```
pharmacie-complete/
├── server.js              # Serveur backend
├── package.json           # Dépendances
├── README.md             # Documentation complète
├── public/
│   ├── index.html        # Site client
│   ├── app.js           # JavaScript client
│   ├── admin.html       # Interface admin
│   ├── admin.js         # JavaScript admin
│   └── uploads/         # Images produits
```

---

## ⚡ Fonctionnalités principales

✅ **Catalogue dynamique** - Produits chargés depuis la base de données
✅ **Panier intelligent** - Sauvegarde locale, mise à jour en temps réel
✅ **Livraison flexible** - Standard gratuite ou Express 24h
✅ **Admin complet** - CRUD produits, gestion commandes
✅ **Dashboard** - Statistiques en temps réel
✅ **Upload images** - Pour les produits
✅ **Responsive** - Mobile, tablette, desktop

---

## 🆘 Problèmes courants

**Port 3000 déjà utilisé ?**
```bash
PORT=8080 npm start
```

**Base de données corrompue ?**
```bash
rm pharmacie.db
npm start
```

**Images ne s'affichent pas ?**
```bash
chmod 755 public/uploads
```

---

## 📞 Support

Consultez le **README.md** pour la documentation complète !

**Bon développement ! 🎉**
