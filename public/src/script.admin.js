const LINK_ADMIN = document.querySelector('#link-admin');
const LINK_CERRAR_SESION = document.querySelector('#link-cerrar-sesion');
const BTN_LINK_CERRAR_SESION = document.querySelector('#link-cerrar-sesion-boton');
const TABLA_USUARIOS = document.querySelector('#usuarios-tabla-cuerpo');
const BTN_MODAL_USUARIO = document.querySelector('#btn-modal-usuario');
const MODAL_USUARIO_TITULO = document.querySelector('#usuario-modal-titulo');
const MODAL_USUARIO_TEXTO = document.querySelector('#usuario-modal-texto');
const TABLA_PRODUCTOS = document.querySelector('#productos-tabla-cuerpo');
const BTN_MODAL_PRODUCTO = document.querySelector('#btn-modal-producto');
const MODAL_PRODUCTO = document.querySelector('#modal-editar-producto');
const MODAL_PRODUCTO_TITULO = document.querySelector('#producto-modal-titulo');
const MODAL_PRODUCTO_TEXTO = document.querySelector('#producto-modal-texto');
const FORM_UPDATE = document.querySelector('#form-update-producto');
const BTN_UPDATE = document.querySelector('#btn-update-producto');
const TABLA_PEDIDOS = document.querySelector('#pedidos-tabla-cuerpo');
const FORM_ESTADO_PEDIDO = document.querySelector('#form-update-pedido');
const MODAL_PEDIDO_TITULO = document.querySelector('#pedido-modal-titulo');
const MODAL_PEDIDO_TEXTO = document.querySelector('#pedido-modal-texto');
const MODAL_PEDIDO = document.querySelector('#modal-editar-pedido');
const FORM_CREACION_PRODUCTO = document.querySelector('#form-crear-producto');
const MODAL_CREACION_PRODUCTO = document.querySelector('#modal-productos-creacion');
const BTN_CREAR_PRODUCTO = document.querySelector('#btn-crear-producto');
const INPUTS = FORM_CREACION_PRODUCTO.getElementsByTagName('input');

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

// CARGAR PRODUCTOS

function cargarProductos() {
	let auth = `Bearer ${token}`;
	try {
		const response = fetch(`/productos`, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json', Authorization: auth },
		})
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				TABLA_PRODUCTOS.innerHTML = '';
				for (let i = 0; i < data.length; i++) {
					const element = data[i];
					let producto = document.createElement('tr');
					producto.innerHTML = `<th scope="row" class="table-success">${element.id}</th>
					<td class="table-success">${element.titulo}</td>
					<td class="table-success">${element.precio}</td>
					<td class="table-success"><img src="${element.imagen}" alt="${element.titulo}"/></td>
					<td class="table-success"><button type="button" class="btn btn-primary" data-toggle="modal" data-target="#modal-editar-producto" onclick="editarProducto(${element.id})">Editar</button></td>
                    <td class="table-success"><button type="button" class="btn btn-danger" data-toggle="modal" data-target="#producto-modal" onclick="borrarProducto(${element.id})">Eliminar</button></td>`;
					TABLA_PRODUCTOS.appendChild(producto);
				}
				return data;
			});
		return response;
	} catch (error) {
		return console.error(error);
	}
}

cargarProductos();

// ELIMINAR PRODUCTO

function borrarProducto(id) {
	if (window.confirm('¿Realmente quiere eliminar el producto?')) {
		let auth = `Bearer ${token}`;
		try {
			fetch(`/productos/${id}`, {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json', Authorization: auth },
			})
				.then((response) => {
					if (response.status == 404) {
						MODAL_PRODUCTO_TITULO.innerText = 'Error';
						MODAL_PRODUCTO_TEXTO.innerText = 'Producto no encontrado';
					}
					if (response.status == 500) {
						MODAL_PRODUCTO_TITULO.innerText = 'Error';
						MODAL_PRODUCTO_TEXTO.innerText = 'Ha ocurrido un error';
					}
					if (response.status == 403) {
						MODAL_PRODUCTO_TITULO.innerText = 'Sin permisos';
						MODAL_PRODUCTO_TEXTO.innerText = 'No puede eliminar este producto';
					}
					if (response.status == 200) {
						MODAL_PRODUCTO_TITULO.innerText = 'Operación exitosa';
						MODAL_PRODUCTO_TEXTO.innerText = 'El producto ha sido borrado';
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
		MODAL_PRODUCTO_TITULO.innerText = 'Operación cancelada';
		MODAL_PRODUCTO_TEXTO.innerText = 'No se ha borrado ningún producto';
	}
}

// EDITAR PRODUCTO

function completarFormulario(id) {
	let auth = `Bearer ${token}`;
	try {
		const response = fetch(`/productos/${id}`, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json', Authorization: auth },
		})
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				console.log(data);
				let [producto] = data;
				FORM_UPDATE.titulo.value = producto.titulo;
				FORM_UPDATE.precio.value = producto.precio;
				FORM_UPDATE.imagen.value = producto.imagen;
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

function editarProducto(id) {
	completarFormulario(id);
	FORM_UPDATE.addEventListener('submit', function (e) {
		e.preventDefault();
		$(MODAL_PRODUCTO).modal('hide');
		if (
			FORM_UPDATE.titulo.value.length == 0 ||
			FORM_UPDATE.precio.value.length == 0 ||
			FORM_UPDATE.imagen.value.length == 0
		) {
			alert('Los campos no pueden quedar vacíos');
		} else {
			let auth = `Bearer ${token}`;
			const payload = `{ "titulo": "${FORM_UPDATE.titulo.value}", "precio": "${FORM_UPDATE.precio.value}", "imagen": "${FORM_UPDATE.imagen.value}"}`;
			try {
				fetch(`/productos/${id}`, {
					method: 'PUT',
					body: payload,
					headers: { 'Content-Type': 'application/json', Authorization: auth },
				})
					.then((response) => {
						cargarProductos();
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
}

// VALIDAR CAMPOS DE CREACIÓN DE PRODUCTO

for (let i = 0; i < INPUTS.length; i++) {
	const element = INPUTS[i];
	element.addEventListener('keyup', (e) => {
		e.preventDefault();
		validarInput();
	});
}

function validarInput() {
	if (
		FORM_CREACION_PRODUCTO.titulo.value.length == 0 ||
		FORM_CREACION_PRODUCTO.precio.value.length == 0 ||
		FORM_CREACION_PRODUCTO.imagen.value.length == 0
	) {
		BTN_CREAR_PRODUCTO.disabled = true;
	} else {
		BTN_CREAR_PRODUCTO.disabled = false;
	}
}

validarInput();

// CREAR PRODUCTO

FORM_CREACION_PRODUCTO.addEventListener('submit', (e) => {
	e.preventDefault();
	$(MODAL_CREACION_PRODUCTO).modal('hide');
	if (
		FORM_CREACION_PRODUCTO.titulo.value.length == 0 ||
		FORM_CREACION_PRODUCTO.precio.value.length == 0 ||
		FORM_CREACION_PRODUCTO.imagen.value.length == 0
	) {
		alert('Los campos no pueden quedar vacíos');
	} else {
		let auth = `Bearer ${token}`;
		const payload = `{ "titulo": "${FORM_CREACION_PRODUCTO.titulo.value}", "precio": ${FORM_CREACION_PRODUCTO.precio.value}, "imagen": "${FORM_CREACION_PRODUCTO.imagen.value}"}`;
		try {
			fetch(`/productos`, {
				method: 'POST',
				body: payload,
				headers: { 'Content-Type': 'application/json', Authorization: auth },
			})
				.then((response) => {
					cargarProductos();
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

// CARGAR PEDIDOS

function cargarPedidos() {
	let auth = `Bearer ${token}`;
	try {
		const response = fetch(`/pedidos`, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json', Authorization: auth },
		})
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				TABLA_PEDIDOS.innerHTML = '';
				for (let i = 0; i < data.length; i++) {
					const element = data[i].datosPedido;
					let pedido = document.createElement('tr');
					pedido.innerHTML = `<th scope="row" class="table-success">${element.id}</th>
					<td class="table-success">${element.descripcion}</td>
					<td class="table-success">${element.costo}</td>
					<td class="table-success">${element.estado}</td>
					<td class="table-success">${element.forma_pago}</td>
					<td class="table-success">${element.nombre_completo}</td>
					<td class="table-success">${element.direccion}</td>
					<td class="table-success">${element.telefono}</td>
					<td class="table-success">${element.email}</td>
					<td class="table-success"><button type="button" class="btn btn-primary" data-toggle="modal" data-target="#modal-editar-pedido" onclick="cambiarEstado(${element.id})">Actualizar</button></td>`;
					TABLA_PEDIDOS.appendChild(pedido);
				}
				return data;
			});
		return response;
	} catch (error) {
		return console.error(error);
	}
}

cargarPedidos();

// ACTUALIZAR ESTADO

function cambiarEstado(id) {
	FORM_ESTADO_PEDIDO.addEventListener('submit', function (e) {
		e.preventDefault();
		$(MODAL_PEDIDO).modal('hide');
		let auth = `Bearer ${token}`;
		const payload = `{ "estado_id": "${FORM_ESTADO_PEDIDO.estado.value}" }`;
		try {
			fetch(`/pedidos/${id}`, {
				method: 'PATCH',
				body: payload,
				headers: { 'Content-Type': 'application/json', Authorization: auth },
			})
				.then((response) => {
					cargarPedidos();
				})
				.then((data) => {
					return data;
				});
			return response;
		} catch (error) {
			return error;
		}
	});
}
