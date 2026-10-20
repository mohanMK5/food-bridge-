-- Run this file once in MySQL:  mysql -u root -p < database.sql

CREATE DATABASE IF NOT EXISTS food_bridge;
USE food_bridge;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('donor', 'ngo') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS donations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  donor_id INT NOT NULL,
  food_name VARCHAR(100) NOT NULL,
  quantity VARCHAR(50) NOT NULL,
  expiry_date DATE NOT NULL,
  location VARCHAR(200) NOT NULL,
  contact VARCHAR(50) NOT NULL,
  description TEXT,
  status ENUM('pending', 'accepted') DEFAULT 'pending',
  accepted_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (donor_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (accepted_by) REFERENCES users(id) ON DELETE SET NULL
);
