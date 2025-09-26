import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
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

onAuthStateChanged(window.auth, (user) => {


  fetch(archivoTxt)
    .then(response => response.text())
    .then(text => {
      const lines = text.split('\n').filter(line => line.trim() !== '');
      const container = document.getElementById('productosContainer');
      container.innerHTML = ''; // limpiar contenido previo


      lines.forEach(line => {
        let [codigo, nombreRaw, marca, unidad] = line.split(';');
        const nombre = nombreRaw.replaceAll("�", "Ñ");

        const producto = { codigo, nombre, marca, unidad };

        if (!unidad.startsWith("0")) {
          const div = document.createElement('div');
          div.classList.add('producto');

          // Código
          const pCodigo = document.createElement('p');
          const strongCodigo = document.createElement('strong');
          strongCodigo.textContent = "Código: ";
          pCodigo.appendChild(strongCodigo);
          pCodigo.appendChild(document.createTextNode(codigo));
          div.appendChild(pCodigo);

          // Nombre
          const pNombre = document.createElement('p');
          const strongNombre = document.createElement('strong');
          strongNombre.textContent = "Nombre: ";
          pNombre.appendChild(strongNombre);
          pNombre.appendChild(document.createTextNode(nombre));
          div.appendChild(pNombre);

          // Marca (opcional)
          if (marca) {
            const pMarca = document.createElement('p');
            const strongMarca = document.createElement('strong');
            strongMarca.textContent = "Marca: ";
            pMarca.appendChild(strongMarca);
            pMarca.appendChild(document.createTextNode(marca));
            div.appendChild(pMarca);
          }

          // Unidad
          const pUnidad = document.createElement('p');
          const strongUnidad = document.createElement('strong');
          strongUnidad.textContent = "Unidad: ";
          pUnidad.appendChild(strongUnidad);
          pUnidad.appendChild(document.createTextNode(unidad));
          div.appendChild(pUnidad);

          // Botón solo si hay usuario
          if (user != null) {
            const btn = document.createElement("button");
            btn.textContent = "Añadir";
            btn.addEventListener("click", () => {
              window.agregarAlCarrito(producto);
            });
            div.appendChild(btn);
          }

          container.appendChild(div);
        }
      });

    })
    .catch(err => console.error('Error al leer el archivo:', err));

});
