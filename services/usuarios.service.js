const repoUsuarios = require('../repositories/usuarios.repo');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authToken = require('../middlewares/auth.token');

async function comprobarContrasenia(data, usuario) {
	bcrypt.compare(data.contrasenia, usuario.contrasenia, function (err, match) {
		if (err) {
			throw new Error('No se pudo comprobar la contraseña');
		}
		if (match) {
			let payload = {
				usuario: usuario.username,
				direccion: usuario.direccion,
				telefono: usuario.telefono,
				permisos: usuario.permisos_id,
			};
			jwt.sign(payload, authToken.claveSecreta, function (error, token) {
				if (error) {
					throw new Error('No se pudo validar el usuario');
				}
				return token;
			});
		} else {
			throw new Error('Contraseña incorrecta');
		}
	});
}

async function login(data) {
	let usuario = data;
	try {
		repoUsuarios.comprobarUsuario(usuario).then((result) => {
			let usuarioExistente = result[0];
			comprobarContrasenia(usuario, usuarioExistente).then((result) => {
				console.log(result);
				let token = result;
				return token;
			});
		});
	} catch (error) {
		return error;
	}
}

async function comprobarDatos(data) {
	let usuario = data;
	try {
		if (
			usuario.username &&
			usuario.nombre_completo &&
			usuario.email &&
			usuario.direccion &&
			usuario.telefono &&
			usuario.contrasenia
		) {
			repoUsuarios.comprobarUsername(usuario).then((result) => {
				let usuarioIngresado = result;
				return usuarioIngresado;
			});
		} else {
			throw new Error('Información incompleta');
		}
	} catch (error) {
		console.log(error);
		return error;
	}
}

module.exports = { login, comprobarDatos };
