<?php
// Connexion MySQL avec PDO (adaptez les identifiants à votre serveur local, ex. XAMPP)
$pdo = new PDO("mysql:host=localhost;dbname=safra;charset=utf8mb4", "root", "", [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
]);
