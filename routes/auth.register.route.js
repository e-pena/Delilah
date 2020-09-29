const express = require('express');
const route = express.Router();
const repoUsuarios = require('../repositories/usuarios.repo');
const serviceUsuarios = require('../services/usuarios.service');

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
					res.status(201).json(result);
					serviceUsuarios.enviarMailRegistro(usuario.email, usuario.nombre_completo, usuario.username);
				} else {
					res.status(409).json({ Mensaje: 'El username ya existe' });
				}
			});
		} else {
			res.status(400).json({ Mensaje: 'Información incompleta' });
		}
	} catch (error) {
		res.status(500).json({ Error: error.message });
	}
});

module.exports = route;
