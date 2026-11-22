<?php
// Requête 1 : SELECT, lit les offres actives et les renvoie en JSON au JavaScript
require "config.php";
header("Content-Type: application/json; charset=utf-8");
$offres = $pdo->query("SELECT titre, destination, duree, prix FROM offres WHERE actif = 1 ORDER BY prix")->fetchAll();
echo json_encode($offres, JSON_UNESCAPED_UNICODE);
