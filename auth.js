// Auth helper module (compat mode)
async function registerStudent({name,email,password,dept}) {
  const cred = await firebase.auth().createUserWithEmailAndPassword(email,password);
  const uid = cred.user.uid;
  // create user profile with approved=false
  await firebase.firestore().collection('users').doc(uid).set({
    name, email, role: 'student', dept: dept||'', approved: false, createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  await logAction(uid, 'register', {name, email});
  console.log('Registered', uid);
}

async function loginUser({email,password}) {
  const cred = await firebase.auth().signInWithEmailAndPassword(email,password);
  const uid = cred.user.uid;
  const profile = await getUserProfile(uid);
  await logAction(uid,'login', {role: profile ? profile.role : 'unknown'});
  // redirect based on role
  if(profile.role === 'admin') location.href='admin.html';
  else if(profile.role === 'teacher') location.href='teacher.html';
  else if(profile.role === 'student') location.href='student.html';
  else {
    alert('Role not set or unknown. Contact admin.');
    firebase.auth().signOut();
  }
}

async function getUserProfile(uid) {
  const doc = await firebase.firestore().collection('users').doc(uid).get();
  return doc.exists ? doc.data() : null;
}

async function logout() {
  const user = firebase.auth().currentUser;
  if(user) await logAction(user.uid, 'logout', {});
  await firebase.auth().signOut();
  location.href = 'login.html';
}
