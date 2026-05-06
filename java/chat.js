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
  const db = firebase.database();

  const chat = document.getElementById("chat");

  // receber mensagens em tempo real
  db.ref("mensagens").on("child_added", function(snapshot) {
    const data = snapshot.val();

    const div = document.createElement("div");
    div.classList.add("msg");
    div.innerText = data.text;

    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
  });

  //  enviar mensagem
  function sendMsg() {
    const input = document.getElementById("msg");

    if (input.value.trim() !== "") {
      db.ref("mensagens").push({
        text: input.value
      });

      input.value = "";
    }
  }