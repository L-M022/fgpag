
// Importar SDKs de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { updateProfile } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
// Configuración de tu proyecto (la que Firebase te dio)
const firebaseConfig = {
    apiKey: "AIzaSyDOFuZKYbSMCHe3-l_JDkGQUSk_c469XQM",
    authDomain: "fg4x4-5669e.firebaseapp.com",
    projectId: "fg4x4-5669e",
    storageBucket: "fg4x4-5669e.firebasestorage.app",
    messagingSenderId: "540558630585",
    appId: "1:540558630585:web:94d75012ab66807e674568",
    measurementId: "G-T1YP9FYM36"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// Registrar usuario nuevo
window.registrar = async function () {

    const nombre = document.getElementById("name").value;
    const apellido = document.getElementById("surname").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Asignar displayName
        const user = userCredential.user;
        await updateProfile(user, { displayName: nombre + " " + apellido });
        console.log("Usuario creado:", userCredential.user);
        alert("Registro exitoso: " + userCredential.user.displayName);
    } catch (error) {
        alert("Error: " + error.message);
    }
}

// Iniciar sesión
window.ingresar = async function () {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        console.log("Logueado:", userCredential.user);
        alert("Bienvenido: " + userCredential.user.displayName);
        window.location.href = "http://192.168.100.112:5500/index.html";
    } catch (error) {
        alert("Error: " + error.message);
    }
}

// Cerrar sesión
window.logout = async function () {
    await signOut(auth);
    alert("Sesión cerrada");
}
window.goBack = async function () {
    var button = document.getElementById("login_register_btn");
    if (button.innerHTML == "Registrar") {
        button.innerHTML = "Ingresar";
        document.getElementById("name").style.display = "none";
        document.getElementById("surname").style.display = "none";
        document.getElementById("register_tip").style.display = "block";
    } else {
        window.location.href = "http://192.168.100.112:5500/index.html";
    }
}
window.logToReg = async function () {
    document.getElementById("login_register_btn").innerHTML = "Registrar";
    document.getElementById("login_register_btn").addEventListener("click", registrar);

    document.getElementById("name").style.display = "block";
    document.getElementById("surname").style.display = "block";
    document.getElementById("register_tip").style.display = "none";
}
// Detectar cambios de sesión
onAuthStateChanged(auth, (user) => {
    if (user) {
        var nombreapellido = user.displayName || "";
        var nombre = nombreapellido.split(" ")[0].split("")[0];
        var apellido = nombreapellido.split(" ")[1].split("")[0];
        document.getElementById("user").innerHTML = nombre[0] + apellido[0];
        console.log("usuario: " + user.displayName);
    } else {
        document.getElementById("login_register_btn").innerHTML = "Ingresar";
    }
});

