export function initLoginPage() {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const secretWordInput = document.getElementById('secret-word');
        const errorMessage = document.getElementById('error-message');
        const nossaPalavraSecreta = "amor"; // Troque pela senha de vocês

        if (secretWordInput.value.trim().toLowerCase() === nossaPalavraSecreta) {
            // Em uma SPA, não usamos window.location.href para navegação interna
            // O ideal é que o próprio roteador gerencie isso.
            // Por enquanto, vamos manter o redirecionamento, mas o ideal seria
            // chamar uma função do roteador: onNavigate('/momentos');
            window.location.href = '/momentos'; 
        } else {
            errorMessage.style.display = 'block';
            secretWordInput.focus();
        }
    });
}
