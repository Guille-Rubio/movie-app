const showPasswordCheckbox = document.querySelector('#show-password>input[type=checkbox]');
const passwordInput = document.querySelector('#password');
const password2Input = document.querySelector('#password2');


showPasswordCheckbox.addEventListener('change', (event) => {
    if (passwordInput.type === "password") {
        passwordInput.type = "text"
        password2Input.type = "text"
    } else {
        passwordInput.type = "password"
        password2Input.type = "password"
    }
})