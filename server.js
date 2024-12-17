const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(express.json()); 
app.use(cors({
    origin: 'https://frontend-git-master-tharani-kumars-projects.vercel.app', 
}));


app.post("/add-user", async (req, res) => {
    try {
        console.log("Received data:", req.body);

        const { firstname, lastname, employeeid, email, phoneno, department, doj, role } = req.body;

        if (!firstname || !lastname || !employeeid || !email || !phoneno || !department || !doj || !role) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const checkQuery = `SELECT * FROM users WHERE email = ? OR employee_id = ?`;

        const [results] = await db.promise().query(checkQuery, [email, employeeid]);

        if (results.length > 0) {
            const duplicateField = results.find(result => result.email === email) ? "email" : "employee ID";
            return res.status(409).json({ error: `Duplicate entry for ${duplicateField}` });
        }

        const sql = `INSERT INTO users (first_name, last_name, employee_id, email, phone_no, department, doj, role) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [firstname, lastname, employeeid, email, phoneno, department, doj, role];

        await db.promise().query(sql, values);

        console.log("Data inserted successfully");
        return res.status(201).json({ message: "User added successfully" });
        
    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ error: "Database error" });
    }
});

  


app.listen(5001, () => {
    console.log('Server is running on port 5001');
}); 

