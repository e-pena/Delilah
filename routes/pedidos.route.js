const express = require('express');
const route = express.Router();
const repoPedidos = require('../repositories/pedidos.repo');
const mwAuthToken = require('../middlewares/auth.token');

route.get('/', mwAuthToken.verificarTokenAdmin, async (req, res) => {
	try {
		repoPedidos.getPedidos().then((resultado) => {
			res.status(200).json(resultado);
		});
	} catch (error) {
		res.status(500).json({ Error: error.message });
	}
});

route.patch('/:id', mwAuthToken.verificarTokenAdmin, async (req, res) => {
	try {
		repoPedidos.modificarEstadoDePedido(req.body, req.params.id).then((resultado) => {
			if (resultado) {
				res.status(200).json({ Mensaje: 'Pedido modificado' });
			} else {
				res.status(404).json({ Error: 'Pedido no encontrado' });
			}
		});
	} catch (error) {
		res.status(500).json({ Error: error.message });
	}
});

route.delete('/:id', mwAuthToken.verificarTokenAdmin, async (req, res) => {
	try {
		repoPedidos.borrarPedido(req.params.id).then((resultado) => {
			if (resultado) {
				res.status(200).json({ Mensaje: 'Pedido borrado' });
			} else {
				res.status(404).json({ Error: 'Pedido no encontrado' });
			}
		});
	} catch (error) {
		res.status(500).json({ Error: error.message });
	}
});

module.exports = route;
