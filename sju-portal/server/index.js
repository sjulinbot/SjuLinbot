const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

console.log("🚀 Starting server...");

// Catch hidden crashes
process.on("uncaughtException", err => {
    console.error("UNCAUGHT EXCEPTION:", err);
});

process.on("unhandledRejection", err => {
    console.error("UNHANDLED REJECTION:", err);
});

const app = express();

app.use(cors());
app.use(express.json());

// Request Logging + No Cache
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} [${req.method}] ${req.url}`);
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    next();
});

// Health check route
app.get('/api/ping', (req, res) => {
    res.json({ success: true, message: 'pong' });
});

// Handle malformed JSON
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error('JSON Syntax Error:', err.message);
        return res.status(400).json({ success: false, message: 'Invalid JSON format' });
    }
    next();
});

// ✅ SAFE DATA HANDLER
const dataFilePath = path.join(__dirname, 'data.json');

const getData = () => {
    try {
        if (!fs.existsSync(dataFilePath)) {
            console.error("❌ data.json NOT FOUND");
            return { students: [], staff: [], applicants: [] };
        }

        const raw = fs.readFileSync(dataFilePath, 'utf8');

        if (!raw) {
            console.error("❌ data.json EMPTY");
            return { students: [], staff: [], applicants: [] };
        }

        return JSON.parse(raw);

    } catch (err) {
        console.error("❌ ERROR reading data.json:", err);
        return { students: [], staff: [], applicants: [] };
    }
};

const saveData = (data) => {
    try {
        fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 4));
    } catch (err) {
        console.error("❌ ERROR writing data.json:", err);
    }
};

// ================= AUTH =================

app.post('/api/login', (req, res) => {
    try {
        const { registerNumber, password, type } = req.body;
        const { students, staff } = getData();

        if (type === 'Staff') {
            const member = staff?.find(
                s => s.id.toLowerCase() === registerNumber.toLowerCase() && s.password === password
            );

            if (member) {
                return res.json({ success: true, id: member.id, name: member.name, role: 'staff' });
            }
        } else {
            const student = students.find(
                s => s.id.toLowerCase() === registerNumber.toLowerCase() && s.password === password
            );

            if (student) {
                return res.json({ success: true, studentId: student.id, name: student.name, role: 'student' });
            }
        }

        res.status(401).json({ success: false, message: 'Invalid credentials' });

    } catch (err) {
        console.error("LOGIN ERROR:", err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// ================= APPLICANTS =================

app.post('/api/applicant/register', (req, res) => {
    try {
        const applicantData = req.body;
        const data = getData();

        if (data.applicants.find(a => a.username.toLowerCase() === applicantData.username.toLowerCase())) {
            return res.status(400).json({ success: false, message: 'Username already registered' });
        }

        data.applicants.push(applicantData);
        saveData(data);

        res.json({ success: true, message: 'Registration successful' });

    } catch (err) {
        console.error("REGISTER ERROR:", err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.post('/api/applicant/login', (req, res) => {
    try {
        const { username, password } = req.body;
        const { applicants } = getData();

        const applicant = applicants.find(
            a => a.username.toLowerCase() === username.toLowerCase() && a.password === password
        );

        if (applicant) {
            return res.json({ success: true, name: applicant.name, role: 'applicant' });
        }

        res.status(401).json({ success: false, message: 'Invalid username or password' });

    } catch (err) {
        console.error("APPLICANT LOGIN ERROR:", err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// ================= STUDENT =================

app.get('/api/student/:id/leaves', (req, res) => {
    try {
        const studentId = req.params.id;
        const { students } = getData();

        const student = students.find(
            s => s.id.toLowerCase() === studentId.toLowerCase()
        );

        if (student) {
            return res.json(student.leaves || []);
        }

        res.status(404).json({ message: 'Student not found' });

    } catch (err) {
        console.error("GET LEAVES ERROR:", err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/student/:id/apply-leave', (req, res) => {
    try {
        const studentId = req.params.id;
        const leaveData = req.body;
        const data = getData();

        const studentIndex = data.students.findIndex(
            s => s.id.toLowerCase() === studentId.toLowerCase()
        );

        if (studentIndex > -1) {
            if (!data.students[studentIndex].leaves) {
                data.students[studentIndex].leaves = [];
            }

            const newLeave = {
                id: Date.now(),
                ...leaveData,
                status: 'Pending',
                submittedAt: new Date().toISOString()
            };

            data.students[studentIndex].leaves.push(newLeave);
            saveData(data);

            return res.json({ success: true, leave: newLeave });
        }

        res.status(404).json({ message: 'Student not found' });

    } catch (err) {
        console.error("APPLY LEAVE ERROR:", err);
        res.status(500).json({ message: 'Server error' });
    }
});

// ================= SERVER START =================

const PORT = process.env.PORT || 5001;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server running on port ${PORT}`);
});