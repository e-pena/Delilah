const express = require('express');
const route = express.Router();
const serviceUsuarios = require('../services/usuarios.service');

route.post('/', async (req, res) => {
	let usuario = req.body;
	try {
		serviceUsuarios.comprobarDatos(usuario).then((result) => {
			res.status(200).send('Registro exitoso');
		});
	} catch (error) {
		res.status(500).json({ Error: error.message });
	}
});

module.exports = route;
