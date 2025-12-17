// HELPER
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// LÓGICA DE AUTENTICAÇÃO
function toggleAuth() {
    const card = document.getElementById('authCard');
    const title = document.getElementById('authTitle');
    if (!card) return; 

    if (card.dataset.mode === 'login') {
        card.dataset.mode = 'cadastro';
        title.innerText = 'Cadastro';
    } else {
        card.dataset.mode = 'login';
        title.innerText = 'Login';
    }
}

function handleLogin() {
    const emailInput = document.getElementById('emailLogin');
    const senhaInput = document.getElementById('senhaLogin');
    
    if (!emailInput || !senhaInput) return;

    const email = emailInput.value.trim();
    const senha = senhaInput.value;

    if (email === '') { alert('Digite seu Email.'); return; }
    if (!isValidEmail(email)) { alert('O formato do Email é inválido.'); return; }
    if (senha === '') { alert('Digite sua Senha.'); return; }

    localStorage.setItem('pagamentoStatus', 'aprovado');
    window.location.href = 'dashboard.html';
}

function iniciarPagamento() {
    const nomeInput = document.getElementById('nomeCompleto');
    const emailInput = document.getElementById('emailCadastro');
    const senhaInput = document.getElementById('senhaCadastro');
    const planoSelect = document.getElementById('plano');

    if (!nomeInput || !emailInput || !senhaInput || !planoSelect) return;

    const nome = nomeInput.value.trim();
    const email = emailInput.value.trim();
    const senha = senhaInput.value;
    const plano = planoSelect.value;
    
    if (nome === '' || email === '' || senha === '' || !plano) {
        alert('Preencha todos os campos obrigatórios.');
        return;
    }
    if (!isValidEmail(email)) {
        alert('O formato do Email é inválido.');
        return;
    }
    if (senha.length < 6) {
        alert('A senha deve ter pelo menos 6 caracteres.');
        return;
    }
    
    localStorage.setItem('planoSelecionado', plano);
    localStorage.setItem('pagamentoStatus', 'pendente');
    window.location.href = 'pagamento.html';
}

function confirmarPagamento() {
    localStorage.setItem('pagamentoStatus', 'aprovado');
    alert('Pagamento aprovado! Seja bem-vindo(a) à Physical Center!');
    window.location.href = 'dashboard.html';
}

function verificarAcesso() {
    if (localStorage.getItem('pagamentoStatus') !== 'aprovado') {
        alert('Acesso negado. Finalize o pagamento para acessar.');
        window.location.href = 'login.html';
    }
}

function logout() {
    localStorage.clear();
    window.location.href = 'index.html'; 
}

// LÓGICA DO CARROSSEL HOME (index.html)
function initHomeCarousel() {
    const carrossel = document.querySelector('.carrossel[data-carousel-id="home"]');
    if (!carrossel) return; 

    let slideIndex = 0;
    const slides = carrossel.querySelectorAll(".slide");
    const dots = carrossel.querySelectorAll(".dot");

    function showSlide(i) {
        slideIndex = (i + slides.length) % slides.length;
        slides.forEach(s => s.classList.remove("active")); 
        dots.forEach(d => d.classList.remove("active"));
        slides[slideIndex].classList.add("active"); 
        dots[slideIndex].classList.add("active");
    }

    carrossel.querySelector(".btn-next").onclick = () => showSlide(slideIndex + 1);
    carrossel.querySelector(".btn-prev").onclick = () => showSlide(slideIndex - 1);
    dots.forEach((dot, i) => { dot.onclick = () => showSlide(i); });

    showSlide(0);
    setInterval(() => showSlide(slideIndex + 1), 5000);
}

// LÓGICA DO CARROSSEL DASHBOARD (dashboard.html) - FUNCIONAL
function initDashboardCarousel() {
    const carrossel = document.querySelector('.carrossel[data-carousel-id="dashboard"]');
    if (!carrossel) return; 

    let index = 0;
    const slides = carrossel.querySelectorAll(".slide");
    const dots = carrossel.querySelectorAll(".dot");
    const slidesContainer = carrossel.querySelector(".slides");
    
    // Cálculo para translação em porcentagem (3 slides = 33.33%)
    const slideWidthPercentage = 100 / slides.length; 

    function showSlide(i) {
        index = (i + slides.length) % slides.length;
        
        dots.forEach(d => d.classList.remove("active"));
        dots[index].classList.add("active");
        
        // Aplica o movimento horizontal
        slidesContainer.style.transform = `translateX(${-index * slideWidthPercentage}%)`;
    }

    // Navegação manual
    carrossel.querySelector(".car-btn.next").onclick = () => showSlide(index + 1);
    carrossel.querySelector(".car-btn.prev").onclick = () => showSlide(index - 1);
    dots.forEach((dot, i) => (dot.onclick = () => showSlide(i)));

    showSlide(0);
    setInterval(() => showSlide(index + 1), 5000);
}


// INICIALIZAÇÃO GERAL E LÓGICA DE URL
document.addEventListener('DOMContentLoaded', () => {
    initHomeCarousel();
    initDashboardCarousel();

    // 1. Lógica para preencher o pagamento.html
    if (document.title.includes('Pagamento')) {
        const plano = localStorage.getItem('planoSelecionado');
        const detalhes = document.getElementById('detalhesPlano');
        
        if (detalhes && plano) {
            let nomePlano = '';
            let valorPlano = '';
            
            switch (plano) {
                case 'basico': nomePlano = 'Plano Básico'; valorPlano = 'R$ 79,90 / mês'; break;
                case 'pro': nomePlano = 'Plano Pro'; valorPlano = 'R$ 119,90 / mês'; break;
                case 'vip': nomePlano = 'Plano VIP'; valorPlano = 'R$ 199,90 / mês'; break;
                default: nomePlano = 'Plano Desconhecido'; valorPlano = 'N/A';
            }

            detalhes.innerHTML = `<p>Plano selecionado: <strong>${nomePlano}</strong></p><p>Valor total: <span class="valor">${valorPlano}</span></p>`;
        }
    }

    // 2. Lógica para pré-selecionar plano via URL (para links do index.html)
    if (document.title.includes('Login')) {
        const urlParams = new URLSearchParams(window.location.search);
        const planoUrl = urlParams.get('plano');
        const card = document.getElementById('authCard');
        const planoSelect = document.getElementById('plano');

        if (planoUrl && card && planoSelect) {
            card.dataset.mode = 'cadastro';
            document.getElementById('authTitle').innerText = 'Cadastro';
            planoSelect.value = planoUrl;
        }
    }
});