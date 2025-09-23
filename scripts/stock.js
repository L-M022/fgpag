const archivoTxt = './stock.txt';
const productos = []; // <-- aquí acumulamos todos los productos

fetch(archivoTxt)
  .then(response => response.text())
  .then(text => {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    const container = document.getElementById('productosContainer');
    container.innerHTML = ''; // limpiar contenido previo

    lines.forEach(line => {
      let [codigo, nombreRaw, marca, unidad] = line.split(';');

      // reemplazar � por Ñ
      const nombre = nombreRaw.replaceAll("�", "Ñ");

      // crear objeto producto
      const producto = { codigo, nombre, marca, unidad };
      productos.push(producto); // <-- acumulamos

      // solo mostrar si unidad != "0"
      if (!unidad.startsWith("0")) {

        const div = document.createElement('div');
        div.classList.add('producto');

        div.innerHTML = `
          <p><strong>Código:</strong> ${codigo}</p>
          <p><strong>Nombre:</strong> ${nombre}</p>
          ${marca ? `<p><strong>Marca:</strong> ${marca}</p>` : ''}
          <p><strong>Unidad:</strong> ${unidad}</p>
        `;

        container.appendChild(div);
      }
    });

    console.log(productos); // <-- aquí ves todos los productos acumulados
  })
  .catch(err => console.error('Error al leer el archivo:', err));
