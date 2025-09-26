import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
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
// Guardar en window para que otros scripts puedan usarlo
window.firebaseApp = app;
window.db = db;
// --------------------------
// Agregar producto al catálogo
// --------------------------
async function agregarProducto(productoID, nombre, precio, stock, imagen) {
  await setDoc(doc(db, "productos", productoID), {
    nombre,
    precio,
    stock,
    imagen
  });
  console.log("Producto agregado:", nombre);
}

// --------------------------
// Agregar producto al carrito (array en usuario)
// --------------------------
// window.agregarAlCarrito2 = async function (usuarioID, producto) {
//   try {
//     const userRef = doc(db, "usuarios", usuarioID);
//     await setDoc(userRef, {
//       carrito: arrayUnion(producto)
//     }, { merge: true }); // merge: true = no sobrescribe el resto del documento
//     console.log("Producto agregado al carrito:", producto.nombre);
//   } catch (error) {
//     console.error("Error agregando al carrito:", error);
//   }
// } 

window.agregarAlCarrito = async function (producto) {
  try {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (!user.emailVerified) {
      console.log("emailVerified: " + emailVerified)
      return;
    }  
    
    if (!currentUser) return;

    const uid = currentUser.uid;
    const userRef = doc(db, "usuarios", uid);

    // Verificar si el documento existe
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      // Crear documento inicial
      await setDoc(userRef, {
        dni: "",
        telefono: "",
        carrito: [producto],
        compras: []
      });
      console.log("Documento creado y producto agregado al carrito:", producto.nombre);
    } else {
      // Actualizar carrito
      await updateDoc(userRef, { carrito: arrayUnion(producto) });
      console.log("Producto agregado al carrito:", producto.nombre);
      window.location.href = "http://192.168.100.112:5500/productos.html"
    }

  } catch (error) {
    console.error("Error completo:", error);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
  }
};


// --------------------------
// Registrar compra (array en usuario)
// --------------------------
async function registrarCompra(usuarioID, carritoProductos) {
  const userRef = doc(db, "usuarios", usuarioID);

  // 1. Guardar la compra en el array de compras
  for (const item of carritoProductos) {
    await updateDoc(userRef, {
      compras: arrayUnion({
        ...item,
        fecha: new Date()
      })
    });

    // 2. Descontar stock de cada producto
    const prodRef = doc(db, "productos", item.productoID);
    const prodSnap = await getDoc(prodRef);
    if (prodSnap.exists()) {
      const stockActual = prodSnap.data().stock;
      await updateDoc(prodRef, { stock: stockActual - item.unidad });
    }
  }

  // 3. Vaciar el carrito (se sobreescribe como array vacío)
  await updateDoc(userRef, { carrito: [] });

  console.log("Compra registrada y carrito vaciado");
}
