const FORM_LOGIN = document.querySelector('#form-login');
const BTN_LOGIN = document.querySelector('#btn-login');
const USUARIO_LOGIN = document.querySelector('#usuario-login');
const CONTRASENIA_LOGIN = document.querySelector('#contrasenia-login');
const MODAL_LOGIN = document.querySelector('#modal-login');

// data-toggle="modal" data-target="#login-modal"

// FUNCIÓN PARA LOGUEARSE

FORM_LOGIN.addEventListener('submit', function (e) {
	e.preventDefault();
	try {
		fetch('/login', {
			method: 'POST',
			body: `{ "username": "${FORM_LOGIN.username.value}", "contrasenia": "${FORM_LOGIN.contrasenia.value}"}`,
			headers: { 'Content-Type': 'application/json' },
		})
			.then((response) => {
				if (response.status == 404) {
					MODAL_LOGIN.innerText = 'Usuario inexistente';
				}
				if (response.status == 401) {
					MODAL_LOGIN.innerText = 'Contraseña incorrecta';
				}
				if (response.status == 200) {
					MODAL_LOGIN.innerText = 'Ingreso exitoso';
					return response.json();
				}
			})
			.then((data) => {
				if (data) {
					localStorage.setItem('token', data);
					return data;
				}
				return data;
			});
		return response;
	} catch (error) {
		return error;
	}
	return false;
});

// FUNCIÓN PARA REGISTRARSE

// function signIn(usuario) {
// 	try {
// 		fetch('/usuarios/', {
// 			method: 'POST',
// 			body: JSON.stringify(usuario),
// 			headers: { 'Content-Type': 'application/json' },
// 		})
// 			.then((response) => {
// 				return response.json();
// 			})
// 			.then((data) => {
// 				console.log(data);
// 				idUsuarioActual = data.id;
// 				paquetesBtn.disabled = false;
// 				btnCompra.forEach((element) => {
// 					element.disabled = false;
// 				});
// 				btnReserva.forEach((element) => {
// 					element.disabled = false;
// 				});
// 			});
// 	} catch (error) {
// 		return error;
// 	}
// }

// // CLASES NECESARIAS PARA EL REGISTRO Y LOGUEO

// class UsuarioRegistrado {
// 	constructor(username, contrasenia) {
// 		this.username = username;
// 		this.contrasenia = contrasenia;
// 	}
// 	email = '';
// 	contrasenia = '';
// }

// class UsuarioNuevo {
// 	constructor(nombre, apellido, email, contrasenia) {
// 		this.nombre = nombre;
// 		this.apellido = apellido;
// 		this.email = email;
// 		this.contrasenia = contrasenia;
// 	}
// 	nombre = '';
// 	apellido = '';
// 	email = '';
// 	contrasenia = '';
// }

// // FUNCIONALIDAD DE BOTONES DE REGISTRO Y LOGUEO

// BTN_LOGIN.addEventListener('click', (e) => {
// 	e.preventDefault();
// 	let username = USUARIO_LOGIN.value;
// 	let contrasenia = CONTRASENIA_LOGIN.value;
// 	let usuarioExistente = new UsuarioRegistrado(username, contrasenia);
// 	logIn(usuarioExistente);
// });

// FORM_LOGIN.addEventListener('submit', (e) => {
// 	e.preventDefault();
// 	let username = FORM_LOGIN.username.value;
// 	let contrasenia = FORM_LOGIN.contrasenia.value;
// 	const usuario = new UsuarioRegistrado(username, contrasenia);
// 	logIn(usuario);
// });

// signinBtn.addEventListener('click', (e) => {
// 	e.preventDefault();
// 	let apellido = signinApellido.value;
// 	let nombre = signinNombre.value;
// 	let email = signinEmail.value;
// 	let contrasenia = signinContrasenia.value;
// 	if (apellido && nombre && email) {
// 		let usuarioNuevo = new UsuarioNuevo(nombre, apellido, email, contrasenia);
// 		console.log(usuarioNuevo);
// 		signIn(usuarioNuevo);
// 		saludoUsuario.innerText = `Registro exitoso. Por favor, realice el log in`;
// 		saludoUsuario.classList.remove('oculto');
// 		logInFallido.classList.add('oculto');
// 	}
// });
