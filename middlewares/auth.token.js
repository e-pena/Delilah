const jwt = require('jsonwebtoken');
const claveSecreta = 'asad92929nnadasaappqwd';

function verificarTokenUsuario(req, res, next) {
	if (req.path != '/login' && req.path != '/register') {
		if (req.headers.authorization) {
			let token = req.headers.authorization.split(' ')[1];
			jwt.verify(token, claveSecreta, function (error, decoded) {
				if (error) {
					return res.status(403).json({ message: 'Sin permisos' });
				} else {
					if (decoded.permisos == 1 || decoded.permisos_id == 2) {
						next();
					} else {
						return res.status(403).json({ message: 'Sin permisos' });
					}
				}
			});
		}
	} else {
		next();
	}
}

function verificarTokenAdmin(req, res, next) {
	if (req.path != '/login' && req.path != '/register') {
		if (req.headers.authorization) {
			let token = req.headers.authorization.split(' ')[1];
			jwt.verify(token, claveSecreta, function (error, decoded) {
				console.log(decoded);
				if (error) {
					return res.status(403).send({ message: 'Sin permisos' });
				} else {
					if (decoded.permisos == 2) {
						next();
					} else {
						return res.status(403).send({ message: 'Sin permisos' });
					}
				}
			});
		}
	} else {
		next();
	}
}

module.exports = { verificarTokenAdmin, verificarTokenUsuario, claveSecreta };
