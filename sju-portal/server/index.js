const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

// Request Logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} [${req.method}] ${req.url}`);
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    next();
});

app.get('/api/ping', (req, res) => {
    res.json({ success: true, message: 'pong' });
});

// Error handling for malformed JSON
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error('JSON Syntax Error:', err.message);
        return res.status(400).send({ success: false, message: 'Invalid JSON format' });
    }
    next();
});

const getData = () => {
    const data = fs.readFileSync(path.join(__dirname, 'data.json'), 'utf8');
    return JSON.parse(data);
};

app.post('/api/login', (req, res) => {
    const { registerNumber, password, type } = req.body;
    const { students, staff } = getData();

    if (type === 'Staff') {
        const member = staff?.find(s => s.id === registerNumber && s.password === password);
        if (member) {
            res.json({ success: true, id: member.id, name: member.name, role: 'staff' });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } else {
        const student = students.find(s => s.id === registerNumber && s.password === password);
        if (student) {
            res.json({ success: true, studentId: student.id, name: student.name, role: 'student' });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    }
});

// Applicant Endpoints
app.post('/api/applicant/register', (req, res) => {
    const applicantData = req.body;
    const data = getData();

    // Simple duplicate check
    if (data.applicants.find(a => a.username === applicantData.username)) {
        return res.status(400).json({ success: false, message: 'Username already registered' });
    }

    data.applicants.push(applicantData);
    fs.writeFileSync(path.join(__dirname, 'data.json'), JSON.stringify(data, null, 4));
    res.json({ success: true, message: 'Registration successful' });
});

app.post('/api/applicant/login', (req, res) => {
    const { username, password } = req.body;
    const { applicants } = getData();

    const applicant = applicants.find(a => a.username === username && a.password === password);
    if (applicant) {
        res.json({ success: true, name: applicant.name, role: 'applicant' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
});

app.get('/api/student/:id/leaves', (req, res) => {
    const studentId = req.params.id;
    const { students } = getData();
    const student = students.find(s => s.id === studentId);
    if (student) {
        res.json(student.leaves || []);
    } else {
        res.status(404).json({ message: 'Student not found' });
    }
});

app.post('/api/student/:id/apply-leave', (req, res) => {
    const studentId = req.params.id;
    const leaveData = req.body;
    const data = getData();
    const studentIndex = data.students.findIndex(s => s.id === studentId);

    if (studentIndex > -1) {
        if (!data.students[studentIndex].leaves) {
            data.students[studentIndex].leaves = [];
        }

        // Add new leave with unique ID and status
        const newLeave = {
            id: Date.now(),
            ...leaveData,
            status: 'Pending',
            submittedAt: new Date().toISOString()
        };

        data.students[studentIndex].leaves.push(newLeave);
        fs.writeFileSync(path.join(__dirname, 'data.json'), JSON.stringify(data, null, 4));
        res.json({ success: true, leave: newLeave });
    } else {
        res.status(404).json({ message: 'Student not found' });
    }
});

app.get('/api/student/:id', (req, res) => {
    const studentId = req.params.id;
    const { students } = getData();
    const student = students.find(s => s.id === studentId);
    if (student) {
        res.json(student);
    } else {
        res.status(404).json({ message: 'Student not found' });
    }
});

app.post('/api/student/mark-attendance', (req, res) => {
    const { studentId, courseTitle, status, semester } = req.body;
    const data = getData();
    const studentIndex = data.students.findIndex(s => s.id === studentId);

    if (studentIndex > -1) {
        const student = data.students[studentIndex];
        const semKey = semester.toLowerCase().replace(' ', ''); // e.g. "Sem 6" -> "sem6"

        if (student.attendance && student.attendance[semKey]) {
            const rows = student.attendance[semKey].rows;
            // Find the course row. We need to match it carefully.
            // sruthiCourses titles are like "CADE 6423 - Mobile Application Development"
            // data.json rows labels are like "Mobile Application Development CADE 6423"
            // Let's try to match by partial string or include both.

            const rowIndex = rows.findIndex(row => {
                const label = row[0].toLowerCase();
                const search = courseTitle.toLowerCase();
                // Extract subject code if possible (e.g. CA 6P1 or CADE 6423)
                const codeMatch = search.match(/[a-z]+\s+\d+[a-z]?\d*/);
                if (codeMatch && label.includes(codeMatch[0])) return true;

                return label.includes(search) || search.includes(label);
            });

            if (rowIndex > -1) {
                if (status === 'present') {
                    rows[rowIndex][1] += 1; // Total Hours (TH)
                    rows[rowIndex][2] += 1; // Attended Hours (AH)
                } else if (status === 'absent') {
                    rows[rowIndex][1] += 1; // Total Hours (TH) increases
                    // AH remains the same (student was absent)

                    // Add notification
                    if (!student.notifications) student.notifications = [];
                    student.notifications.push({
                        id: Date.now(),
                        type: 'attendance',
                        message: `You were marked ABSENT for ${courseTitle}.`,
                        status: 'Absent',
                        timestamp: new Date().toISOString()
                    });
                }

                fs.writeFileSync(path.join(__dirname, 'data.json'), JSON.stringify(data, null, 4));
                res.json({ success: true, updatedAttendance: rows[rowIndex] });
            } else {
                res.status(404).json({ success: false, message: 'Course not found in student record' });
            }
        } else {
            res.status(404).json({ success: false, message: 'Semester not found' });
        }
    } else {
        res.status(404).json({ success: false, message: 'Student not found' });
    }
});

app.get('/api/staff/student-leaves', (req, res) => {
    const { students } = getData();
    const allLeaves = [];

    students.forEach(student => {
        if (student.leaves && student.leaves.length > 0) {
            student.leaves.forEach(leave => {
                allLeaves.push({
                    studentId: student.id,
                    studentName: student.name,
                    ...leave
                });
            });
        }
    });

    res.json(allLeaves);
});

app.post('/api/staff/update-leave-status', (req, res) => {
    const { studentId, leaveId, status, verifiedBy } = req.body;
    const data = getData();
    const studentIndex = data.students.findIndex(s => s.id === studentId);

    if (studentIndex > -1) {
        const leaveIndex = data.students[studentIndex].leaves.findIndex(l => l.id === leaveId);
        if (leaveIndex > -1) {
            data.students[studentIndex].leaves[leaveIndex].status = status;
            data.students[studentIndex].leaves[leaveIndex].verifiedBy = verifiedBy;
            data.students[studentIndex].leaves[leaveIndex].verifiedAt = new Date().toLocaleString();

            // Add notification
            const student = data.students[studentIndex];
            const leave = student.leaves[leaveIndex];
            if (!student.notifications) student.notifications = [];
            student.notifications.push({
                id: Date.now(),
                type: 'leave',
                message: `Your ${leave.type} leave application has been ${status.toUpperCase()}.`,
                status: status,
                timestamp: new Date().toISOString()
            });

            fs.writeFileSync(path.join(__dirname, 'data.json'), JSON.stringify(data, null, 4));
            res.json({ success: true, message: `Leave ${status}` });
        } else {
            res.status(404).json({ success: false, message: 'Student not found' });
        }
    } else {
        res.status(404).json({ success: false, message: 'Student not found' });
    }
});

app.post('/api/staff/update-attendance-status', (req, res) => {
    const { studentId, leaveId, status, approvedSubjects, rejectedSubjects, verifiedBy } = req.body;
    const data = getData();
    const studentIndex = data.students.findIndex(s => s.id === studentId);

    if (studentIndex > -1) {
        const leaveIndex = data.students[studentIndex].leaves.findIndex(l => l.id === leaveId);
        if (leaveIndex > -1) {
            data.students[studentIndex].leaves[leaveIndex].attendanceStatus = status;
            data.students[studentIndex].leaves[leaveIndex].approvedSubjects = approvedSubjects;
            data.students[studentIndex].leaves[leaveIndex].rejectedSubjects = rejectedSubjects;
            data.students[studentIndex].leaves[leaveIndex].attendanceVerifiedBy = verifiedBy;
            data.students[studentIndex].leaves[leaveIndex].attendanceVerifiedAt = new Date().toLocaleString('en-US', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });

            fs.writeFileSync(path.join(__dirname, 'data.json'), JSON.stringify(data, null, 4));
            res.json({ success: true, message: `Attendance ${status}` });
        } else {
            res.status(404).json({ success: false, message: 'Leave not found' });
        }
    } else {
        res.status(404).json({ success: false, message: 'Student not found' });
    }
});

app.post('/api/student/save-internal-marks', (req, res) => {
    try {
        const { marks, courseTitle } = req.body; // Array of { id, cia1, cia2, midSem, total } and common courseTitle
        console.log('Saving marks for course:', courseTitle);
        // console.log('Marks data:', JSON.stringify(marks));

        const data = getData();

        marks.forEach(mark => {
            const studentIndex = data.students.findIndex(s => s.id.toLowerCase() === mark.id.toLowerCase());
            if (studentIndex > -1) {
                if (!data.students[studentIndex].internalMarks) {
                    data.students[studentIndex].internalMarks = {};
                }
                if (!data.students[studentIndex].internalMarks['sem6']) {
                    data.students[studentIndex].internalMarks['sem6'] = {};
                }
                data.students[studentIndex].internalMarks['sem6'][courseTitle] = {
                    cia1: Number(mark.cia1),
                    cia2: Number(mark.cia2),
                    midSem: Number(mark.midSem),
                    total: Number(mark.total)
                };
            }
        });

        fs.writeFileSync(path.join(__dirname, 'data.json'), JSON.stringify(data, null, 4));
        res.json({ success: true, message: 'Marks updated successfully' });
    } catch (error) {
        console.error('Error in save-internal-marks:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get('/api/student/:id/internal-marks', (req, res) => {
    const studentId = req.params.id;
    const { students } = getData();
    const student = students.find(s => s.id === studentId);
    if (student) {
        res.json(student.internalMarks || {});
    } else {
        res.status(404).json({ message: 'Student not found' });
    }
});

app.get('/api/staff/marks/:courseTitle', (req, res) => {
    const courseTitle = req.params.courseTitle;
    const { students } = getData();
    const results = {};
    students.forEach(s => {
        if (s.internalMarks && s.internalMarks['sem6'] && s.internalMarks['sem6'][courseTitle]) {
            results[s.id] = s.internalMarks['sem6'][courseTitle];
        }
    });
    res.json(results);
});

app.listen(PORT, '127.0.0.1', () => {
    console.log('Server running at http://127.0.0.1:' + PORT);
});
