const sql = require('../db/connection');
const repoProductos = require('../repositories/productos.repo');

// async function comprobarFormaDePago(data) {
//     try {
// 		let [resultado] = await sql.query('SELECT * FROM pago WHERE forma_pago = ?', {
// 			replacements: [data],
// 			type: sql.QueryTypes.SELECT,
// 		});
// 		if (resultado.length == 1) {
// 			return resultado;
// 		} else {
// 			return false;
// 		}
// 	} catch (error) {
// 		return error;
// 	}
// }

// async function comprobarEstado(data) {
//     try {
// 		let [resultado] = await sql.query('SELECT * FROM estados WHERE estado = ?', {
// 			replacements: [data],
// 			type: sql.QueryTypes.SELECT,
// 		});
// 		if (resultado.length == 1) {
// 			return resultado;
// 		} else {
// 			return false;
// 		}
// 	} catch (error) {
// 		return error;
// 	}
// }

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

async function agregarNuevoPedido(data, infoProductos) {
	try {
		let costoTotal = await sumarCostoTotal(infoProductos.idProductos);
		let resultado = await sql.query(
			'INSERT INTO pedidos (estado_id, descripcion, hora, pago_id, costo, usuario_id) VALUES (:estado_id, :descripcion, NOW(), :pago_id, :costo, :usuario_id)',
			{
				replacements: {
					estado_id: data.estado_id,
					descripcion: infoProductos.descripcionProductos,
					pago_id: data.pago_id,
					costo: costoTotal,
					usuario_id: data.usuario_id,
				},
				type: sql.QueryTypes.INSERT,
			}
		);
		await crearProductosDelPedido(infoProductos.idProductos, data.usuario_id);
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
		let pedidoRealizado = [];
		let resultados = await sql.query(
			'SELECT pedidos.id, pedidos.descripcion, pedidos.hora, pedidos.costo, estados.estado, pago.forma_pago, usuarios.username, usuarios.direccion, usuarios.telefono, usuarios.email FROM pedidos JOIN estados ON pedidos.estado_id = estados.id JOIN pago ON pedidos.pago_id = pago.id JOIN usuarios ON pedidos.usuario_id = usuarios.id',
			{ type: sql.QueryTypes.SELECT }
		);
		let productos = await sql.query(
			`SELECT productoPedido.id, productos.id AS productos_id, productos.titulo, productos.precio FROM productoPedido JOIN productos ON productoPedido.producto_id = productos.id JOIN pedidos ON productoPedido.pedido_id = pedidos.id`,
			{ type: sql.QueryTypes.SELECT }
		);
		for (let i = 0; i < resultados.length; i++) {
			const element = resultados[i];
			if (element.id == productos[i].id) {
				let datoPedido = new Pedido(element, productos[i]);
				pedidoRealizado.push(datoPedido);
			}
		}
		return pedidoRealizado;
	} catch (error) {
		return error;
	}
}

module.exports = { agregarNuevoPedido, getPedidos };
