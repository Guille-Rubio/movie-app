const showPasswordCheckbox = document.querySelector('#show-password>input[type=checkbox]');
const passwordInput = document.querySelector('.login-form>input[type=password]');


showPasswordCheckbox.addEventListener('change', (event) => {
    if (passwordInput.type === "password") {
        passwordInput.type = "text"
    } else {
        passwordInput.type = "password"
    }
})