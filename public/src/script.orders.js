const LINK_ADMIN = document.querySelector('#link-admin');
const LINK_CERRAR_SESION = document.querySelector('#link-cerrar-sesion');
const BTN_LINK_CERRAR_SESION = document.querySelector('#link-cerrar-sesion-boton');
const TABLA_USUARIO_PEDIDOS = document.querySelector('#tabla-usuario-pedidos');

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
					let btnCancelar = document.createElement('button');
					btnCancelar.innerHTML = 'Cancelar';
					btnCancelar.setAttribute('type', 'button');
					btnCancelar.setAttribute('data-toggle', 'modal');
					btnCancelar.setAttribute('data-target', '#cancelar-modal');
					btnCancelar.classList.add('btn');
					btnCancelar.classList.add('btn-danger');
					btnCancelar.addEventListener('click', (e) => {
						e.preventDefault();
						if (element.estado == 'Nuevo' || element.estado == 'Confirmado' || element.estado == 'Preparando') {
							cancelarPedido(element.id);
							TABLA_USUARIO_PEDIDOS.innerHTML = `<thead>
							<tr>
								<th scope="col">Tu orden</th>
								<th scope="col">Costo</th>
								<th scope="col">Forma de pago</th>
								<th scope="col">Estado</th>
							</tr>
						</thead>`;
							cargarPedidosUsuario();
						}
					});
					let pedido = document.createElement('tr');
					pedido.innerHTML = `<th scope="row" class="table-success">${element.descripcion}</th>
					<td class="table-success">${element.costo}</td>
					<td class="table-success">${element.forma_pago}</td>
					<td class="table-success">${element.estado}</td>`;
					TABLA_USUARIO_PEDIDOS.appendChild(pedido);
					TABLA_USUARIO_PEDIDOS.appendChild(btnCancelar);
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

function cancelarPedido(idPedido) {
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
				// location.reload();
				return data;
			});
		return response;
	} catch (error) {
		return error;
	}
}
