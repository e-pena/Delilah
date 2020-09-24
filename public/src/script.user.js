const LINK_ADMIN = document.querySelector('#link-admin');
const FORM_UPDATE = document.querySelector('#form-update-usuario');
const MODAL_UPDATE_TITULO = document.querySelector('#update-modal-titulo');
const MODAL_UPDATE_TEXTO = document.querySelector('#update-modal-texto');
const BTN_UPDATE = document.querySelector('#btn-update');
const LINK_CERRAR_SESION = document.querySelector('#link-cerrar-sesion');
const BTN_LINK_CERRAR_SESION = document.querySelector('#link-cerrar-sesion-boton');

let idUsuarioActual = null;
let token = localStorage.getItem('token');

// COMPROBAR PERMISOS PARA NAVBAR
function comprobarPermisos() {
	let permiso = localStorage.getItem('permisos');
	if (permiso == 1) {
		LINK_ADMIN.classList.add('oculto');
	} else {
		LINK_ADMIN.classList.remove('oculto');
	}
}

comprobarPermisos();

// COMPROBAR TOKEN PARA OPERACIONES
function comprobarToken() {
	if (token) {
		idUsuarioActual = localStorage.getItem('idUsuario');
	}
}

comprobarToken();

function validarInput() {
	if (
		FORM_UPDATE.nombre_completo.value.length == 0 &&
		FORM_UPDATE.email.value.length == 0 &&
		FORM_UPDATE.direccion.value.length == 0 &&
		FORM_UPDATE.telefono.value.length == 0 &&
		FORM_UPDATE.contrasenia.value.length == 0
	) {
		BTN_UPDATE.disabled = false;
	}
}

validarInput();

function completarFormulario() {
	let auth = `Bearer ${token}`;
	try {
		const response = fetch(`/usuarios/${idUsuarioActual}`, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json', Authorization: auth },
		})
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				console.log(data);
				let [usuario] = data;
				FORM_UPDATE.nombre_completo.value = usuario.nombre_completo;
				FORM_UPDATE.email.value = usuario.email;
				FORM_UPDATE.direccion.value = usuario.direccion;
				FORM_UPDATE.telefono.value = usuario.telefono;
				return data;
			})
			.catch((error) => {
				return error;
			});
		return response;
	} catch (error) {
		return console.error(error);
	}
}

completarFormulario();

FORM_UPDATE.addEventListener('submit', function (e) {
	e.preventDefault();
	if (
		FORM_UPDATE.nombre_completo.value.length == 0 ||
		FORM_UPDATE.email.value.length == 0 ||
		FORM_UPDATE.direccion.value.length == 0 ||
		FORM_UPDATE.telefono.value.length == 0 ||
		FORM_UPDATE.contrasenia.value.length == 0
	) {
		MODAL_UPDATE_TITULO.innerText = 'Error';
		MODAL_UPDATE_TEXTO.innerText = 'Ningún campo puede quedar vacío';
	} else {
		let auth = `Bearer ${token}`;
		const payload = `{ "nombre_completo": "${FORM_UPDATE.nombre_completo.value}", "email": "${FORM_UPDATE.email.value}", "direccion": "${FORM_UPDATE.direccion.value}", "telefono": "${FORM_UPDATE.telefono.value}", "contrasenia": "${FORM_UPDATE.contrasenia.value}"}`;
		try {
			fetch(`/usuarios/${idUsuarioActual}`, {
				method: 'PUT',
				body: payload,
				headers: { 'Content-Type': 'application/json', Authorization: auth },
			})
				.then((response) => {
					if (response.status == 404) {
						MODAL_UPDATE_TITULO.innerText = 'Error';
						MODAL_UPDATE_TEXTO.innerText = 'Usuario no encontrado';
					}
					if (response.status == 500) {
						MODAL_UPDATE_TITULO.innerText = 'Error';
						MODAL_UPDATE_TEXTO.innerText = 'Intente nuevamente';
					}
					if (response.status == 403) {
						MODAL_UPDATE_TITULO.innerText = 'Error';
						MODAL_UPDATE_TEXTO.innerText = 'No tiene permisos para modificar a este usuario';
					}
					if (response.status == 201) {
						MODAL_UPDATE_TITULO.innerText = 'Cambios realizados con éxito';
						MODAL_UPDATE_TEXTO.innerText = 'Si tiene un pedido en curso y luego modificó sus datos, contáctenos.';
						return response.json();
					}
				})
				.then((data) => {
					return data;
				});
			return response;
		} catch (error) {
			return error;
		}
	}
});

BTN_LINK_CERRAR_SESION.addEventListener('click', (e) => {
	e.preventDefault();
	localStorage.clear();
	history.back();
});
