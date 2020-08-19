const express = require('express');
const server = express();
const routeUsuarios = require('./routes/usuarios.route');
const routeProductos = require('./routes/productos.route');
const routePedidos = require('./routes/pedidos.route');
const routeAuthLogin = require('./routes/auth.login.route');
const routeAuthRegister = require('./routes/auth.register.route');

server.use(express.json());

server.use('/usuarios', routeUsuarios);
server.use('/productos', routeProductos);
server.use('/pedidos', routePedidos);
server.use('/login', routeAuthLogin);
server.use('/register', routeAuthRegister);

server.use((err, req, res, next) => {
	if (err) {
		res.status(500).send('Error en el servidor');
	}
	next();
});

server.listen(3000, () => {
	console.log('Server run');
});
