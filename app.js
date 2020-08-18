const express = require('express');
const server = express();

server.use(express.json());

server.use((err, req, res, next) => {
	if (err) {
		res.status(500).send('Error en el servidor');
	}
	next();
});

server.listen(3000, () => {
	console.log('Server run');
});
