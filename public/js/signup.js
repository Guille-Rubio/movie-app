const showPasswordCheckbox = document.querySelector('#show-password>input[type=checkbox]');
const passwordInput = document.querySelector('#password');
const passwordStrengthMessage = document.querySelector('#password-strength-message');

const emailInput = document.querySelector('#email');

const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    return passwordRegex.test(password);
};

const validateEmail = (email) => {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,7}$/;
    return emailRegex.test(email);
}

showPasswordCheckbox.addEventListener('input', (event) => {
    if (passwordInput.type === "password") {
        passwordInput.type = "text"
    } else {
        passwordInput.type = "password"
    }
});

emailInput.addEventListener('focus', () => {
    emailInput.classList.remove("invalid-text-input");
})


emailInput.addEventListener('input', (event) => {
    event.preventDefault();
    const validEmail = validateEmail(emailInput.value);
    if (validEmail) {
        emailInput.classList.add("valid-text-input");
    } else {
        emailInput.classList.remove("valid-text-input");
    }
});

emailInput.addEventListener('blur', () => {
    const validEmail = validateEmail(emailInput.value);
    if (!validEmail) {
        emailInput.classList.toggle("invalid-text-input");
    }
});

passwordInput.addEventListener('focus', () => {
    passwordInput.classList.remove("invalid-text-input");
});

passwordInput.addEventListener('input', (event) => {
    event.preventDefault();
    const validPassword = validatePassword(passwordInput.value);
    if (passwordInput.value.length > 7) {
        if (validPassword) {
            passwordStrengthMessage.innerHTML = "Valid password"
            passwordInput.classList.toggle("valid-text-input");
        } else {
            passwordStrengthMessage.innerHTML = "Password must contain Uppercase, lowercase, numbers and special characters and be 8 charaters long at least."
            passwordInput.classList.remove("valid-text-input");
        }
    }

});

passwordInput.addEventListener('blur', () => {
    passwordStrengthMessage.innerHTML = "";
    const validPassword = validatePassword(passwordInput.value);
    if (!validPassword) {
        passwordInput.classList.toggle("invalid-text-input");
    }
});



