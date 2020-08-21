const express = require('express');
const route = express.Router();
const repoUsuarios = require('../repositories/usuarios.repo');
const mwAuthToken = require('../middlewares/auth.token');

route.get('/', mwAuthToken.verificarTokenAdmin, async (req, res) => {
	// Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjoiZXBlbmEiLCJkaXJlY2Npb24iOiJDYWxsZSBGYWxzYSAxMjMiLCJ0ZWxlZm9ubyI6IjEyMzQ1Njc4IiwicGVybWlzb3MiOjIsImlhdCI6MTU5Nzk5MTE0Mn0.S6IdVUsFM8-GqY2zCnwPQVO6EdZB4Rg6P684Blo_xSg
	try {
		repoUsuarios.getUsers().then((resultados) => res.status(200).json(resultados[0]));
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

route.get('/:id', mwAuthToken.verificarTokenUsuario, async (req, res) => {
	// Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjoiZXBlbmEiLCJkaXJlY2Npb24iOiJDYWxsZSBGYWxzYSAxMjMiLCJ0ZWxlZm9ubyI6IjEyMzQ1Njc4IiwicGVybWlzb3MiOjIsImlhdCI6MTU5Nzk5MTE0Mn0.S6IdVUsFM8-GqY2zCnwPQVO6EdZB4Rg6P684Blo_xSg
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

module.exports = route;
