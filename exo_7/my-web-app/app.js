const express = require('express');
const app = express();
const port = 3000;

// Middleware pour servir des fichiers statiques depuis le répertoire "public"
app.use(express.static('public'));

// Route pour la page d'accueil
app.get('/', (req, res) => {
    res.send('Bienvenue sur l\'application web de test de charge!');
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`L'application web écoute sur http://localhost:${port}`);
});
