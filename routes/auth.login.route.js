const express = require('express');
const route = express.Router();
const serviceUsuarios = require('../services/usuarios.service');

route.post('/', async (req, res) => {
	let usuario = req.body;
	try {
		serviceUsuarios.login(usuario).then((result) => {
			res.status(200).json(result);
		});
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
});

module.exports = route;
