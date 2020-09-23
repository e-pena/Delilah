const FORM_LOGIN = document.querySelector('#form-login');
const FORM_REGISTRO = document.querySelector('#form-registro');
const MODAL_LOGIN = document.querySelector('#modal-login');
const BTN_MODAL_LOGIN = document.querySelector('#btn-modal');
const LINK_ADMIN = document.querySelector('#link-admin');
const LINK_REGISTRO = document.querySelector('#link-registro');
const LINK_USUARIO_DATOS = document.querySelector('#link-usuario-datos');
const LINK_USUARIO_PEDIDOS = document.querySelector('#link-usuario-pedidos');
const CONTENEDOR_LOGIN = document.querySelector('#login');
const CONTENEDOR_PRODUCTOS = document.querySelector('#contenedor-productos');
const CONTENEDOR_PRODUCTOS_LISTADO = document.querySelector('#listado-productos');
const BTN_AGREGAR_PRODUCTO = document.querySelectorAll('.btn-agregar-producto');
const CANTIDAD_SELECT = document.querySelectorAll('.cantidad-productos');
const IMAGEN_PRODUCTO = document.querySelectorAll('.imagen-producto');
const TITULO_PRODUCTO = document.querySelectorAll('.titulo-producto');
const PRECIO_PRODUCTO = document.querySelectorAll('.precio-producto');
const PRODUCTO = document.querySelectorAll('.producto');
const CONTENEDOR_PEDIDO_PREVIEW = document.querySelector('#productos-agregados');
const PEDIDO_PREVIEW = document.querySelector('#pedido-preview');
const MENSAJE_SIN_PRODUCTOS = document.querySelector('#sin-productos');
const COSTO_TOTAL = document.querySelector('#costo-total');
const DETALLE_PEDIDO = document.querySelector('#detalle-pedido');
const BTN_MEDIO_PAGO = document.querySelector('#medio-pago');
const BTN_CONFIRMAR_PEDIDO = document.querySelector('#btn-confirmar-pedido');
const MODAL_CONFIRMACION_PEDIDO_TITULO = document.querySelector('#modal-confirmacion-pedido-titulo');
const MODAL_CONFIRMACION_PEDIDO_TEXTO = document.querySelector('#modal-confirmacion-pedido-texto');

let listaProductos = [];
let listadoProductosPedidos = [];
let idUsuarioActual = null;
let precioTotal = 0;

class Producto {
	constructor(id, titulo, precio, imagen) {
		this.id = id;
		this.titulo = titulo;
		this.precio = precio;
		this.imagen = imagen;
	}
}

// FUNCIÓN MANTENER SESIÓN INICIADA

function comprobarToken() {
	let jwt = localStorage.getItem('token');
	if (jwt) {
		let tokens = jwt.split('.');
		let decoded = JSON.parse(atob(tokens[1]));
		idUsuarioActual = decoded.id;
		LINK_REGISTRO.classList.add('oculto');
		LINK_USUARIO_DATOS.classList.remove('oculto');
		LINK_USUARIO_PEDIDOS.classList.remove('oculto');
		CONTENEDOR_LOGIN.classList.add('oculto');
		mostrarProductos(jwt);
		if (decoded.permisos == 2) {
			LINK_ADMIN.classList.remove('oculto');
		} else {
			LINK_ADMIN.classList.add('oculto');
		}
	}
}

comprobarToken();

// FUNCIÓN PARA LOGUEARSE

FORM_LOGIN.addEventListener('submit', function (e) {
	e.preventDefault();
	const payload = `{ "username": "${FORM_LOGIN.username.value}", "contrasenia": "${FORM_LOGIN.contrasenia.value}"}`;
	try {
		fetch('/login', {
			method: 'POST',
			body: payload,
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
					console.log(data);
					jwt = data.token;
					let tokens = jwt.split('.');
					let decoded = JSON.parse(atob(tokens[1]));
					console.log(decoded);
					mostrarProductos(jwt);
					localStorage.setItem('token', jwt);
					localStorage.setItem('idUsuario', decoded.id);
					localStorage.setItem('permisos', decoded.permisos);
					LINK_REGISTRO.classList.add('oculto');
					LINK_USUARIO_DATOS.classList.remove('oculto');
					LINK_USUARIO_PEDIDOS.classList.remove('oculto');
					CONTENEDOR_LOGIN.classList.add('oculto');
					idUsuarioActual = decoded.id;
					if (decoded.permisos == 2) {
						LINK_ADMIN.classList.remove('oculto');
					} else {
						LINK_ADMIN.classList.add('oculto');
					}
					return data;
				}
				return data;
			});
		return response;
	} catch (error) {
		return error;
	}
});

// FUNCIÓN PARA REGISTRARSE

FORM_REGISTRO.addEventListener('submit', function (e) {
	e.preventDefault();
	const payload = `{ "username": "${FORM_REGISTRO.username.value}", "nombre_completo": "${FORM_REGISTRO.nombre_completo.value}", "email": "${FORM_REGISTRO.email.value}", "direccion": "${FORM_REGISTRO.direccion.value}", "telefono": "${FORM_REGISTRO.telefono.value}", "contrasenia": "${FORM_REGISTRO.contrasenia.value}", "permisos_id": 2}`;
	try {
		fetch('/register', {
			method: 'POST',
			body: payload,
			headers: { 'Content-Type': 'application/json' },
		})
			.then((response) => {
				if (response.status == 400) {
					MODAL_LOGIN.innerText = 'Información incompleta';
				}
				if (response.status == 409) {
					MODAL_LOGIN.innerText = 'El username ya existe, seleccione uno nuevo';
				}
				if (response.status == 201) {
					MODAL_LOGIN.innerText = 'Registro exitoso. Realice el LOGIN';
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
});

// MOSTRAR PLATOS DISPONIBLES

function mostrarProductos(jwt) {
	let token = `Bearer ${jwt}`;
	try {
		const response = fetch('/productos', {
			method: 'GET',
			headers: { 'Content-Type': 'application/json', Authorization: token },
		})
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				console.log(data);
				CONTENEDOR_PRODUCTOS.classList.remove('oculto');
				for (let i = 0; i < data.length; i++) {
					const element = data[i];
					console.log(element);
					PRODUCTO[i].classList.remove('oculto');
					IMAGEN_PRODUCTO[i].setAttribute('src', `${element.imagen}`);
					IMAGEN_PRODUCTO[i].setAttribute('alt', `${element.titulo}`);
					TITULO_PRODUCTO[i].innerHTML = element.titulo;
					PRECIO_PRODUCTO[i].innerHTML = `$${element.precio}`;
					let producto = new Producto(element.id, element.titulo, element.precio, element.imagen);
					listaProductos.push(producto);
				}
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

// AGREGAR PRODUCTOS AL CARRITO

for (let i = 0; i < BTN_AGREGAR_PRODUCTO.length; i++) {
	const element = BTN_AGREGAR_PRODUCTO[i];
	element.addEventListener('click', (e) => {
		e.preventDefault();
		if (!isNaN(CANTIDAD_SELECT[i].value)) {
			BTN_CONFIRMAR_PEDIDO.removeAttribute('disabled');
			let cantidad = Number(CANTIDAD_SELECT[i].value);
			let producto = listaProductos[i];
			MENSAJE_SIN_PRODUCTOS.classList.add('oculto');
			let precioLineaPedido = cantidad * producto.precio;
			let lineaPedido = document.createElement('div');
			lineaPedido.innerHTML = `<img src="${producto.imagen}" alt="${producto.titulo}" style="width: 2em; height: 2em; border: solid 1px black"/> <span><strong>${producto.titulo}</strong> - ${cantidad} x $${producto.precio} = ${precioLineaPedido}</span>`;
			precioTotal += precioLineaPedido;
			DETALLE_PEDIDO.appendChild(lineaPedido);
			let productoPedido = `{ "id": ${producto.id}, "cantidad": ${cantidad} }`;
			listadoProductosPedidos.push(productoPedido);
			console.log(listadoProductosPedidos);
		}
		COSTO_TOTAL.innerHTML = '';
		COSTO_TOTAL.innerHTML = `<strong>Costo total:</strong> $${precioTotal}`;
	});
}

// CONFIRMAR PEDIDO

BTN_CONFIRMAR_PEDIDO.addEventListener('click', (e) => {
	e.preventDefault();
	let token = `Bearer ${localStorage.getItem('token')}`;
	const payload = `{ "estado_id": 1, "productos": [${listadoProductosPedidos}], "pago_id": ${BTN_MEDIO_PAGO.value}}`;
	console.log(payload);
	try {
		fetch(`/usuarios/${idUsuarioActual}/pedidos`, {
			method: 'POST',
			body: payload,
			headers: { 'Content-Type': 'application/json', Authorization: token },
		})
			.then((response) => {
				if (response.status == 500) {
					MODAL_CONFIRMACION_PEDIDO_TITULO.innerText = 'No se pudo crear el pedido';
					MODAL_CONFIRMACION_PEDIDO_TEXTO.innerText = 'Intente nuevamente';
				}
				if (response.status == 403) {
					MODAL_CONFIRMACION_PEDIDO_TITULO.innerText = 'No se pudo crear el pedido';
					MODAL_CONFIRMACION_PEDIDO_TEXTO.innerText = 'Operación no autorizada';
				}
				if (response.status == 201) {
					MODAL_CONFIRMACION_PEDIDO_TITULO.innerText = 'Su pedido se ha realizado con éxito';
					if (BTN_MEDIO_PAGO.value == 1) {
						MODAL_CONFIRMACION_PEDIDO_TEXTO.innerText = 'Recibirá un mail de confirmación';
					}
					if (BTN_MEDIO_PAGO.value == 2) {
						MODAL_CONFIRMACION_PEDIDO_TEXTO.innerText =
							'Recibirá un mail de confirmación con las instrucciones para realizar el pago';
					}
					return response.json();
				}
			})
			.then((data) => {
				listaProductos = [];
				listadoProductosPedidos = [];
				precioTotal = 0;
				BTN_CONFIRMAR_PEDIDO.setAttribute('disabled', true);
				MENSAJE_SIN_PRODUCTOS.classList.remove('oculto');
				DETALLE_PEDIDO.textContent = '';
				COSTO_TOTAL.textContent = '';
				return data;
			});
		return response;
	} catch (error) {
		return error;
	}
});
