//  CONFIG FIREBASE 
const firebaseConfig = {
    apiKey: "AIzaSyD8idKcs3eVYib-u9PsW3R61ZRa4EuPfdU",
    authDomain: "knight-55f33.firebaseapp.com",
    databaseURL: "https://knight-55f33-default-rtdb.firebaseio.com",
    projectId: "knight-55f33",
    storageBucket: "knight-55f33.appspot.com",
    messagingSenderId: "733374738664",
    appId: "1:733374738664:web:245d016182d96145c4995d",
    measurementId: "G-HCPPZTK4RB"
  };

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.database();

let currentUser = null;
let currentChat = null;

//  LOGIN
function login(){
  auth.signInWithEmailAndPassword(
    email.value,
    pass.value
  );
}

//  REGISTRO
function register(){
  auth.createUserWithEmailAndPassword(
    email.value,
    pass.value
  );
}

//  quando loga
auth.onAuthStateChanged(user => {
  if(user){
    currentUser = user;

    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("app").style.display = "flex";

    loadUsers();
  }
});

//  carregar usuários
function loadUsers(){
  db.ref("users").on("value", snap => {
    users.innerHTML = "";

    snap.forEach(u => {
      if(u.key !== currentUser.uid){
        let div = document.createElement("div");
        div.classList.add("user");
        div.innerText = u.val().email;

        div.onclick = () => openChat(u.key);

        users.appendChild(div);
      }
    });
  });

  // salvar usuário atual
  db.ref("users/" + currentUser.uid).set({
    email: currentUser.email
  });
}

//  abrir chat
function openChat(uid){
  currentChat = [currentUser.uid, uid].sort().join("_");

  chat.innerHTML = "";

  db.ref("chats/" + currentChat).on("child_added", snap => {
    let d = document.createElement("div");
    d.classList.add("msg");
    d.innerText = snap.val().text;

    chat.appendChild(d);
  });
}

//  enviar msg
function sendMsg(){
  let input = document.getElementById("msg");

  if(input.value.trim() !== ""){
    db.ref("chats/" + currentChat).push({
      text: input.value,
      from: currentUser.uid
    });

    input.value = "";
  }
}
