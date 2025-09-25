import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
// Importar SDKs de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
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
window.auth = getAuth(app);
const archivoTxt = './stock.txt';
const productos = []; // <-- aquí acumulamos todos los productos

onAuthStateChanged(window.auth, (user) => {
  if (!user) {
    console.warn("No hay usuario logueado");
    return;
  }
  
fetch(archivoTxt)
  .then(response => response.text())
  .then(text => {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    const container = document.getElementById('productosContainer');
    container.innerHTML = ''; // limpiar contenido previo
 

    lines.forEach(line => {
      let [codigo, nombreRaw, marca, unidad] = line.split(';');

      const nombre = nombreRaw.replaceAll("�", "Ñ");

      // crear objeto producto
      const producto = { codigo, nombre, marca, unidad };
      productos.push(producto);

      if (!unidad.startsWith("0")) {
        const div = document.createElement('div');
        div.classList.add('producto');

        div.innerHTML = `
          <p><strong>Código: </strong>${codigo}</p>
          <p><strong>Nombre: </strong>${nombre}</p>
          ${marca ? `<p><strong>Marca: </strong>${marca}</p>` : ''}
          <p><strong>Unidad: </strong>${unidad}</p>
        `;

        const btn = document.createElement("button");
        btn.textContent = "Añadir";

        // acá sí tenés acceso a producto y user.uid
        btn.addEventListener("click", () => {
          window.agregarAlCarrito(user.uid, producto);
        });

        div.appendChild(btn);
        container.appendChild(div);
      }
    });
  })
  .catch(err => console.error('Error al leer el archivo:', err));

});
