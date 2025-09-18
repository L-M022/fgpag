import { getFirestore, collection, addDoc } from "firebase/firestore";

const db = getFirestore(app);

// Guardar una compra
async function guardarCompra(uid, items, total) {
    try {
        await addDoc(collection(db, "compras"), {
            usuario: uid,
            items: items,
            total: total,
            fecha: new Date()
        });
        console.log("Compra guardada");
    } catch (e) {
        console.error("Error guardando compra: ", e);
    }
}
