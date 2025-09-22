
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
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(?:gmail\.com|hotmail\.com|outlook\.com|yahoo\.com)$/;

    if (!emailRegex.test(email)) {
        alert("Por favor ingrese un email válido (gmail, hotmail, outlook o yahoo).");
        return;
    }
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
   
        const user = userCredential.user;
        await updateProfile(user, { displayName: nombre + " " + apellido });
        console.log("Usuario creado:", userCredential.user);
        alert("Registro exitoso: " + userCredential.user.displayName);
    } catch (error) {
        manejoErrores(error);
    }
}

// Iniciar sesión
window.ingresar = async function () {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Regex para validar emails comunes de forma segura
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(?:gmail\.com|hotmail\.com|outlook\.com|yahoo\.com)$/;

    if (!emailRegex.test(email)) {
        alert("Por favor ingrese un email válido (gmail, hotmail, outlook o yahoo).");
        return;
    }
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        console.log("Logueado:", userCredential.user);
        alert("Bienvenido: " + userCredential.user.displayName);
        window.location.href = "http://192.168.100.112:5500/index.html";
    } catch (error) {
        manejoErrores(error);
    }
}

// Cerrar sesión
window.logout = async function () {
    await signOut(auth);
}

window.goBack = async function () {
    var button = document.getElementById("login_register_btn");
    if (button.innerHTML == "Registrar") {
        button.innerHTML = "Ingresar";
        document.getElementById("name").style.display = "none";
        document.getElementById("surname").style.display = "none";
         document.getElementById("telefono").style.display = "none";
        document.getElementById("dni").style.display = "none";
        document.getElementById("register_tip").style.display = "block";
    } else {
        window.location.href = "http://192.168.100.112:5500/index.html";
    }
}

window.logToReg = async function () {
    document.getElementById("login_register_btn").innerHTML = "Registrar";
    document.getElementById("titulo").innerHTML = "Creá tu cuenta";
    
    document.getElementById("login_register_btn").addEventListener("click", registrar);

    document.getElementById("name").style.display = "block";
    document.getElementById("surname").style.display = "block";
     document.getElementById("telefono").style.display = "block";
    document.getElementById("dni").style.display = "block";
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

function manejoErrores(error) {
    const email = document.getElementById("email");
    const password = document.getElementById("password");

    var mensaje = "";
    switch (error.code) {
        case "auth/invalid-credential":
            mensaje = "El correo o la contraseña no son correctos.";
            email.style.color = "red";
            email.style.boxShadow.color = "0px 0px 0px 1px red";
            password.style.color = "red";
            password.style.boxShadow = "0px 0px 0px 1px red";
            break;
        case "auth/email-already-in-use":
            mensaje = "El correo ya está registrado.";
            email.style.color = "red";
            email.style.boxShadow = "0px 0px 0px 1px red";
            break;
        case "auth/invalid-email":
            mensaje = "El correo no es válido.";
            email.style.color = "red";
            email.style.boxShadow = "0px 0px 0px 1px red";
            break;
        case "auth/weak-password":
            mensaje = "La contraseña debe tener al menos 6 caracteres.";
            password.style.color = "red";
            password.style.boxShadow = "0px 0px 0px 1px red";
            break;
        case "auth/user-not-found":
            mensaje = "No existe un usuario con ese correo.";
            break;
        case "auth/wrong-password":
            mensaje = "La contraseña es incorrecta.";
            password.style.color = "red";
            password.style.boxShadow = "0px 0px 0px 1px red";
            break;
        default:
            mensaje = error.message; // fallback para depurar
            break;
    }
    alert("Error: " + mensaje);
}

window.revertirColor = async function (id) {
    document.getElementById(id).style.color = "black";
    document.getElementById(id).style.boxShadow = "0px 0px 0px 1px gray";
}
window.onload = function () {
    cantCompras();
};

window.cantCompras = async function () {
    var articulos = document.getElementsByClassName("articulo");
    console.log(articulos.length);
    var cantcompras = document.getElementById("cantCompras");
    cantCompras.innerHTML = articulos.length;
    cantcompras.textContent = articulos.length;
}

