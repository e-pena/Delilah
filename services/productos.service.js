const repoProductos = require('../repositories/productos.repo');

async function revisarDatosProductoNuevo(data) {
	try {
		let existeProducto = await repoProductos.getProductsByTitle(data);
		if (existeProducto) {
			repoProductos.agregarNuevoProducto(data);
			return data;
		} else {
			throw new Error('El título del producto no puede repetirse');
		}
	} catch (error) {
		console.log(error);
		return null;
	}
}

module.exports = { revisarDatosProductoNuevo };
