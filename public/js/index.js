const showPasswordCheckbox = document.querySelector('#show-password>input[type=checkbox]');
const passwordInput = document.querySelector('.login-form>input[type=password]');
const loginMessage = document.querySelector('#login-message')

//show password input
showPasswordCheckbox.addEventListener('change', (event) => {
    if (passwordInput.type === "password") {
        passwordInput.type = "text"
    } else {
        passwordInput.type = "password"
    }
})

//Clear failed login message
setTimeout(() => loginMessage.innerHTML = "", 3000);
