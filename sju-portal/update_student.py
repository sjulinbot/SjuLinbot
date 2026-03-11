import json
import os

with open('server/data.json', 'r') as f:
    data = json.load(f)

new_student = {
    'id': '233bcac26',
    'password': '233bcac26',
    'name': 'Johnson Akash A',
    'fees': [
        {
            'id': 1,
            'semester': 'S1',
            'totalFee': 135000,
            'remittedFee': 135000,
            'pendingFine': 0,
            'fineRemitted': 0,
            'balanceFee': 0,
            'action': 'Pay',
            'isPaid': True
        },
        {
            'id': 2,
            'semester': 'S3',
            'totalFee': 125000,
            'remittedFee': 125000,
            'pendingFine': 0,
            'fineRemitted': 0,
            'balanceFee': 0,
            'action': 'Pay',
            'isPaid': True
        },
        {
            'id': 3,
            'semester': 'S5',
            'totalFee': 115000,
            'remittedFee': 115000,
            'pendingFine': 0,
            'fineRemitted': 0,
            'balanceFee': 0,
            'action': 'Pay',
            'isPaid': True
        }
    ],
    'result': {
        'S1': { 
            'name': 'FIRST', 'date': 'OCTOBER 2023',
            'courses': [
                ['GE 121', 'General English-', 3, 100, 53, 'B', 5.5],
                ['ΚΑ 122', 'Kannada', 3, 100, 56, 'B', 6.0],
                ['CA 1121', 'Fundamentals of Computers', 3, 100, 37, 'F', 0.0],
                ['CA 1P1', 'INFORMATION TECHNOLOGY LAB', 2, 50, 27, 'B', 5.5],
                ['CA 1221', 'Programming In C', 3, 100, 45, 'C', 5.0],
                ['CA 1P2', 'C PROGRAMMING LAB', 2, 50, 32, 'A', 6.5],
                ['CA 1321', 'Mathematical Foundations', 3, 100, 49, 'C', 5.0],
                ['HSOE 1', 'Tourism in Karnataka', 3, 100, 46, 'C', 5.0],
                ['AECC ES', 'Environmental Studies', 2, 50, 16, 'F', 0.0],
                ['IG1', 'IGNITORS-I', 2, '-', '-', 'S', '-']
            ],
            'summary': { 'result': 'REPEAT', 'perc': '48.4', 'grade': 'F', 'sgpa': '4.31' }
        },
        'S2': {
            'name': 'SECOND', 'date': 'APRIL 2024',
            'courses': [
                ['GE 221', 'General English', 3, 100, 52, 'B', 5.5],
                ['ΚΑ 222', 'KANNADA', 3, 100, '-', 'A+', 7.5],
                ['CA 2121', 'Data Structures Using C', 3, 100, 40, 'C', 4.5],
                ['CA 2P1', 'DATA STRUCTURES LAB', 2, 50, 38, 'A+', 8.0],
                ['CA 2221', 'Object Oriented Concepts using JAVA', 3, 100, 29, 'F', 0.0],
                ['CA 2P2', 'Java Lab', 2, 50, 38, 'A+', 8.0],
                ['CA 2321', 'Discrete Mathematical Structures', 3, 100, 31, 'F', 0.0],
                ['JNOE 2', 'Food And Digital Storytelling Skills', 3, 100, 62, 'A', 6.5],
                ['SEC DF', 'Digital Fluency', 2, 50, 34, 'A', 7.0],
                ['SECCT 2', 'Creative Thinking', 2, '-', '-', 'S', '-']
            ],
            'summary': { 'result': 'RESULT NOT COMPLETED', 'perc': '52.8', 'grade': 'F', 'sgpa': '4.92' }
        },
        'S3': {
            'name': 'THIRD', 'date': 'OCTOBER 2024',
            'courses': [
                ['CA 3322', 'Computer Communication and Networks', 3, 100, 40, 'C', 4.5],
                ['CA 3222', 'C# and Dotnet Framework', 3, 100, 41, 'C', 4.5],
                ['CA 3P1', 'DBMS Lab', 2, 50, 43, 'A++', 9.0],
                ['ΚΑ 322', 'Kannada', 3, 100, 64, 'A', 6.5],
                ['CA 3122', 'Database Management Systems', 3, 100, 55, 'B+', 6.0],
                ['GE 322', 'General English III', 3, 100, 52, 'B', 5.5],
                ['CA 3P2', 'C# and Dotnet Framework Lab', 2, 50, 43, 'A++', 9.0],
                ['JNICE 3', 'True Crime Coverage', 3, 100, 57, 'B+', 6.0],
                ['SECARI', 'Artificial Intelligence', 2, 50, 23, 'B', 5.0],
                ['IG-1', 'IGNITORS-III', 2, '-', '-', 'S', '-']
            ],
            'summary': { 'result': 'HIGH SECOND CLASS', 'perc': '55.73', 'grade': 'B+', 'sgpa': '6.04' }
        },
        'S4': {
            'name': 'FOURTH', 'date': 'APRIL 2025',
            'courses': [
                ['KANOE 4', 'TOURISM', 3, 100, 64, 'A', 6.5],
                ['CA 4122', 'Python Programming', 3, 100, 54, 'B', 5.5],
                ['GE 422', 'General English', 3, 100, 54, 'B', 5.5],
                ['CA 4222', 'Computer Multimedia And Animation', 3, 100, 44, 'C', 4.5],
                ['ΚΑ 422', 'Kannada', 3, 100, 68, 'A', 7.0],
                ['CA 4322', 'Operating System Concepts', 3, 100, 41, 'C', 4.5],
                ['CA 4P124', 'Python Programming Lab', 2, 50, 35, 'A+', 7.5],
                ['CA 4P224', 'Multimedia and Animation Lab', 2, 50, 41, 'A++', 8.5],
                ['AECC IC', 'Constitution of India', 2, 50, 21, 'C', 4.5]
            ],
            'summary': { 'result': 'HIGH SECOND CLASS', 'perc': '56.27', 'grade': 'B+', 'sgpa': '5.90' }
        },
        'S5': {
            'name': 'FIFTH', 'date': 'OCTOBER 2025',
            'courses': [
                ['CA 5123', 'E-Commerce', 3, 100, 54, 'B', 5.5],
                ['CA 5223', 'Internet Technologies', 3, 100, 62, 'A', 6.5],
                ['CA 5323', 'Cyberlaw and Cybersecurity', 3, 100, 63, 'A', 6.5],
                ['CADE 5423', 'Cloud Computing', 3, 100, 75, 'A+', 8.0],
                ['CAVO 1', 'AWS Cloud Practitioner', 3, 100, 92, 'O', 9.5],
                ['CA 5P1', 'Internet Technologies Lab', 2, 50, 41, 'A++', 8.5],
                ['CA 5P2', 'Cyber Security Lab', 2, 50, 42, 'A++', 8.5],
                ['SEC CS', 'Cyber Security', 2, 50, 25, 'B', 5.0]
            ],
            'summary': { 'result': 'FIRST CLASS', 'perc': '65.38', 'grade': 'A', 'sgpa': '6.90' }
        }
    },
    'attendance': {
        'sem1': {
            'text': 'Using attendance rule from 2023-07-18 to 2023-11-30',
            'rows': [
                ['IGNITORS(IG)', 6, 6],
                ['Fundamentals of Computers (CA 1121)', 37, 31],
                ['Programming in C (CA 1221)', 38, 33],
                ['Mathematical Foundations (CA 1323)', 36, 33],
                ['Information Technology Lab (CA IP1)', 15, 15],
                ['C Programming Lab (CA 1P2)', 14, 14],
                ['Tourrism in Karnataka (HSOE1)', 33, 29],
                ['Kannada (KA 222)', 37, 35],
                ['General English I (GE 121)', 32, 32]
            ]
        },
        'sem2': {
            'text': 'Using attendance rule from 2024-01-02 to 2024-05-09',
            'rows': [
                ['Insta Thrills:Food and digital storytelling skills (JNOE 2)', 36, 34],
                ['Data Structures Using C (CA 2121)', 42, 39],
                ['Object Oriented Concepts using JAVA (CA 2221)', 45, 44],
                ['Discrete Mathematical Structures (CA 2321)', 41, 38],
                ['Data Structures LAB (CA 2P1)', 19, 19],
                ['Java Lab (CA 2P2)', 14, 14],
                ['Kannada (KA 222)', 37, 35],
                ['THEOLOGY/HRD (TH-HRD UG)', 10, 10],
                ['General English (GE 221)', 39, 35]
            ]
        },
        'sem3': {
            'text': 'Using attendance rule from 08-07-2024 to 29-10-2024',
            'rows': [
                ['Kannada (KA 222)', 37, 35],
                ['Financial Health and Wellbeing (BCOE 7)', 33, 28],
                ['Database Management Systems (CA 3122)', 40, 34],
                ['C# and Dotnet Framework (CA 3222)', 41, 36],
                ['Computer Communication and Networks (CA 3322)', 45, 35],
                ['DBMS Lab (CA 3P1)', 18, 16],
                ['C# and Dotnet Framework Lab (CA 3P2)', 19, 17],
                ['General English (GE 322)', 34, 27],
                ['IGNITORS (IG-II)', 6, 6],
                ['Artificial Intelligence (SEG AR1)', 0, 0]
            ]
        },
        'sem4': {
            'text': 'Using attendance rule from 04-12-2024 to 30-03-2025',
            'rows': [
                ['Kannada (KA 222)', 37, 35],
                ['Constitution of India (AECCIC)', 0, 0],
                ['Python Programming (CA 4122)', 33, 31],
                ['Computer Multimedia and Animation (CA 4222)', 32, 31],
                ['Operating System Concepts (CA 4322)', 34, 34],
                ['Python Programming Lab (CA 4P124)', 20, 20],
                ['Multimedia and Animation Lab (CA 4P224)', 18, 18],
                ['General English (GE 422)', 34, 32],
                ['Civil Services (PSOE 4)', 33, 30],
                ['TERM PAPER (TP)', 0, 0]
            ]
        },
        'sem5': {
            'text': 'Using attendance rule from 23-06-2025 to 29-09-2025',
            'rows': [
                ['E-Commerce (CA 5123)', 32, 30],
                ['Internet Technologies (CA 5223)', 36, 36],
                ['Cyberlaw and Cybersecurity (CA 5323)', 36, 34],
                ['Internet Technologies Lab (CA 5P1)', 16, 14],
                ['Cyber Security Lab (CA 5P2)', 30, 30],
                ['Cloud Computing (DADE 5423)', 35, 32],
                ['Vocational 1 AWS-Cloud Practitioner (CAVO 1)', 29, 26],
                ['Cyber Security (SEC CS)', 0, 0]
            ]
        },
        'sem6': {
            'text': 'Using attendance rule from 26-11-2025 to 31-03-2026',
            'rows': [
                ['Software Engineering (CA 6123)', 15, 12],
                ['Artificial Intelligence and Applications (CA 6223)', 15, 12],
                ['Internet of things (CA 6323)', 17, 12],
                ['Mobile Applications Development Lab (CA 6P1)', 10, 8],
                ['MAJOR PROJECT LAB (CA 6P2)', 12, 10],
                ['Mobile Application Development (CADE 6423)', 12, 12],
                ['Vocational 2 Power BI (DAV 02)', 15, 13]
            ]
        }
    }
}

data['students'].append(new_student)

with open('server/data.json', 'w') as f:
    json.dump(data, f, indent=4)

print('Updated data.json successfully')
