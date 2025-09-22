import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
 
const firebaseConfig = {
    apiKey: "AIzaSyDOFuZKYbSMCHe3-l_JDkGQUSk_c469XQM",
    authDomain: "fg4x4-5669e.firebaseapp.com",
    projectId: "fg4x4-5669e",
    storageBucket: "fg4x4-5669e.firebasestorage.app",
    messagingSenderId: "540558630585",
    appId: "1:540558630585:web:94d75012ab66807e674568",
    measurementId: "G-T1YP9FYM36"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
 
async function agregarProducto(productoID, nombre, precio, stock, imagen) {
  await setDoc(doc(db, "productos", productoID), { nombre, precio, stock, imagen });
  console.log("Producto agregado:", nombre);
}
    
async function agregarAlCarrito(usuarioID, productoID, cantidad) {
  const userRef = doc(db, "usuarios", usuarioID);
  await updateDoc(userRef, {
    carrito: arrayUnion({ productoID, cantidad })
  });
  console.log("Producto agregado al carrito:", productoID);
}
 
async function registrarCompra(usuarioID, productoID, cantidad) {
  const userRef = doc(db, "usuarios", usuarioID);
  await updateDoc(userRef, {
    compras: arrayUnion({ productoID, cantidad, fecha: new Date() })
  });
 
  const prodRef = doc(db, "productos", productoID);
  const prodSnap = await getDoc(prodRef);
  const stockActual = prodSnap.data().stock;
  await updateDoc(prodRef, { stock: stockActual - cantidad });

  console.log("Compra registrada:", productoID);
}
