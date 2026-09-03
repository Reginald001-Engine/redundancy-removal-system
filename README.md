# 🛡️ Redundancy Removal System

An intelligent data validation system that identifies, classifies, and prevents redundant or false data from entering cloud databases. Built with Node.js and Express.

## 📋 Overview

This system ensures database accuracy and efficiency by implementing a smart validation mechanism that checks new data against existing records. It automatically classifies incoming data as Unique, Redundant, or False Positive, preventing duplicate entries and maintaining data integrity.

## ✨ Features

-  Data Classification: Automatically categorizes data as:
  - ✅ Unique & Verified - New, valid data
  - ❌ Redundant - Duplicate entries (same email)
  - ⚠️ False Positive - Suspicious/test data
  
-  Validation Mechanism: Real-time checking against existing database records
- 🚫 Duplicate Prevention: Blocks redundant data from being added
-  Clean UI: Beautiful, responsive interface for data management
- ⚡ Instant Feedback**: Immediate classification results
- 💾 Persistent Storage**: JSON-based database simulation

## 🛠️ Tech Stack

- Backend: Node.js, Express.js
- Frontend: HTML5, CSS3, Vanilla JavaScript
- Database: JSON file (simulating cloud database)
- API: RESTful endpoints

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/redundancy-removal-system.git
   cd redundancy-removal-system