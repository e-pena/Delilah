const nodemailer = require('nodemailer');
const repoUsuarios = require('../repositories/usuarios.repo');
require('dotenv').config();

async function enviarMailRegistro(email, nombre, username) {
	try {
		let transporter = nodemailer.createTransport({
			host: 'smtp-mail.outlook.com',
			port: 587,
			secure: false, // true for 465, false for other ports
			auth: {
				user: process.env.MAIL_USER,
				pass: process.env.MAIL_PASS,
			},
		});
		let info = await transporter.sendMail({
			from: `"Delilah Restó" <${process.env.MAIL_USER}>`, // sender address
			to: `${email}`, // list of receivers
			subject: 'Registro confirmado', // Subject line
			html: `<h2>Gracias por registrarte en Delilah Restó!</h2>
            <p>${nombre}, te damos la bienvenida al lugar N°1 de comidas.</p>
            <p>Recordá que tu usuario es ${username}`, // html body
		});

		console.log('Message sent: %s', info.messageId);
		// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
	} catch (error) {
		console.log(error);
	}
}

async function enviarMailPedidoNuevo(email, nombre, descripcion) {
	try {
		let transporter = nodemailer.createTransport({
			host: 'smtp-mail.outlook.com',
			port: 587,
			secure: false, // true for 465, false for other ports
			auth: {
				user: process.env.MAIL_USER,
				pass: process.env.MAIL_PASS,
			},
		});
		let info = await transporter.sendMail({
			from: `"Delilah Restó" <${process.env.MAIL_USER}>`, // sender address
			to: `${email}`, // list of receivers
			subject: 'Nuevo pedido', // Subject line
			html: `<h2>Gracias por confiar en Delilah Restó!</h2>
            <p>${nombre}, aquí está la descripción de tu nuevo pedido:</p>
            <p>${descripcion}`, // html body
		});

		console.log('Message sent: %s', info.messageId);
		// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
	} catch (error) {
		console.log(error);
	}
}

async function enviarMailCancelandoPedido(data) {
	try {
		let [usuario] = await repoUsuarios.getUsersById(data.usuario_id);
		let transporter = nodemailer.createTransport({
			host: 'smtp-mail.outlook.com',
			port: 587,
			secure: false, // true for 465, false for other ports
			auth: {
				user: process.env.MAIL_USER,
				pass: process.env.MAIL_PASS,
			},
		});
		let info = await transporter.sendMail({
			from: `"Delilah Restó" <${process.env.MAIL_USER}>`, // sender address
			to: `${usuario.email}`, // list of receivers
			subject: 'Pedido cancelado', // Subject line
			html: `<h2>El pedido ha sido cancelado</h2>
            <p>${usuario.nombre_completo}, el pedido ${data.id} ha sido cancelado.</p>
            <p>El pedido constaba de: ${data.descripcion}`, // html body
		});

		console.log('Message sent: %s', info.messageId);
		// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
	} catch (error) {
		console.log(error);
	}
}

async function enviarMailActualizacionDatos(data) {
	try {
		let transporter = nodemailer.createTransport({
			host: 'smtp-mail.outlook.com',
			port: 587,
			secure: false, // true for 465, false for other ports
			auth: {
				user: process.env.MAIL_USER,
				pass: process.env.MAIL_PASS,
			},
		});
		let info = await transporter.sendMail({
			from: `"Delilah Restó" <${process.env.MAIL_USER}>`, // sender address
			to: `${data.email}`, // list of receivers
			subject: 'Actualización de datos', // Subject line
			html: `<h2>Datos actualizados correctamente</h2>
            <p>${data.nombre_completo}, estos son los datos registrados en nuestra base:</p>
            <ul>
                <li>Nombre completo: ${data.nombre_completo}</li>
                <li>Email: ${data.email}</li>
                <li>Dirección: ${data.direccion}</li>
                <li>Teléfono: ${data.telefono}</li>
                <li>Contraseña: ${data.contrasenia}</li>
            </ul>
            <p>Gracias por seguir confiando en Delilah Restó`, // html body
		});

		console.log('Message sent: %s', info.messageId);
		// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
	} catch (error) {
		console.log(error);
	}
}

module.exports = {
	enviarMailRegistro,
	enviarMailPedidoNuevo,
	enviarMailActualizacionDatos,
	enviarMailCancelandoPedido,
};
