CREATE DATABASE IF NOT EXISTS safra CHARACTER SET utf8mb4;
USE safra;
CREATE TABLE offres (id INT AUTO_INCREMENT PRIMARY KEY, titre VARCHAR(80), destination VARCHAR(40), duree INT, prix INT, actif TINYINT(1) DEFAULT 1);
CREATE TABLE messages (id INT AUTO_INCREMENT PRIMARY KEY, nom VARCHAR(80), email VARCHAR(120), message TEXT, date_envoi TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
INSERT INTO offres (titre, destination, duree, prix) VALUES
('Djerba tout compris','Djerba',5,780),('Désert et oasis','Tozeur',3,520),
('Istanbul en ville','Istanbul',4,1650),('Paris romantique','Paris',4,2400),
('Corail et forêt','Tabarka',4,480),('Week-end Hammamet','Hammamet',3,390),
('Dubai moderne','Dubai',5,3200),('Rome antique','Rome',4,2100);
