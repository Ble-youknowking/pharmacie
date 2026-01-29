# 🔧 SOLUTION AU PROBLÈME "Missing script: start"

## Option 1 : Lancer directement (RECOMMANDÉ)

Au lieu de `npm start`, utilisez directement :

```bash
node server.js
```

Cette commande démarre le serveur sans passer par npm.

---

## Option 2 : Vérifier le package.json

Ouvrez le fichier `package.json` et vérifiez qu'il contient :

```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

Si la section "scripts" manque ou est vide, remplacez tout le contenu par :

```json
{
  "name": "pharmacie-direct",
  "version": "1.0.0",
  "description": "Système e-commerce pour pharmacie avec interface admin",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "keywords": ["pharmacie", "e-commerce", "node", "express"],
  "author": "",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2",
    "sqlite3": "^5.1.6",
    "bcryptjs": "^2.4.3",
    "express-session": "^1.17.3",
    "multer": "^1.4.5-lts.1"
  }
}
```

Puis réessayez :
```bash
npm start
```

---

## Option 3 : Retélécharger le projet

J'ai mis à jour le fichier ZIP avec le package.json corrigé. Téléchargez-le à nouveau et réessayez.

---

## ✅ Commandes de démarrage

Après avoir installé les dépendances avec `npm install`, vous pouvez utiliser :

**Méthode 1 (directe) :**
```bash
node server.js
```

**Méthode 2 (avec npm) :**
```bash
npm start
```

Les deux méthodes sont équivalentes !

---

## 🎯 Une fois démarré

Vous verrez ce message dans le terminal :
```
✓ Base de données connectée
🚀 Serveur démarré sur http://localhost:3000
📊 Admin: http://localhost:3000/admin.html
🛒 Site: http://localhost:3000/index.html
👤 Identifiants admin: admin / admin123
```

Ensuite, ouvrez votre navigateur et allez à :
- **Site client** : http://localhost:3000/index.html
- **Interface admin** : http://localhost:3000/admin.html

---

## 🆘 Autres problèmes courants

**Erreur "Cannot find module 'express'" ?**
```bash
npm install
```

**Port 3000 déjà utilisé ?**
Modifiez le fichier `server.js` ligne 6 :
```javascript
const PORT = 8080; // au lieu de 3000
```

**Base de données ne se crée pas ?**
Vérifiez les permissions du dossier.

---

Bon développement ! 🚀
