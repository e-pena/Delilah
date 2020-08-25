const sql = require('../db/connection');

async function getProducts() {
	try {
		let resultados = await sql.query('SELECT * FROM productos', { type: sql.QueryTypes.SELECT });
		return resultados;
	} catch (error) {
		return error;
	}
}

async function getProductsById(id) {
	try {
		let resultado = await sql.query('SELECT * FROM productos WHERE id = ?', {
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

async function getProductsByTitle(data) {
	try {
		let resultado = await sql.query('SELECT * FROM productos WHERE titulo = ?', {
			replacements: [data.titulo],
			type: sql.QueryTypes.SELECT,
		});
		if (resultado.length == 1) {
			return false;
		} else {
			return resultado;
		}
	} catch (error) {
		return error;
	}
}

async function agregarNuevoProducto(data) {
	try {
		await sql.query('INSERT INTO productos (titulo, precio) VALUES (:titulo, :precio)', {
			replacements: { titulo: data.titulo, precio: data.precio },
			type: sql.QueryTypes.SELECT,
		});
	} catch (error) {
		return error;
	}
}

async function modificarProducto(data, id) {
	try {
		let comprobacionDeProducto = await getProductsById(id);
		if (comprobacionDeProducto) {
			let comprobacionTitulo = await getProductsByTitle(data);
			if (comprobacionTitulo) {
				await sql.query('UPDATE productos SET titulo = :titulo, precio = :precio WHERE id = :id', {
					replacements: {
						titulo: data.titulo,
						precio: data.precio,
						id: id,
					},
					type: sql.QueryTypes.UPDATE,
				});
				return data;
			} else {
				return false;
			}
		} else {
			return false;
		}
	} catch (error) {
		return error;
	}
}

async function borrarProducto(id) {
	try {
		let comprobacionDeProducto = await getProductsById(id);
		if (comprobacionDeProducto) {
			await sql.query('DELETE FROM productos WHERE id = ?', {
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

module.exports = {
	getProducts,
	getProductsById,
	getProductsByTitle,
	agregarNuevoProducto,
	modificarProducto,
	borrarProducto,
};
