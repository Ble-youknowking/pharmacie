# 🇨🇮 DÉMARRAGE RAPIDE - VERSION CÔTE D'IVOIRE

## 🚀 Installation en 2 étapes

### 1️⃣ Installer les dépendances
```bash
npm install
```

### 2️⃣ Démarrer le serveur
```bash
node server.js
```

✅ **C'est tout !** Le serveur démarre sur http://localhost:3000

---

## 🎯 Accès rapide

**🛒 Site Client:** http://localhost:3000/index.html
- Tous les prix en **FCFA**
- Livraison à **Abidjan**
- Standard GRATUIT ou Express 2500 FCFA

**👨‍💼 Interface Admin:** http://localhost:3000/admin.html
- Username: `admin`
- Password: `admin123`

---

## 💰 Comprendre les prix

Les prix sont affichés en **FCFA** partout sur le site :

| Produit | Prix affiché |
|---------|--------------|
| Doliprane 1000mg | 1 961 FCFA |
| Vitamine C Bio | 6 553 FCFA |
| Crème solaire SPF50+ | 9 831 FCFA |

Dans l'admin, vous pouvez entrer les prix en EUR. Ils seront **automatiquement convertis en FCFA** sur le site client.

---

## 🚚 Livraison

### 📦 Standard - GRATUITE
- Délai : 2-3 jours
- Zone : Abidjan (toutes communes)

### 🚀 Express - 2 500 FCFA
- Délai : 24h
- Zone : Abidjan (toutes communes)

**Communes couvertes :**
Cocody • Yopougon • Plateau • Marcory • Adjamé • Koumassi • Port-Bouët • Abobo • Attécoubé • Treichville

---

## 📱 Formulaire de commande

Le formulaire est adapté pour la Côte d'Ivoire :
- **Commune** : Cocody, Yopougon, Plateau, etc.
- **Ville** : Pré-rempli avec "Abidjan"
- **Téléphone** : Format ivoirien

---

## 🎨 Ce qui change par rapport à la version EUR

✅ Prix en FCFA partout (1 EUR = 656 FCFA)
✅ Livraison Express à 2500 FCFA (au lieu de 4.99 EUR)
✅ "Pharmacie Direct CI" au lieu de "Pharmacie Direct"
✅ Formulaire adapté à Abidjan
✅ Interface en français ivoirien

---

## 🛠️ Personnalisation rapide

### Changer le taux de conversion FCFA
Fichier : `public/app.js` ligne 7
```javascript
const FCFA_RATE = 655.957; // Modifier ici
```

### Ajouter d'autres villes
Fichier : `public/index.html` ligne 386
```html
<input type="text" id="customerCity" value="Abidjan" required>
```
Remplacez "Abidjan" par la ville de votre choix.

---

## 📞 Support

Consultez le **README-CI.md** pour la documentation complète adaptée à la Côte d'Ivoire !

**Bon commerce ! 🇨🇮**
