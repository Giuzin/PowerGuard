const serverURL = "http://54.172.89.130:3000/api/v1/auth/refresh";

export function refreshToken(){
    fetch(serverURL, {
        method: "PUT",
        headers: {
            'Content-Type': "application/json",
            'Authorization': `Bearer ${localStorage.getItem('refreshToken')}`
        }
    }).then(response => {
        if (response.status >= 200 && response.status <= 299) {
            response.json().then(token => {
                localStorage.setItem('token', token.accessToken);
                localStorage.setItem('refreshToken', token.refreshToken);
            });
        } else {
            window.location.href = "login.html";
            console.warn("Token Inválido ou Expirado");
        }
    }).catch(e => console.error("Erro ao atualizar o token"))
}