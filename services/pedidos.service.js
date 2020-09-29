const repoProductos = require('../repositories/productos.repo');
const repoUsuarios = require('../repositories/usuarios.repo');
const repoPedidos = require('../repositories/pedidos.repo');
const serviceUsuarios = require('../services/usuarios.service');

async function comprobarProducto(data) {
	let idProductos = [];
	let descripcionProductos = '';
	for (let i = 0; i < data.length; i++) {
		const element = data[i];
		let productoEncontrado = await repoProductos.getProductsById(element.id);
		if (productoEncontrado.length > 0) {
			idProductos.push(productoEncontrado[0].id);
			descripcionProductos += `${element.cantidad} x ${productoEncontrado[0].titulo} |`;
		}
	}
	if (data.length == idProductos.length) {
		return { idProductos, descripcionProductos };
	} else {
		return false;
	}
}

async function comprobarUsuarioYProducto(data, idUsuario) {
	try {
		let [existeUsuario] = await repoUsuarios.getUsersById(idUsuario);
		let existeProducto = await comprobarProducto(data.productos);
		if (
			existeProducto &&
			existeUsuario &&
			data.estado_id <= 6 &&
			data.estado_id > 0 &&
			data.pago_id <= 2 &&
			data.pago_id >= 0
		) {
			await repoPedidos.agregarNuevoPedido(data, idUsuario, existeProducto);
			serviceUsuarios.enviarMailPedidoNuevo(
				existeUsuario.email,
				existeUsuario.nombre_completo,
				existeProducto.descripcionProductos
			);
			return data;
		} else {
			throw new Error('El pedido no se puede realizar');
		}
	} catch (error) {
		console.log(error);
		return false;
	}
}

module.exports = { comprobarUsuarioYProducto };
