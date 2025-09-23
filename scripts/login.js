
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
var logeado = false;
// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

window.onload = function () {
    cantCompras();
    cargarCarrito();
};

// Registrar usuario nuevo
window.registrar = async function () {

    const nombre = document.getElementById("name").value;
    const apellido = document.getElementById("surname").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const dni = document.getElementById("dni").value;
    const telefono = document.getElementById("telefono").value;

    const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(?:gmail\.com|hotmail\.com|outlook\.com|yahoo\.com)$/;
    const dniRegex = /^\d{7,10}$/;
    const telefonoRegex = /^\d{8,12}$/;


    if (!nameRegex.test(nombre) || nombre.length < 4) {
        manejoErrores(null, "error-nombre");
        return false;
    }

    if (!nameRegex.test(apellido) || apellido.length < 4) {
        manejoErrores(null, "error-apellido");
        return false;
    }

    if (!dniRegex.test(dni)) {
        manejoErrores(null, "error-dni");
        return false;
    }

    if (!telefonoRegex.test(telefono)) {
        manejoErrores(null, "error-telefono");
        return false;
    }
    if (!emailRegex.test(email)) {
        manejoErrores(null, "auth/invalid-email");
        return false;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        const user = userCredential.user;
        await updateProfile(user, { displayName: nombre + " " + apellido });
        console.log("Usuario creado:", userCredential.user);
        alert("Registro exitoso: " + userCredential.user.displayName);
        logeado = true;
        window.location.href = "http://192.168.100.112:5500/index.html";
    } catch (error) {
        manejoErrores(error, "");
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
        logeado = true;
        console.log("Logueado:", userCredential.user);

        alert("Bienvenido: " + userCredential.user.displayName);
        window.location.href = "http://192.168.100.112:5500/index.html";
    } catch (error) {
        manejoErrores(error);
    }
}

// Cerrar sesión
window.logout = async function () {
    var ingresarHeader = document.getElementById("user");
    ingresarHeader.href = "http://192.168.100.112:5500/register.html";
    logeado = false;
    await signOut(auth);
     window.location.href = "http://192.168.100.112:5500/index.html"; 
}

window.goBack = async function () {
    var button = document.getElementById("login_btn");
    var button_r = document.getElementById("register_btn");
    if (button.style.display == "none") {
        button.style.display = "block";
        button_r.style.display = "none";
        document.getElementById("name").style.display = "none";
        document.getElementById("surname").style.display = "none";
        document.getElementById("telefono").style.display = "none";
        document.getElementById("dni").style.display = "none";
        document.getElementById("register_tip").style.display = "block";
    } else {
        button.style.display = "none";
        button_r.style.display = "block";
        window.location.href = "http://192.168.100.112:5500/index.html";
    }
}

window.logToReg = async function () {

    document.getElementById("titulo").innerHTML = "Creá tu cuenta";

    var btn = document.getElementById("login_btn");
    var btn_r = document.getElementById("register_btn");
    btn.style.display = "none";
    btn_r.style.display = "block";

    document.getElementById("name").style.display = "block";
    document.getElementById("surname").style.display = "block";
    document.getElementById("telefono").style.display = "block";
    document.getElementById("dni").style.display = "block";
    document.getElementById("register_tip").style.display = "none";
}

// Detectar cambios de sesión
onAuthStateChanged(auth, (user) => {
    var ingresarHeader = document.getElementById("user");
    if (user) {
        var nombreapellido = user.displayName || "";
        var nombre = nombreapellido.split(" ")[0].split("")[0];
        var apellido = nombreapellido.split(" ")[1].split("")[0];
        ingresarHeader.innerHTML = nombre[0] + apellido[0];
        ingresarHeader.href = "http://192.168.100.112:5500/cuenta.html";
        console.log("usuario: " + user.displayName); 
         logeado = true;
    } else { 
        logeado = false;
        ingresarHeader.innerHTML = "Ingresar";
        ingresarHeader.href = "http://192.168.100.112:5500/register.html";
    }
});

function manejoErrores(error, errStr) {
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const nombre = document.getElementById("name");
    const apellido = document.getElementById("surname");
    const telefono = document.getElementById("telefono");
    const dni = document.getElementById("dni");

    var mensaje = "";
    if (error != null) {
        switch (error.code) {
            case "auth/invalid-credential":
                mensaje = "El correo o la contraseña no son correctos.";
                email.style.color = "red";
                email.style.boxShadow = "0px 0px 0px 1px red";
                password.style.color = "red";
                password.style.boxShadow = "0px 0px 0px 1px red";
                break;
            case "auth/email-already-in-use":
                mensaje = "El correo ya está registrado.";
                email.style.color = "red";
                email.style.boxShadow = "0px 0px 0px 1px red";
                break;
            case "auth/invalid-email":
                mensaje = "Por favor ingrese un email válido (gmail, hotmail, outlook o yahoo)";
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
            case "auth/missing-password":
                mensaje = "La contraseña esta vacia.";
                password.style.color = "red";
                password.style.boxShadow = "0px 0px 0px 1px red";
                break;
            default:
                mensaje = error.message; // fallback para depurar
                break;
        }
    } else {
        switch (errStr) {
            case "error-dni":
                mensaje = "El dni debe ser entre 7 y 10 digitos.";
                dni.style.color = "red";
                dni.style.boxShadow = "red 0px 0px 0px 1px";
                break;
            case "error-telefono":
                mensaje = "El telefono debe ser entre 8 y 12 dígitos.";
                telefono.style.color = "red";
                telefono.style.boxShadow = "0px 0px 0px 1px red";
                break;
            case "error-nombre":
                mensaje = "El nombre no puede contener numeros ni caracteres especiales y debe tener 4 o mas letras.";
                nombre.style.color = "red";
                nombre.style.boxShadow = "0px 0px 0px 1px red";
                break;
            case "error-apellido":
                mensaje = "El apellido no puede contener numeros ni caracteres especiales  y debe tener 4 o mas letras.";
                apellido.style.color = "red";
                apellido.style.boxShadow = "0px 0px 0px 1px red";
                break;
            case "error-telefono":
                mensaje = "El telefono no puede contener letras ni caracteres especiales.";
                telefono.style.color = "red";
                telefono.style.boxShadow = "0px 0px 0px 1px red";
                break;
            case "error-dni":
                mensaje = "El dni debe ser solo numeros.";
                dni.style.color = "red";
                dni.style.boxShadow = "0px 0px 0px 1px red";
                break;
        }
    }

    alert("Error: " + mensaje);
}

window.revertirColor = async function (id) {
    document.getElementById(id).style.color = "black";
    document.getElementById(id).style.boxShadow = "0px 0px 0px 1px gray";
}
 

window.borrarCompra = async function (n) {
    var articulo = document.getElementById("articulo-" + n);
    articulo.remove();
    cantCompras();
}

window.cantCompras = async function () {
    var articulos = document.getElementsByClassName("articulo");
    var cantcompras = document.getElementById("cantCompras");
    var compras = document.getElementById("bloque_compras");

    if (articulos.length == 0) {
        cantcompras.textContent = "";
        compras.style.display = "none";
    } else {
        compras.style.display = "block";
        cantcompras.textContent = articulos.length;
    }

}

window.mostrarArticulos = async function (productos) {
    const contenedor = document.getElementById("articulos");
    contenedor.innerHTML = ""; // Limpia antes de renderizar

    productos.forEach((producto, index) => {
        // Crear div principal
        const div = document.createElement("div");
        div.id = `articulo-${index}`;
        div.className = "articulo";

        // Nombre
        const pNombre = document.createElement("p");
        pNombre.innerHTML = `<strong>${producto.nombre}</strong>`;

        // Cantidad
        const pUnidad = document.createElement("p");
        pUnidad.innerHTML = `Cantidad: <strong>${producto.unidad}</strong>`;

        // Icono (SVG)
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("class", "icono-tacho");
        svg.setAttribute("onclick", `borrarCompra('${index}')`);
        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svg.setAttribute("viewBox", "20 50 450 500");
        svg.setAttribute("width", "30");
        svg.setAttribute("height", "30");
        svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M199 103v50h-78v30h270v-30h-78v-50H199zm18 18h78v32h-78v-32zm-79.002 80l30.106 286h175.794l30.104-286H137.998zm62.338 13.38l.64 8.98 16 224 .643 8.976-17.956 1.283-.64-8.98-16-224-.643-8.976 17.956-1.283zm111.328 0l17.955 1.284-.643 8.977-16 224-.64 8.98-17.956-1.284.643-8.977 16-224 .64-8.98zM247 215h18v242h-18V215z");

        svg.appendChild(path);

        // Agregar todo al div
        div.appendChild(pNombre);
        div.appendChild(pUnidad);
        div.appendChild(svg);

        // Insertar en el contenedor
        contenedor.appendChild(div);
    });


    await agregarProducto("p001", "Camiseta", 1500, 10, "url-imagen");
    await agregarAlCarrito("usuario123", {
        productoID: "p001",
        nombre: "Camiseta",
        precio: 1500,
        unidad: 2
    });

    async function cargarCarrito(usuarioID) {
        const userRef = doc(db, "usuarios", usuarioID);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const datos = userSnap.data();
            const carrito = datos.carrito || [];
            mostrarArticulos(carrito);
        } else {
            console.log("Usuario no encontrado");
        }
    }
}


