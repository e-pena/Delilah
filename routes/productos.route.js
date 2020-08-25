const express = require('express');
const route = express.Router();
const repoProductos = require('../repositories/productos.repo');
const servicesProductos = require('../services/productos.service');
const mwAuthToken = require('../middlewares/auth.token');

route.get('/', mwAuthToken.verificarTokenUsuario, async (req, res) => {
	try {
		repoProductos.getProducts().then((resultado) => {
			res.status(200).json(resultado);
		});
	} catch (error) {
		res.status(500).json({ Error: error.message });
	}
});

route.get('/:id', mwAuthToken.verificarTokenUsuario, async (req, res) => {
	try {
		repoProductos.getProductsById(req.params.id).then((resultado) => {
			if (resultado) {
				res.status(200).json(resultado);
			} else {
				res.status(404).json({ Error: 'Producto no encontrado' });
			}
		});
	} catch (error) {
		res.status(500).json({ Error: error.message });
	}
});

route.post('/', mwAuthToken.verificarTokenAdmin, async (req, res) => {
	try {
		servicesProductos.revisarDatosProductoNuevo(req.body).then((result) => {
			if (result) {
				res.status(201).json({ Mensaje: 'Producto creado' });
			} else {
				res.status(500).json({ Error: 'No se pudo crear el producto' });
			}
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

route.put('/:id', mwAuthToken.verificarTokenAdmin, async (req, res) => {
	try {
		repoProductos.modificarProducto(req.body, req.params.id).then((resultado) => {
			if (resultado) {
				res.status(201).json({ Mensaje: 'Producto modificado' });
			} else {
				res.status(404).json({ Error: 'Producto no encontrado o titulo ya existente' });
			}
		});
	} catch (error) {
		res.status(500).json({ Error: error.message });
	}
});

route.delete('/:id', mwAuthToken.verificarTokenAdmin, async (req, res) => {
	try {
		repoProductos.borrarProducto(req.params.id).then((resultado) => {
			if (resultado) {
				res.status(200).json({ Mensaje: 'Producto borrado' });
			} else {
				res.status(404).json({ Error: 'Producto no encontrado' });
			}
		});
	} catch (error) {
		res.status(500).json({ Error: error.message });
	}
});

module.exports = route;
