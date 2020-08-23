const express = require('express');
const route = express.Router();
const repoUsuarios = require('../repositories/usuarios.repo');
const repoPedidos = require('../repositories/pedidos.repo');
const servicesPedidos = require('../services/pedidos.service');
const mwAuthToken = require('../middlewares/auth.token');

route.get('/', mwAuthToken.verificarTokenAdmin, async (req, res) => {
	try {
		repoUsuarios.getUsers().then((resultados) => res.status(200).json(resultados[0]));
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

route.get('/:id', mwAuthToken.verificarTokenUsuario, async (req, res) => {
	try {
		repoUsuarios.getUsersById(req.params.id).then((resultados) => {
			if (resultados) {
				res.status(200).json(resultados);
			} else {
				res.status(404).json({ Error: 'Usuario no encontrado' });
			}
		});
	} catch (error) {
		res.status(500).json({ Error: error.message });
	}
});

route.put('/:id', mwAuthToken.verificarTokenUsuario, (req, res) => {
	try {
		repoUsuarios.modificarUsuario(req.body, req.params.id).then((resultado) => {
			if (resultado) {
				res.status(200).json(resultado);
			} else {
				res.status(404).json({ Error: 'Usuario no encontrado' });
			}
		});
	} catch (error) {
		res.status(500).json({ Error: error.message });
	}
});

route.delete('/:id', mwAuthToken.verificarTokenUsuario, (req, res) => {
	try {
		repoUsuarios.borrarUsuario(req.params.id).then((resultado) => {
			if (resultado) {
				res.status(200).json({ Mensaje: 'Usuario borrado' });
			} else {
				res.status(404).json({ Error: 'Usuario no encontrado' });
			}
		});
	} catch (error) {
		res.status(500).json({ Error: error.message });
	}
});

route.get('/:id/pedidos', mwAuthToken.verificarTokenUsuario, async (req, res) => {
	try {
		repoPedidos.getPedidosdeUsuarioPorId(req.params.id).then((resultado) => {
			res.status(200).json(resultado);
		});
	} catch (error) {
		res.status(500).json({ Error: error.message });
	}
});

route.post('/:id/pedidos', mwAuthToken.verificarTokenUsuario, async (req, res) => {
	try {
		servicesPedidos.comprobarUsuarioYProducto(req.body, req.params.id).then((result) => {
			if (result) {
				res.status(201).json({ Mensaje: 'Pedido creado' });
			} else {
				res.status(500).json({ Error: 'No se pudo crear el pedido' });
			}
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

module.exports = route;
