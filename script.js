document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA DA PÁGINA DE LOGIN ---
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            // Previne o envio padrão do formulário, que recarregaria a página
            event.preventDefault();

            // PEGUE OS ELEMENTOS DO FORMULÁRIO
            const secretWordInput = document.getElementById('secret-word');
            const errorMessage = document.getElementById('error-message');

            // !!! IMPORTANTE: Defina aqui a sua palavra secreta !!!
            const nossaPalavraSecreta = "amor"; // Troque "amor" pela senha de vocês

            // VERIFICA SE A SENHA ESTÁ CORRETA
            if (secretWordInput.value.trim().toLowerCase() === nossaPalavraSecreta) {
                // Se estiver correta, redireciona para a página inicial
                console.log("Login bem-sucedido! Redirecionando...");
                window.location.href = 'home.html';
            } else {
                // Se estiver errada, mostra a mensagem de erro
                errorMessage.style.display = 'block';
                secretWordInput.focus(); // Foca no campo de senha novamente
                console.log("Senha incorreta.");
            }
        });
    }

    // --- LÓGICA DA PÁGINA INICIAL (PARA NAVEGAÇÃO SUAVE) ---
    const navLinks = document.querySelectorAll('.sidebar a[href^="#"]');

    if (navLinks.length > 0) {
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();

                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

});