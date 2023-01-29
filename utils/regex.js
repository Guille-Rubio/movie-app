//Que contenga @ y un .
const validateEmail = (email) => {
    const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,7}$/;
    return regexEmail.test(email.toLowerCase());
};
//minimo 8 caracteres, minusculas, mayusculas, caracter especial y numero
const validatePassword = (password) => {
    const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regexPassword.test(password);
};
//solo letras y espacios (se usa en nombre y en apellido)
const validateName = (name) => {
    const regexName = /^[a-zA-Z\s]*$/;
    return regexName.test(name)
}

const regex = {
    validateEmail,
    validatePassword,
    validateName
};

module.exports = regex;

