const LINK_ADMIN = document.querySelector('#link-admin');
const LINK_CERRAR_SESION = document.querySelector('#link-cerrar-sesion');
const BTN_LINK_CERRAR_SESION = document.querySelector('#link-cerrar-sesion-boton');
const TABLA_USUARIO_PEDIDOS = document.querySelector('#tabla-usuario-pedidos');
const MODAL_CANCELAR_TITULO = document.querySelector('#cancelar-modal-titulo');
const MODAL_CANCELAR_TEXTO = document.querySelector('#cancelar-modal-texto');
const MODAL_BTN = document.querySelector('#btn-modal');

let idUsuarioActual = null;
let token = localStorage.getItem('token');
let listadoPedidos = [];

// CERRAR SESIÓN
BTN_LINK_CERRAR_SESION.addEventListener('click', (e) => {
	e.preventDefault();
	localStorage.clear();
	window.location.replace('./index.html');
});

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

// CARGAR PEDIDOS
function cargarPedidosUsuario() {
	let auth = `Bearer ${token}`;
	try {
		const response = fetch(`/usuarios/${idUsuarioActual}/pedidos`, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json', Authorization: auth },
		})
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				for (let i = data.length - 1; i >= 0; i--) {
					const element = data[i].datosPedido;
					let pedido = document.createElement('tr');
					if (element.estado == 'Nuevo' || element.estado == 'Confirmado' || element.estado == 'Preparando') {
						pedido.innerHTML = `<th scope="row" class="table-success">${element.descripcion}</th>
					<td class="table-success">${element.costo}</td>
					<td class="table-success">${element.forma_pago}</td>
					<td class="table-success">${element.estado}</td>
					<td class="table-success"><button type="button" class="btn btn-danger" data-toggle="modal" data-target="#cancelar-modal" onclick="cancelarPedido(${element.id})">Cancelar</button></td>`;
					} else {
						pedido.innerHTML = `<th scope="row" class="table-success">${element.descripcion}</th>
					<td class="table-success">${element.costo}</td>
					<td class="table-success">${element.forma_pago}</td>
					<td class="table-success">${element.estado}</td>
					<td class="table-success">Inhabilitado</td>`;
					}
					TABLA_USUARIO_PEDIDOS.appendChild(pedido);
				}
				return data;
			});
		return response;
	} catch (error) {
		return console.error(error);
	}
}

cargarPedidosUsuario();

// CANCELAR PEDIDO

function cancelarPedido(id) {
	if (window.confirm('¿Realmente querés cancelar el pedido?')) {
		cancelarPedidoPost(id);
	} else {
		MODAL_CANCELAR_TITULO.innerText = 'Seguiremos preparando su pedido';
		MODAL_CANCELAR_TEXTO.innerText = 'Gracias por confiar en nosotros';
	}
}

function cancelarPedidoPost(idPedido) {
	let auth = `Bearer ${token}`;
	const payload = '{ "estado_id": 5 }';
	try {
		fetch(`/usuarios/${idUsuarioActual}/pedidos/${idPedido}`, {
			method: 'PATCH',
			body: payload,
			headers: { 'Content-Type': 'application/json', Authorization: auth },
		})
			.then((response) => {
				console.log(response);
			})
			.then((data) => {
				return data;
			});
		return response;
	} catch (error) {
		return error;
	}
}

MODAL_BTN.addEventListener('click', (e) => {
	e.preventDefault();
	TABLA_USUARIO_PEDIDOS.innerHTML = '';
	cargarPedidosUsuario();
});
