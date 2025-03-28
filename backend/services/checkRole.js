require('dotenv').config();


function checkRole(req, res, next) {

    const role = req.user?.role;

    if (!role) {
        return res.status(403).json({ error: 'Acesso restrito' }); 
    }

    if (role === process.env.USER_INFO) {
        next();
    } else {
        console.log("Role", role)
        return res.status(403).json({ error: 'Acesso negado' });
    }

}

module.exports = { checkRole };
