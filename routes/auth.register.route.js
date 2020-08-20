const express = require('express');
const route = express.Router();
const repoUsuarios = require('../repositories/usuarios.repo');
const middAuthToken = require('../middlewares/auth.token');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

route.post('/', async (req, res) => {
	let usuario = req.body;
	try {
		if (
			usuario.username &&
			usuario.nombre_completo &&
			usuario.email &&
			usuario.direccion &&
			usuario.telefono &&
			usuario.contrasenia
		) {
			repoUsuarios.registrarUsuario(usuario).then((result) => {
				if (result) {
					res.status(200).json(result);
				} else {
					res.status(500).json({ Mensaje: 'El username ya existe' });
				}
			});
		} else {
			res.status(500).json({ Mensaje: 'Información incompleta' });
		}
	} catch (error) {
		res.status(500).json({ Error: error.message });
	}
});

module.exports = route;
