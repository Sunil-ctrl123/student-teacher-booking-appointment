# Student-Teacher Booking Appointment (Web)

**Technologies:** HTML, CSS, JavaScript, Firebase (Authentication + Firestore + Hosting)

## Features
- User registration (students) and login (students, teachers, admin)
- Admin: add/update/delete teachers, approve student registrations, view all appointments
- Teacher: view appointments, approve/cancel, message students
- Student: search teachers, book appointment, send message
- Logging: every important action is recorded to `logs` collection in Firestore
- Modular JavaScript with separate modules for auth, db operations, and admin/teacher/student logic

## Setup
1. Create a Firebase project at https://console.firebase.google.com/
2. Enable **Authentication** (Email/Password).
3. Create a **Firestore** database in production or test mode.
4. Copy your Firebase config into `js/firebaseConfig.js` (see placeholder).
5. Deploy files to Firebase Hosting or run locally with a static server.

## Firestore structure (recommended)
- users (uid documents) { name, role: "student"|"teacher"|"admin", dept, approved }
- teachers (auto id or uid) { name, dept, subject, uid }
- appointments (auto id) { studentUid, teacherUid, datetime, status }
- messages (auto id) { fromUid, toUid, text, createdAt }
- logs (auto id) { uid, action, details, ts }

## Important files
- `index.html` - landing page
- `register.html`, `login.html` - auth pages
- `admin.html`, `teacher.html`, `student.html` - dashboards
- `js/firebaseConfig.js` - **REPLACE** with your firebase config
- `js/auth.js` - authentication related functions
- `js/db.js` - Firestore operations + logging helper

## Testing
- Create test accounts for admin/teacher/student.
- Use Firestore console to verify collections and logs.

## Notes on Security & Production
- Update Firestore rules to restrict read/write by role.
- Do not commit `firebaseConfig` with private keys in public repos; use environment or hosting config.
- Logging currently writes a `logs` document; consider retention or export policies for production.

