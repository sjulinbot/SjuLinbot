import json
import os

data_path = r'c:\Users\sreelaya\OneDrive\Documents\project\sju-portal\server\data.json'

with open(data_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Clear leaves and notifications for all students
if 'students' in data:
    for student in data['students']:
        if 'leaves' in student:
            student['leaves'] = []
        if 'notifications' in student:
            student['notifications'] = [] # Use # for comments in Python

with open(data_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=4)

print("Cleared all leave-related data (leaves and notifications) for all students.")
