<?php
// Requête 2 : INSERT, enregistre le message du formulaire (requête préparée contre l'injection SQL)
require "config.php";
$nom = trim($_POST["nom"] ?? ""); $email = trim($_POST["email"] ?? ""); $message = trim($_POST["message"] ?? "");
if (strlen($nom) < 2 || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($message) < 10) {
    http_response_code(400); exit("Données invalides");
}
$st = $pdo->prepare("INSERT INTO messages (nom, email, message) VALUES (?, ?, ?)");
$st->execute([$nom, $email, $message]);
echo "OK";
