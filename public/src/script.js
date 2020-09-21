const FORM_LOGIN = document.querySelector('#form-login');
const FORM_REGISTRO = document.querySelector('#form-registro');
const MODAL_LOGIN = document.querySelector('#modal-login');
const BTN_MODAL_LOGIN = document.querySelector('#btn-modal');
const LINK_ADMIN = document.querySelector('#link-admin');
const LINK_REGISTRO = document.querySelector('#link-registro');
const LINK_USUARIO_DATOS = document.querySelector('#link-usuario-datos');
const LINK_USUARIO_PEDIDOS = document.querySelector('#link-usuario-pedidos');
const LINK_USUARIO_CARRITO = document.querySelector('#link-usuario-carrito');
const CONTENEDOR_LOGIN = document.querySelector('#login');
const CONTENEDOR_PRODUCTOS = document.querySelector('#contenedor-productos');
const CONTENEDOR_PRODUCTOS_LISTADO = document.querySelector('#listado-productos');
const BTN_AGREGAR_PRODUCTO = document.querySelectorAll('.btn-agregar-producto');
const CANTIDAD_SELECT = document.querySelectorAll('.custom-select');
const IMAGEN_PRODUCTO = document.querySelectorAll('.imagen-producto');
const TITULO_PRODUCTO = document.querySelectorAll('.titulo-producto');
const PRECIO_PRODUCTO = document.querySelectorAll('.precio-producto');
const PRODUCTO = document.querySelectorAll('.producto');

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
					mostrarProductos();
					return response.json();
				}
			})
			.then((data) => {
				if (data) {
					console.log(data);
					localStorage.setItem('token', data.token);
					LINK_REGISTRO.classList.add('oculto');
					LINK_USUARIO_DATOS.classList.remove('oculto');
					LINK_USUARIO_PEDIDOS.classList.remove('oculto');
					LINK_USUARIO_CARRITO.classList.remove('oculto');
					CONTENEDOR_LOGIN.classList.add('oculto');
					if (data.permisos == 2) {
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

function mostrarProductos() {
	let token = `Bearer ${localStorage.getItem('token')}`;
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

for (let i = 0; i < BTN_AGREGAR_PRODUCTO.length; i++) {
	const element = BTN_AGREGAR_PRODUCTO[i];
	element.addEventListener('click', (e) => {
		e.preventDefault();
		console.log(CANTIDAD_SELECT[i].value);
	});
}
