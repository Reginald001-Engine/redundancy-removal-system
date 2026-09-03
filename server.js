// server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const DB_PATH = path.join(__dirname, 'db.json');

// 🛡️ SAFE Helper functions to read and write to our "Cloud Database"
function getDatabase() {
    try {
        const data = fs.readFileSync(DB_PATH, 'utf8');
        // If the file is completely empty, return an empty array
        if (!data.trim()) return []; 
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading database, resetting to empty:", error.message);
        return []; // Fallback to empty array so the app doesn't crash
    }
}

function saveDatabase(data) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// 🧠 THE BRAIN: Validation & Classification Mechanism
function classifyData(newEntry, existingData) {
    // 1. Check for Exact Redundancy (Duplicate Email)
    const isRedundant = existingData.some(entry => entry.email.toLowerCase() === newEntry.email.toLowerCase());
    if (isRedundant) {
        return { status: "REJECTED", reason: "Redundant Data (Duplicate Email)" };
    }

    // 2. Check for False Positives (e.g., Test data, invalid patterns)
    const isFalsePositive = newEntry.email.includes('test') || newEntry.email.includes('fake') || newEntry.name.toLowerCase() === 'test';
    if (isFalsePositive) {
        return { status: "FLAGGED", reason: "False Positive (Suspicious/Test Data)" };
    }

    // 3. If it passes both, it's Unique and Verified
    return { status: "ACCEPTED", reason: "Unique and Verified Data" };
}

//  API ENDPOINT 1: Submit New Data (Wrapped in a safety net)
app.post('/api/add-data', (req, res) => {
    try {
        const { name, email, phone } = req.body;

        if (!name || !email) {
            return res.status(400).json({ error: "Name and Email are required." });
        }

        const newEntry = { 
            id: Date.now(), 
            name, 
            email, 
            phone, 
            timestamp: new Date().toLocaleString() 
        };

        const db = getDatabase();
        const classification = classifyData(newEntry, db);

        // Prevent duplicate data from being added; append ONLY unique/verified
        if (classification.status === "ACCEPTED") {
            db.push(newEntry);
            saveDatabase(db);
            return res.json({ 
                success: true, 
                message: "Data added successfully!", 
                classification: classification 
            });
        } else {
            return res.json({ 
                success: false, 
                message: `Data was not added.`, 
                classification: classification 
            });
        }
    } catch (error) {
        console.error("Server Error in /api/add-data:", error);
        // This prevents the 500 HTML error and sends proper JSON!
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
});

//  API ENDPOINT 2: View Database (Wrapped in a safety net)
app.get('/api/data', (req, res) => {
    try {
        const db = getDatabase();
        res.json(db);
    } catch (error) {
        console.error("Server Error in /api/data:", error);
        res.status(500).json({ error: "Failed to load database" });
    }
});

// Start the server
const PORT = 3001; 
app.listen(PORT, () => {
    console.log(`🛡️ Redundancy Removal System running on http://localhost:${PORT}`);
});