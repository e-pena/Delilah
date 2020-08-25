const sql = require('../db/connection');
const repoProductos = require('../repositories/productos.repo');

async function crearProductosDelPedido(idProductos, idUsuario) {
	try {
		let [idPedido] = await sql.query('SELECT id FROM pedidos WHERE usuario_id = ? ORDER BY id DESC', {
			replacements: [idUsuario],
			type: sql.QueryTypes.SELECT,
		});
		idProductos.forEach(async (element) => {
			await sql.query('INSERT INTO productoPedido (pedido_id, producto_id) VALUES (:pedido_id, :producto_id)', {
				replacements: {
					pedido_id: idPedido.id,
					producto_id: element,
				},
				type: sql.QueryTypes.INSERT,
			});
		});
	} catch (error) {
		return error;
	}
}

async function sumarCostoTotal(data) {
	try {
		let costoTotal = 0;
		for (let i = 0; i < data.length; i++) {
			const element = data[i];
			let [productoEncontrado] = await repoProductos.getProductsById(element);
			costoTotal += productoEncontrado.precio;
		}
		return costoTotal;
	} catch (error) {
		return error;
	}
}

async function agregarNuevoPedido(data, idUsuario, infoProductos) {
	try {
		let costoTotal = await sumarCostoTotal(infoProductos.idProductos);
		await sql.query(
			'INSERT INTO pedidos (estado_id, descripcion, hora, pago_id, costo, usuario_id) VALUES (:estado_id, :descripcion, NOW(), :pago_id, :costo, :usuario_id)',
			{
				replacements: {
					estado_id: data.estado_id,
					descripcion: infoProductos.descripcionProductos,
					pago_id: data.pago_id,
					costo: costoTotal,
					usuario_id: idUsuario,
				},
				type: sql.QueryTypes.INSERT,
			}
		);
		await crearProductosDelPedido(infoProductos.idProductos, idUsuario);
	} catch (error) {
		return error;
	}
}

class Pedido {
	constructor(datosPedido, datosProducto) {
		(this.datosPedido = datosPedido), (this.datosProducto = datosProducto);
	}
	datosPedido = {};
	datosProducto = [];
}

async function getPedidos() {
	try {
		let pedidos = await sql.query(
			'SELECT pedidos.id, pedidos.descripcion, pedidos.hora, pedidos.costo, estados.estado, pago.forma_pago, usuarios.username, usuarios.direccion, usuarios.telefono, usuarios.email FROM pedidos JOIN estados ON pedidos.estado_id = estados.id JOIN pago ON pedidos.pago_id = pago.id JOIN usuarios ON pedidos.usuario_id = usuarios.id',
			{ type: sql.QueryTypes.SELECT }
		);
		let productos = await sql.query(
			`SELECT productos.id AS producto_id, productos.titulo, productos.precio, productos.imagen, productoPedido.pedido_id FROM productoPedido JOIN productos ON productoPedido.producto_id = productos.id JOIN pedidos ON productoPedido.pedido_id = pedidos.id`,
			{ type: sql.QueryTypes.SELECT }
		);
		let resultados = [];
		for (let i = 0; i < pedidos.length; i++) {
			const pedidoIndividual = pedidos[i];
			let productosDelPedido = [];
			for (let j = 0; j < productos.length; j++) {
				const productoIndividual = productos[j];
				if (pedidoIndividual.id == productoIndividual.pedido_id) {
					productosDelPedido.push(productoIndividual);
				}
			}
			let pedidoCompleto = new Pedido(pedidoIndividual, productosDelPedido);
			resultados.push(pedidoCompleto);
		}
		return resultados;
	} catch (error) {
		return error;
	}
}

async function getPedidosdeUsuarioPorId(id) {
	try {
		let pedidos = await sql.query(
			'SELECT pedidos.id, pedidos.descripcion, pedidos.hora, pedidos.costo, estados.estado, pago.forma_pago, usuarios.id AS usuario_id FROM pedidos JOIN estados ON pedidos.estado_id = estados.id JOIN pago ON pedidos.pago_id = pago.id JOIN usuarios ON pedidos.usuario_id = usuarios.id WHERE usuarios.id = ?',
			{ replacements: [id], type: sql.QueryTypes.SELECT }
		);
		let productos = await sql.query(
			`SELECT productos.id AS producto_id, productos.titulo, productos.precio, productos.imagen, productoPedido.pedido_id FROM productoPedido JOIN productos ON productoPedido.producto_id = productos.id JOIN pedidos ON productoPedido.pedido_id = pedidos.id`,
			{ type: sql.QueryTypes.SELECT }
		);
		let resultados = [];
		for (let i = 0; i < pedidos.length; i++) {
			const pedidoIndividual = pedidos[i];
			let productosDelPedido = [];
			for (let j = 0; j < productos.length; j++) {
				const productoIndividual = productos[j];
				if (pedidoIndividual.id == productoIndividual.pedido_id) {
					productosDelPedido.push(productoIndividual);
				}
			}
			let pedidoCompleto = new Pedido(pedidoIndividual, productosDelPedido);
			resultados.push(pedidoCompleto);
		}
		return resultados;
	} catch (error) {
		return error;
	}
}

async function getPedidosById(id) {
	try {
		let resultado = await sql.query('SELECT * FROM pedidos WHERE id = ?', {
			replacements: [id],
			type: sql.QueryTypes.SELECT,
		});
		if (resultado.length == 1) {
			return resultado;
		} else {
			return false;
		}
	} catch (error) {
		return error;
	}
}

async function modificarEstadoDePedido(data, id) {
	try {
		let comprobacionDePedido = await getPedidosById(id);
		if (comprobacionDePedido) {
			await sql.query('UPDATE pedidos SET estado_id = :estado_id WHERE id = :id', {
				replacements: {
					estado_id: data.estado_id,
					id: id,
				},
				type: sql.QueryTypes.UPDATE,
			});
			return data;
		} else {
			return false;
		}
	} catch (error) {
		return error;
	}
}

async function borrarPedido(id) {
	try {
		let comprobacionDePedido = await getPedidosById(id);
		if (comprobacionDePedido) {
			await sql.query('DELETE FROM productoPedido WHERE pedido_id = ?', {
				replacements: [id],
				type: sql.QueryTypes.DELETE,
			});

			await sql.query('DELETE FROM pedidos WHERE id = ?', {
				replacements: [id],
				type: sql.QueryTypes.DELETE,
			});
			return true;
		} else {
			return false;
		}
	} catch (error) {
		return error;
	}
}

module.exports = { agregarNuevoPedido, getPedidos, getPedidosdeUsuarioPorId, modificarEstadoDePedido, borrarPedido };
