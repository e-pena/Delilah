const sql = require('../db/connection');
const bcrypt = require('bcrypt');

async function comprobarUsuario(data) {
	try {
		let resultado = await sql.query('SELECT * FROM usuarios WHERE username = ?', {
			replacements: [data.username],
			type: sql.QueryTypes.SELECT,
		});
		if (resultado.length == 1) {
			return resultado;
		} else {
			return false;
		}
	} catch (error) {
		return error;
	}
}

async function registrarUsuario(data) {
	try {
		let resultado = await sql.query('SELECT * FROM usuarios WHERE username = ?', {
			replacements: [data.username],
			type: sql.QueryTypes.SELECT,
		});
		console.log(resultado);
		if (resultado.length == 1) {
			return false;
		} else {
			let usuarioRegister = data;
			let nuevoUsuario;
			bcrypt.genSalt(10).then((salts) => {
				bcrypt.hash(usuarioRegister.contrasenia, salts).then(async (hash) => {
					usuarioRegister.contrasenia = hash;
					nuevoUsuario = sql.query(
						'INSERT INTO usuarios (username, nombre_completo, email, direccion, telefono, contrasenia, permisos_id) VALUES (:username, :nombre_completo, :email, :direccion, :telefono, :contrasenia, :permisos_id)',
						{
							replacements: {
								username: usuarioRegister.username,
								nombre_completo: usuarioRegister.nombre_completo,
								email: usuarioRegister.email,
								direccion: usuarioRegister.direccion,
								telefono: usuarioRegister.telefono,
								contrasenia: usuarioRegister.contrasenia,
								permisos_id: usuarioRegister.permisos_id,
							},
							type: sql.QueryTypes.INSERT,
						}
					);
				});
			});
		}
		return data;
	} catch (error) {
		console.log(error);
		return error;
	}
}

async function getUsers() {
	try {
		let resultados = await sql.query('SELECT * FROM usuarios', { type: sql.QueryTypes.SELECT });
		return resultados;
	} catch (error) {
		return error;
	}
}

async function getUsersById(id) {
	try {
		let resultado = await sql.query('SELECT * FROM usuarios WHERE id = ?', {
			replacements: [id],
			type: sql.QueryTypes.SELECT,
		});
		if (resultado.length == 1) {
			return resultado;
		} else {
			return false;
		}
	} catch (error) {
		return error;
	}
}

async function modificarUsuario(data, id) {
	try {
		let comprobacionDeUsuario = await getUsersById(id);
		if (comprobacionDeUsuario) {
			let usuarioModificado = data;
			bcrypt.genSalt(10).then((salts) => {
				let usuario;
				bcrypt.hash(usuarioModificado.contrasenia, salts).then(async (hash) => {
					usuarioModificado.contrasenia = hash;
					usuario = await sql.query(
						'UPDATE usuarios SET nombre_completo = :nombre_completo, email = :email, direccion = :direccion, telefono = :telefono, contrasenia = :contrasenia WHERE id = :id',
						{
							replacements: {
								nombre_completo: usuarioModificado.nombre_completo,
								email: usuarioModificado.email,
								direccion: usuarioModificado.direccion,
								telefono: usuarioModificado.telefono,
								contrasenia: usuarioModificado.contrasenia,
								id: id,
							},
							type: sql.QueryTypes.UPDATE,
						}
					);
				});
			});
			return usuarioModificado;
		} else {
			return false;
		}
	} catch (error) {
		return error;
	}
}

async function borrarUsuario(id) {
	try {
		let comprobacionDeUsuario = await getUsersById(id);
		if (comprobacionDeUsuario) {
			await sql.query('DELETE FROM usuarios WHERE id = ?', {
				replacements: [id],
				type: sql.QueryTypes.DELETE,
			});
			return true;
		} else {
			return false;
		}
	} catch (error) {
		return error;
	}
}

module.exports = { comprobarUsuario, registrarUsuario, getUsers, getUsersById, modificarUsuario, borrarUsuario };
