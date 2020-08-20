const express = require('express');
const route = express.Router();
const repoUsuarios = require('../repositories/usuarios.repo');
const middAuth = require('../middlewares/auth.token');

route.get('/', middAuth.verificarTokenAdmin, async (req, res) => {
	// Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjoiZXBlbmEiLCJkaXJlY2Npb24iOiJDYWxsZSBGYWxzYSAxMjMiLCJ0ZWxlZm9ubyI6IjEyMzQ1Njc4IiwicGVybWlzb3MiOjIsImlhdCI6MTU5Nzg5NDgzNn0.fY2uLMDAeJGpeh3x5cz8IwZjW2GexMuKBrfwSdrIGd4
	try {
		repoUsuarios.getUsers().then((resultados) => res.status(200).json(resultados[0]));
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

route.get('/:id', middAuth.verificarTokenAdmin, async (req, res) => {
	// Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjoiZXBlbmEiLCJkaXJlY2Npb24iOiJDYWxsZSBGYWxzYSAxMjMiLCJ0ZWxlZm9ubyI6IjEyMzQ1Njc4IiwicGVybWlzb3MiOjIsImlhdCI6MTU5Nzg5NDgzNn0.fY2uLMDAeJGpeh3x5cz8IwZjW2GexMuKBrfwSdrIGd4
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

route.put('/:id', (req, res) => {
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

route.delete('/:id', (req, res) => {
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
