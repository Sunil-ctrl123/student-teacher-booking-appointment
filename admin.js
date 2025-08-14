// Admin client logic
firebase.auth().onAuthStateChanged(async user=>{
  if(!user) return location.href='login.html';
  const prof = await getUserProfile(user.uid);
  if(!prof || prof.role!=='admin') { alert('Not an admin'); firebase.auth().signOut(); location.href='login.html'; return; }
  // load teachers and pending students
  const tlist = await listTeachers();
  const ul = document.getElementById('teachersList');
  ul.innerHTML='';
  tlist.forEach(t=>{
    const li = document.createElement('li');
    li.textContent = `${t.name} - ${t.subject||''} (${t.dept||''})`;
    const del = document.createElement('button'); del.textContent='Delete';
    del.onclick = async ()=> {
      await firebase.firestore().collection('teachers').doc(t.id).delete();
      await logAction(user.uid,'deleteTeacher',{id:t.id});
      li.remove();
    };
    li.appendChild(del);
    ul.appendChild(li);
  });

  const pending = await firebase.firestore().collection('users').where('approved','==',false).get();
  const pu = document.getElementById('pendingStudents');
  pending.forEach(d=>{
    const data = d.data();
    const li = document.createElement('li');
    li.textContent = `${data.name} (${data.email})`;
    const app = document.createElement('button'); app.textContent='Approve';
    app.onclick = async ()=>{
      await firebase.firestore().collection('users').doc(d.id).update({approved:true});
      await logAction(user.uid,'approveStudent',{id:d.id});
      li.remove();
    };
    li.appendChild(app);
    pu.appendChild(li);
  });

  const appts = await firebase.firestore().collection('appointments').get();
  const aa = document.getElementById('allAppointments');
  appts.forEach(d=>{
    const a = d.data();
    const li = document.createElement('li');
    li.textContent = `${a.studentUid} -> ${a.teacherUid} at ${a.datetime} [${a.status}]`;
    aa.appendChild(li);
  });
});

document.getElementById('addTeacherForm').addEventListener('submit', async (e)=>{
  e.preventDefault();
  const name = document.getElementById('tname').value;
  const dept = document.getElementById('tdept').value;
  const subject = document.getElementById('tsub').value;
  await addTeacher({name, dept, subject});
  alert('Teacher added. Reload to see the list.');
});
