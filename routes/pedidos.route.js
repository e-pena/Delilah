const express = require('express');
const route = express.Router();
const repoPedidos = require('../repositories/pedidos.repo');
const servicesPedidos = require('../services/pedidos.service');
const mwAuthToken = require('../middlewares/auth.token');

route.post('/', async (req, res) => {
	try {
		servicesPedidos.comprobarUsuarioYProducto(req.body).then((result) => {
			if (result) {
				res.status(200).json({ Mensaje: 'Pedido creado' });
			} else {
				res.status(500).json({ Error: 'No se pudo crear el pedido' });
			}
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

route.get('/', async (req, res) => {
	try {
		repoPedidos.getPedidos().then((resultado) => {
			res.status(200).json(resultado);
		});
	} catch (error) {
		res.status(500).json({ Error: error.message });
	}
});

module.exports = route;
