const authoriseRoles = (tokenRole, authorisedRoles) => {
    if (authorisedRoles.indexOf(tokenRole) === -1) {
        res.status(401).json({ msg: "Not Authorised" })
    }
    return true
};

module.exports = authoriseRoles