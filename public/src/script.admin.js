const LINK_ADMIN = document.querySelector('#link-admin');
const LINK_CERRAR_SESION = document.querySelector('#link-cerrar-sesion');
const BTN_LINK_CERRAR_SESION = document.querySelector('#link-cerrar-sesion-boton');
const TABLA_USUARIOS = document.querySelector('#usuarios-tabla-cuerpo');
const BTN_MODAL_USUARIO = document.querySelector('#btn-modal-usuario');
const MODAL_USUARIO_TITULO = document.querySelector('#usuario-modal-titulo');
const MODAL_USUARIO_TEXTO = document.querySelector('#usuario-modal-texto');

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

// CERRAR SESIÓN

BTN_LINK_CERRAR_SESION.addEventListener('click', (e) => {
	e.preventDefault();
	localStorage.clear();
	window.location.replace('./index.html');
});

// CARGAR USUARIOS
function cargarUsuarios() {
	let auth = `Bearer ${token}`;
	try {
		const response = fetch(`/usuarios`, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json', Authorization: auth },
		})
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				for (let i = 0; i < data.length; i++) {
					const element = data[i];
					let usuario = document.createElement('tr');
					if (element.permisos_id == 1) {
						usuario.innerHTML = `<th scope="row" class="table-success">${element.id}</th>
					<td class="table-success">${element.username}</td>
					<td class="table-success">${element.nombre_completo}</td>
					<td class="table-success">${element.email}</td>
					<td class="table-success">${element.direccion}</td>
					<td class="table-success">${element.telefono}</td>
					<td class="table-success"><button type="button" class="btn btn-danger" data-toggle="modal" data-target="#usuario-modal" onclick="borrarUsuario(${element.id})">Eliminar</button></td>
                    <td class="table-success"><button type="button" class="btn btn-dark" data-toggle="modal" data-target="#usuario-modal" onclick="convertirUsuarioEnAdmin(${element.id})">Hacer Admin</button></td>`;
					}
					if (element.permisos_id == 2) {
						usuario.innerHTML = `<th scope="row" class="table-success">${element.id}</th>
					<td class="table-success">${element.username}</td>
					<td class="table-success">${element.nombre_completo}</td>
					<td class="table-success">${element.email}</td>
					<td class="table-success">${element.direccion}</td>
					<td class="table-success">${element.telefono}</td>
					<td class="table-success"><button type="button" class="btn btn-danger" data-toggle="modal" data-target="#usuario-modal" onclick="borrarUsuario(${element.id})">Eliminar</button></td>
                    <td class="table-success">Administrador</td>`;
					}
					TABLA_USUARIOS.appendChild(usuario);
				}
				return data;
			});
		return response;
	} catch (error) {
		return console.error(error);
	}
}

cargarUsuarios();

// ELIMINAR USUARIO

function borrarUsuario(id) {
	if (window.confirm('¿Realmente querés eliminar al usuario?')) {
		let auth = `Bearer ${token}`;
		try {
			fetch(`/usuarios/${id}`, {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json', Authorization: auth },
			})
				.then((response) => {
					if (response.status == 404) {
						MODAL_USUARIO_TITULO.innerText = 'Error';
						MODAL_USUARIO_TEXTO.innerText = 'Usuario no encontrado';
					}
					if (response.status == 500) {
						MODAL_USUARIO_TITULO.innerText = 'Error';
						MODAL_USUARIO_TEXTO.innerText = 'Ha ocurrido un error';
					}
					if (response.status == 403) {
						MODAL_USUARIO_TITULO.innerText = 'Sin permisos';
						MODAL_USUARIO_TEXTO.innerText = 'No puede eliminar a este usuario';
					}
					if (response.status == 200) {
						MODAL_USUARIO_TITULO.innerText = 'Operación exitosa';
						MODAL_USUARIO_TEXTO.innerText = 'El usuario ha sido borrado';
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
	} else {
		MODAL_USUARIO_TITULO.innerText = 'Operación cancelada';
		MODAL_USUARIO_TEXTO.innerText = 'No se ha borrado a ningún usuario';
	}
}

// HACER ADMIN A UN USUARIO

function convertirUsuarioEnAdmin(id) {
	let auth = `Bearer ${token}`;
	const payload = '{ "permisos_id": 2 }';
	try {
		fetch(`/usuarios/${id}`, {
			method: 'PATCH',
			body: payload,
			headers: { 'Content-Type': 'application/json', Authorization: auth },
		})
			.then((response) => {
				if (response.status == 404) {
					MODAL_USUARIO_TITULO.innerText = 'Error';
					MODAL_USUARIO_TEXTO.innerText = 'Usuario no encontrado';
				}
				if (response.status == 500) {
					MODAL_USUARIO_TITULO.innerText = 'Error';
					MODAL_USUARIO_TEXTO.innerText = 'Ha ocurrido un error';
				}
				if (response.status == 403) {
					MODAL_USUARIO_TITULO.innerText = 'Sin permisos';
					MODAL_USUARIO_TEXTO.innerText = 'No puede modificar a este usuario';
				}
				if (response.status == 201) {
					MODAL_USUARIO_TITULO.innerText = 'Operación exitosa';
					MODAL_USUARIO_TEXTO.innerText = 'El usuario ahora es administrador';
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

BTN_MODAL_USUARIO.addEventListener('click', (e) => {
	e.preventDefault();
	TABLA_USUARIOS.innerHTML = '';
	cargarUsuarios();
});
