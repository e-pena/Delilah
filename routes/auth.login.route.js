const express = require('express');
const route = express.Router();
const repoUsuarios = require('../repositories/usuarios.repo');
const middAuthToken = require('../middlewares/auth.token');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

route.post('/', async (req, res) => {
	let usuario = req.body;
	try {
		repoUsuarios.comprobarUsuario(usuario).then((result) => {
			if (result) {
				let usuarioExistente = result[0];
				bcrypt.compare(usuario.contrasenia, usuarioExistente.contrasenia, function (err, match) {
					if (err) {
						throw new Error('No se pudo comprobar la contraseña');
					}
					if (match) {
						let payload = {
							usuario: usuarioExistente.username,
							direccion: usuarioExistente.direccion,
							telefono: usuarioExistente.telefono,
							permisos: usuarioExistente.permisos_id,
							id: usuarioExistente.id,
						};
						console.log(payload);
						jwt.sign(payload, middAuthToken.claveSecreta, function (error, token) {
							if (error) {
								res.status(500).json({ Error: message.error });
							} else {
								res.status(200).json(token);
							}
						});
					} else {
						return res.status(500).json({ message: 'Contraseña incorrecta' });
					}
				});
			} else {
				res.status(404).json('No se encontró el usuario');
			}
		});
		// serviceUsuarios.login(usuario).then((result) => res.status(200).json(result));
	} catch (error) {
		res.status(404).json({ error: error.message });
	}
});

module.exports = route;
