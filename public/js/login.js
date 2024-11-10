const serverURL = "http://54.172.89.130/api/v1/auth/signin";

document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const rememberPassword = document.getElementById('rememberPassword').checked;
    const errorMessage = document.getElementById('errorMessage');

    fetch(serverURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "username": username,
            "password": password
        }),
    })
        .then(response => {
            if (response.status >= 200 && response.status <= 299) {
                response.json().then(token => {
                    localStorage.setItem('accessToken', token.accessToken);
                    localStorage.setItem('refreshToken', token.refreshToken);
                });
                errorMessage.textContent = '';
                if (rememberPassword) {
                    localStorage.setItem('rememberedUser', username);
                }
                showSuccessMessage('Login bem-sucedido!');
                window.location.href = "index.html";
            } else {
                errorMessage.textContent = 'Usuário ou senha inválidos. Tente novamente.';
            }
        })
        .catch(error => {
            console.error('Erro ao fazer login:', error);
            errorMessage.textContent = 'Erro ao conectar-se ao servidor. Tente novamente mais tarde.';
        });
});

window.addEventListener('load', function () {
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
        document.getElementById('username').value = rememberedUser;
        document.getElementById('rememberPassword').checked = true;
    }
});

function showSuccessMessage(message) {
    const successMessage = document.getElementById('successMessage');
    successMessage.textContent = message;
    successMessage.style.display = 'block';
    successMessage.style.opacity = 1;

    setTimeout(() => {
        successMessage.style.opacity = 0;
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 500);
    }, 3000); // Dura 3 segundos.
}