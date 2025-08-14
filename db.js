// DB helper functions and logging
const db = firebase.firestore();
async function logAction(uid, action, details) {
  try {
    await db.collection('logs').add({uid, action, details, ts: firebase.firestore.FieldValue.serverTimestamp()});
    console.log('Logged action', action);
  } catch(e) {
    console.error('Logging failed', e);
  }
}

// Admin: add teacher
async function addTeacher({name, dept, subject}) {
  const doc = await db.collection('teachers').add({name, dept, subject, createdAt: firebase.firestore.FieldValue.serverTimestamp()});
  await logAction('system','addTeacher',{name, dept, subject, id: doc.id});
  return doc.id;
}

async function listTeachers() {
  const snap = await db.collection('teachers').get();
  return snap.docs.map(d=>({id:d.id, ...d.data()}));
}

async function searchTeachers(query) {
  if(!query) {
    return (await db.collection('teachers').limit(20).get()).docs.map(d=>({id:d.id, uid:d.id, ...d.data()}));
  }
  // simplistic client-side filter (for demo). For production use proper indexing and queries.
  const all = await db.collection('teachers').get();
  const q = query.toLowerCase();
  return all.docs.map(d=>({id:d.id, uid:d.id, ...d.data()})).filter(t=> (t.name||'').toLowerCase().includes(q) || (t.subject||'').toLowerCase().includes(q));
}

// Book appointment (student)
async function bookAppointment({studentUid, teacherUid, datetime}) {
  const doc = await db.collection('appointments').add({
    studentUid, teacherUid, datetime, status: 'pending', createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  await logAction(studentUid,'bookAppointment',{teacherUid, datetime, id: doc.id});
  alert('Appointment requested.');
}

async function loadMyAppointments(uid) {
  const snap = await db.collection('appointments').where('studentUid','==',uid).get();
  const ul = document.getElementById('myAppointments');
  if(!ul) return;
  ul.innerHTML='';
  snap.forEach(d=>{
    const a = d.data();
    const li = document.createElement('li');
    li.textContent = `With ${a.teacherUid} at ${a.datetime} - ${a.status}`;
    ul.appendChild(li);
  });
}

async function loadTeacherAppointments(teacherUid) {
  const snap = await db.collection('appointments').where('teacherUid','==',teacherUid).get();
  const ul = document.getElementById('teacherAppointments');
  if(!ul) return;
  ul.innerHTML='';
  snap.forEach(d=>{
    const a = d.data();
    const li = document.createElement('li');
    li.textContent = `From ${a.studentUid} at ${a.datetime} - ${a.status}`;
    ul.appendChild(li);
  });
}
