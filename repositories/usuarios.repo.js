const sql = require('../db/connection');
const bcrypt = require('bcrypt');

async function comprobarUsuario(data) {
	try {
		let resultado = await sql.query('SELECT * FROM usuarios WHERE username = ?', {
			replacements: [data.username],
			type: sql.QueryTypes.SELECT,
		});
		return resultado;
	} catch (error) {
		throw new Error('No se encontró el usuario');
	}
}

async function comprobarUsername(data) {
	try {
		let resultado = await sql.query('SELECT * FROM usuarios WHERE username = ?', {
			replacements: [data.username],
			type: sql.QueryTypes.SELECT,
		});
		if (resultado.length > 0) {
			throw new Error('El username ya existe');
		} else {
			let usuarioRegister = data;
			let nuevoUsuario;
			bcrypt.genSalt(10).then((salts) => {
				bcrypt.hash(usuarioRegister.contrasenia, salts).then((hash) => {
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
			return nuevoUsuario;
		}
	} catch (error) {
		console.log(error);
		return error;
	}
}

module.exports = { comprobarUsuario, comprobarUsername };
