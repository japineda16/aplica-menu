module.exports = async (req, res, next) => {
    if (!req.headers || !req.headers.authorization) {
        return res.badRequest({err: 'there is not Authorization headers'});
    }
    const token = req.headers.authorization;
    const validation = AuthenticationService.JWTVerify(token);
    const user = await Users.findOne({id: validation.user});

    if (!user) {
        return next({err: 'Unauthorized'});
    }

    req.user = user;
    next();
};
