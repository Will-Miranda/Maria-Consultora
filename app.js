/**
 * Maria ConsultoraV - Landing Page Application
 * JavaScript puro para funcionalidades dinâmicas
 */

// Dados centralizados da aplicação
const APP_DATA = {
    produtos: [
        {
            id: 1,
            nome: "Secaps Black Chá",
            subnome: "Secaps Black Chá é um suplemento alimentar em chá solúvel desenvolvido para quem busca emagrecimento saudável, melhora do intestino e mais bem-estar no dia a dia.",
            imagem: "prod1.jpeg",
            descricao: [
                "Prático e fácil de usar, o Secaps Black Chá pode ser consumido 1 vez ao dia, com água gelada, em temperatura ambiente ou com gás, adaptando-se à sua rotina." + "<br>" +
                "Sua fórmula combina ingredientes naturais e funcionais como psyllium, hibisco, curcumina, inulina e picolinato de cromo, que atuam juntos"
            ],
            beneficios: [
                "Promovendo saciedade",
                "Auxiliando no controle do apetite e da glicemia",
                "Reduzindo retenção de líquidos",
                "Estimulando a digestão e o metabolismo",
                "Contribuindo para a desintoxicação do organismo"
            ],
            descricaoAdicional: [
                "👉 Ideal para adultos que desejam reduzir medidas, controlar a compulsão alimentar e melhorar a saúde intestinal, quando aliado a hábitos saudáveis." + "<br>" +
                "✨ Sabor agradável, fórmula segura, adoçado com sucralose e garantia de 90 dias."
            ],
            destaque: true,
            preco: 69.90,
            precoOriginal: 129.90,
            parcelamento: {
                vezes: 12,
                valorParcela: 5.82
            },
            desconto: {
                percentual: 47,
                economia: 60.00
            },
            link: "#comprar"
        },
        {
            id: 2,
            nome: "Creatina Gummy Velmora",
            subnome: "Creatina Gummy Velmora é um suplemento inovador em formato de goma mastigável, desenvolvido para quem busca mais força, energia, foco e desempenho físico, sem complicações.",
            imagem: "prod2.jpeg", 
            descricao: "Cada dose fornece 3g de creatina monohidratada pura, a forma mais estudada e eficaz do mercado, ajudando a aumentar a produção de energia muscular (ATP), melhorar a performance nos treinos e acelerar a recuperação.",
            beneficios: [
                "✅ Zero glúten",
                "✅ Não precisa misturar com água",
                "✅ Sabor tutti-frutti",
                "✅ Produto regularizado na ANVISA",
                "✅ Garantia de 30 dias"
            ],
            descricaoAdicional: [
                "Prática, saborosa e sem açúcar, a Creatina Gummy Velmora pode ser consumida uma vez ao dia, com ou sem treino, garantindo constância e facilidade no uso diário." + "<br>" +
                "👉 Indicada para homens e mulheres a partir de 18 anos que desejam evoluir nos treinos, ganhar massa magra, reduzir a fadiga e manter energia ao longo do dia."
            ],
            destaque: false,
            preco: 159.90,
            precoOriginal: 299.90,
            parcelamento: {
                vezes: 12,
                valorParcela: 13.32
            },
            desconto: {
                percentual: 47,
                economia: 140.00
            },
            link: "#comprar"
        }

    ],
    
    depoimentos: [
        {
            id: 1,
            nome: "Ana Silva",
            avatar: "perfil-depoimento.png",
            avaliacao: 5,
            texto: "Uso os produtos da Maria há 3 meses e minha qualidade de vida melhorou muito. Mais energia e disposição!"
        },
        {
            id: 2,
            nome: "Carlos Santos",
            avatar: "perfil-depoimento.png", 
            avaliacao: 5,
            texto: "Excelente qualidade e atendimento. Os produtos realmente funcionam e entregam o que prometem."
        },
        {
            id: 3,
            nome: "Mariana Costa",
            avatar: "perfil-depoimento.png",
            avaliacao: 5,
            texto: "Recomendo de olhos fechados! A Maria é uma consultora maravilhosa e os produtos são top de linha."
        }
    ]
};

// Utilitários da aplicação
const Utils = {
    // Formatação de moeda brasileira
    formatarPreco: (preco) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(preco);
    },

    // Scroll suave para elemento
    scrollToElement: (element, offset = 80) => {
        const elementPosition = element.offsetTop - offset;
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    },

    // Debounce para performance
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Validar email
    validarEmail: (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },

    // Mostrar mensagem de feedback
    mostrarMensagem: (mensagem, tipo = 'success') => {
        // Remover mensagens existentes
        const existingMessages = document.querySelectorAll('.form__message');
        existingMessages.forEach(msg => msg.remove());
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `form__message form__message--${tipo}`;
        messageDiv.textContent = mensagem;
        
        const form = document.getElementById('contact-form');
        if (form) {
            form.insertBefore(messageDiv, form.firstChild);
            
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.remove();
                }
            }, 5000);
        }
    }
};

// Gerenciador de UI
class UIManager {
    constructor() {
        this.init();
    }

    init() {
        this.renderizarProdutos();
        this.renderizarDepoimentos();
        this.renderizarCardsCompra();
        this.setupEventListeners();
        this.setupScrollEffects();
    }

    // Renderização dinâmica de produtos
    renderizarProdutos() {
        const productGrid = document.querySelector('[data-component="product-grid"]');
        if (!productGrid) return;

        const produtosHTML = APP_DATA.produtos.map((produto, index) => `
            <div class="product-item ${index % 2 === 1 ? 'product-item--reverse' : ''}" data-produto-id="${produto.id}">
                <div class="product-item__image ${index % 2 === 1 ? 'product-item__image--dark' : ''}">
                    <img src="./img/${produto.imagem}" alt="${produto.nome}">
                    <h4 class="product-item__subtitle">${produto.subnome}</h4>
                </div>
                <div class="product-item__content">
                    <p>${produto.descricao}</p>
                    <ul class="product-item__benefits">
                        ${produto.beneficios.map(beneficio => `<li>${beneficio}</li>`).join('')}
                    </ul>
                    <p>${produto.descricaoAdicional}</p>
                    <a href="${produto.link}" class="product-item__cta" data-action="produto-cta" data-produto="${produto.id}">
                        Quero comprar agora →
                    </a>
                </div>
            </div>
        `).join('');

        productGrid.innerHTML = produtosHTML;
    }

    // Renderização dinâmica de depoimentos
    renderizarDepoimentos() {
        const testimonialsGrid = document.querySelector('[data-component="testimonials-grid"]');
        if (!testimonialsGrid) return;

        const depoimentosHTML = APP_DATA.depoimentos.map(depoimento => `
            <div class="testimonial-card" data-depoimento-id="${depoimento.id}">
                <div class="testimonial-card__header">
                    <img src="./img/${depoimento.avatar}" alt="${depoimento.nome}" class="testimonial-card__avatar">
                    <div class="testimonial-card__info">
                        <div class="testimonial-card__author">${depoimento.nome}</div>
                        <div class="testimonial-card__rating">${'★'.repeat(depoimento.avaliacao)}</div>
                    </div>
                </div>
                <div class="testimonial-card__text">"${depoimento.texto}"</div>
            </div>
        `).join('');

        testimonialsGrid.innerHTML = depoimentosHTML;
    }

    // Renderização de cards de compra
    renderizarCardsCompra() {
        const purchaseGrid = document.querySelector('[data-component="purchase-grid"]');
        if (!purchaseGrid) return;

        const cardsHTML = APP_DATA.produtos.map(produto => `
            <div class="purchase-card ${produto.destaque ? 'purchase-card--featured' : ''}" data-produto-id="${produto.id}">
                <div class="purchase-card__image">
                    <img src="./img/${produto.imagem}" alt="${produto.nome}">
                    ${produto.destaque ? '<div class="purchase-card__badge">MAIS VENDIDO</div>' : ''}
                </div>
                <div class="purchase-card__content">
                    <h4 class="purchase-card__title">${produto.nome}</h4>
                    <!-- Preços e desconto -->
                    <div class="purchase-card__pricing">
                        <div class="purchase-card__price-info">
                            <span class="purchase-card__price-original">De: ${Utils.formatarPreco(produto.precoOriginal)}</span>
                            <span class="purchase-card__price-current">Por: ${Utils.formatarPreco(produto.preco)}</span>
                            <span class="purchase-card__discount">-${produto.desconto.percentual}%</span>
                        </div>
                        <div class="purchase-card__savings">
                            Economia de ${Utils.formatarPreco(produto.desconto.economia)}
                        </div>
                    </div>

                    <!-- Parcelamento -->
                    <div class="purchase-card__installments">
                        <span class="purchase-card__installments-text">
                            ${produto.parcelamento.vezes}x de ${Utils.formatarPreco(produto.parcelamento.valorParcela)} sem juros
                        </span>
                    </div>
                    <div class="purchase-card__footer">
                        <button class="btn btn--primary btn--purchase" data-action="comprar" data-produto="${produto.id}">
                            Comprar agora
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        purchaseGrid.innerHTML = cardsHTML;
    }

    // Configurar event listeners
    setupEventListeners() {
        // Navegação suave
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    Utils.scrollToElement(targetElement);
                    this.updateActiveNavLink(targetId);
                }
            });
        });

        // Botões de CTA
        document.querySelectorAll('[data-action="cta-banner"]').forEach(btn => {
            btn.addEventListener('click', () => {
                const produtosSection = document.getElementById('produtos');
                Utils.scrollToElement(produtosSection);
            });
        });

        // Botões de compra (delegação de eventos)
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-action="comprar"]')) {
                this.handleCompra(e.target);
            }
            if (e.target.matches('[data-action="produto-cta"]')) {
                e.preventDefault();
                const produtoId = e.target.dataset.produto;
                const produto = APP_DATA.produtos.find(p => p.id == produtoId);
                if (produto) {
                    const contactSection = document.getElementById('contact');
                    Utils.scrollToElement(contactSection);
                    Utils.mostrarMensagem(`Interesse em ${produto.nome}! Preencha o formulário para comprar.`, 'success');
                }
            }
        });

        // Formulário de contato
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                this.handleFormSubmit(e);
            });
        }
    }

    // Configurar efeitos de scroll
    setupScrollEffects() {
        const headerContainer = document.getElementById('header-container');
        
        const handleScroll = Utils.debounce(() => {
            if (window.scrollY > 100) {
                headerContainer.classList.add('header--scrolled');
            } else {
                headerContainer.classList.remove('header--scrolled');
            }
            
            this.updateActiveSection();
        }, 100);

        window.addEventListener('scroll', handleScroll);
    }

    // Atualizar link ativo na navegação
    updateActiveNavLink(sectionId) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('nav-link--active');
        });
        
        const activeLink = document.querySelector(`[data-section="${sectionId}"]`);
        if (activeLink) {
            activeLink.classList.add('nav-link--active');
        }
    }

    // Atualizar seção ativa baseada no scroll
    updateActiveSection() {
        const sections = document.querySelectorAll('.section[data-section]');
        const scrollPosition = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.dataset.section;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                this.updateActiveNavLink(sectionId);
            }
        });
    }

    // Manipular clique em comprar
    handleCompra(button) {
        const produtoId = button.dataset.produto;
        const produto = APP_DATA.produtos.find(p => p.id == produtoId);
        
        if (produto) {
            // Feedback visual
            const originalHTML = button.innerHTML;
            button.innerHTML = '<span class="btn__loading">⏳ Processando...</span>';
            button.style.background = 'var(--accent-color)';
            button.disabled = true;
            
            setTimeout(() => {
                // Sucesso
                button.innerHTML = '<span class="btn__success">✅ Adicionado!</span>';
                button.style.background = 'var(--button-color)';

                setTimeout(() => {
                    button.innerHTML = originalHTML;
                    button.style.background = '';
                    button.disabled = false;
                }, 1500);

                // Redirecionar para contato com mensagem personalizada
                const contactSection = document.getElementById('contact');
                Utils.scrollToElement(contactSection);

                Utils.mostrarMensagem(
                    `🎉 Ótima escolha! ${produto.nome} adicionado.
                    Oferta especial: De ${Utils.formatarPreco(produto.precoOriginal)} por ${Utils.formatarPreco(produto.preco)}.
                    Economia: ${Utils.formatarPreco(produto.desconto.economia)}.
                    Parcelamento: ${produto.parcelamento.vezes}x de ${Utils.formatarPreco(produto.parcelamento.valorParcela)}.
                    Preencha o formulário para finalizar sua compra!`, 
                    'success'
                );

                // Preencher formulário com informações do produto
                this.preencherFormularioComProduto(produto);
            }, 1000);
        }
    }

    // Preencher formulário com informações do produto
    preencherFormularioComProduto(produto) {
        const messageField = document.getElementById('message');
        if (messageField) {
            const mensagemProduto = `
            INTERESSE DE COMPRA:

            📦 Produto: ${produto.nome}
            💰 Preço: ${Utils.formatarPreco(produto.preco)} (De: ${Utils.formatarPreco(produto.precoOriginal)})
            🏷️ Desconto: ${produto.desconto.percentual}% - Economia de ${Utils.formatarPreco(produto.desconto.economia)}
            💳 Parcelamento: ${produto.parcelamento.vezes}x de ${Utils.formatarPreco(produto.parcelamento.valorParcela)} sem juros

            📋 Descrição: ${produto.descricao}

            Gostaria de mais informações e finalizar a compra.
            `.trim();

            messageField.value = mensagemProduto;        }
    }

    // Validação e envio do formulário
    handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        // Validação
        if (!data.name || data.name.trim().length < 3) {
            Utils.mostrarMensagem('Por favor, informe seu nome completo.', 'error');
            return;
        }
        
        if (!Utils.validarEmail(data.email)) {
            Utils.mostrarMensagem('Por favor, informe um email válido.', 'error');
            return;
        }
        
        if (!data.message || data.message.trim().length < 10) {
            Utils.mostrarMensagem('Por favor, escreva uma mensagem com pelo menos 10 caracteres.', 'error');
            return;
        }
        
        // Simulação de envio
        const submitButton = e.target.querySelector('button[type="submit"]');
        submitButton.textContent = 'Enviando...';
        submitButton.disabled = true;
        
        setTimeout(() => {
            // Enviar para WhatsApp
            this.enviarParaWhatsApp(data);
            
            // Feedback de sucesso
            Utils.mostrarMensagem('Redirecionando para WhatsApp...', 'success');
            
            // Resetar formulário após um tempo
            setTimeout(() => {
                e.target.reset();
                submitButton.textContent = 'Enviar';
                submitButton.disabled = false;
            }, 2000);
        }, 1000);
    }

    // Formatação e envio para WhatsApp
    enviarParaWhatsApp(formData) {
        const textoWhatsApp = `
        *NOVO CONTATO - MARIA CONSULTORA*
        *Nome:* ${formData.name}
        *Email:* ${formData.email}
        *Tenho:* ${formData.message}
        *Enviado através do site oficial*`;

        const url = `https://wa.me/5527996700465?text=${encodeURIComponent(textoWhatsApp)}`;
        window.open(url, '_blank');
    }
}

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', () => {
    // Prevenir múltiplas inicializações
    if (window.appInitialized) return;
    window.appInitialized = true;
    
    new UIManager();
    
    // Funcionalidade do Menu Mobile com otimizações
    const initMobileMenu = () => {
        const menuToggle = document.getElementById('menu-toggle');
        const headerNav = document.querySelector('.header__nav');
        
        if (!menuToggle || !headerNav) return;
        
        // Cache de elementos para performance
        const navLinks = headerNav.querySelectorAll('.nav-link');
        
        // Handler otimizado para toggle do menu
        const toggleMenu = (e) => {
            e.preventDefault();
            const isOpen = headerNav.classList.toggle('header__nav--open');
            menuToggle.classList.toggle('menu-toggle--open', isOpen);
            
            // Prevenir scroll do body quando menu está aberto
            document.body.style.overflow = isOpen ? 'hidden' : '';
        };
        
        menuToggle.addEventListener('click', toggleMenu, { passive: true });
        
        // Fechar menu ao clicar em links (otimizado com delegation)
        const handleNavClick = (e) => {
            if (e.target.classList.contains('nav-link')) {
                headerNav.classList.remove('header__nav--open');
                menuToggle.classList.remove('menu-toggle--open');
                document.body.style.overflow = '';
            }
        };
        
        headerNav.addEventListener('click', handleNavClick, { passive: true });
        
        // Fechar menu ao clicar fora (otimizado)
        const handleOutsideClick = (e) => {
            if (!headerNav.contains(e.target) && !menuToggle.contains(e.target)) {
                headerNav.classList.remove('header__nav--open');
                menuToggle.classList.remove('menu-toggle--open');
                document.body.style.overflow = '';
            }
        };
        
        document.addEventListener('click', handleOutsideClick, { passive: true });
        
        // Fechar menu com ESC
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                headerNav.classList.remove('header__nav--open');
                menuToggle.classList.remove('menu-toggle--open');
                document.body.style.overflow = '';
            }
        };
        
        document.addEventListener('keydown', handleEscape, { passive: true });
        
        // Cleanup function para remover event listeners
        return () => {
            menuToggle.removeEventListener('click', toggleMenu);
            headerNav.removeEventListener('click', handleNavClick);
            document.removeEventListener('click', handleOutsideClick);
            document.removeEventListener('keydown', handleEscape);
        };
    };
    
    // Inicializar menu mobile
    const cleanupMenu = initMobileMenu();
    
    // Adicionar animações de entrada com IntersectionObserver otimizado
    const initScrollAnimations = () => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animate-slide-up')) {
                    entry.target.classList.add('animate-slide-up');
                    // Parar de observar após animação para performance
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observar apenas seções visíveis
        document.querySelectorAll('.section').forEach(section => {
            if (section.offsetParent !== null) { // Verificar se é visível
                section.classList.add('animate-slide-up-init');
                observer.observe(section);
            }
        });
        
        return observer;
    };
    
    const observer = initScrollAnimations();
    
    // Cleanup em caso de navegação SPA (se implementado no futuro)
    window.addEventListener('beforeunload', () => {
        if (cleanupMenu) cleanupMenu();
        if (observer) observer.disconnect();
    }, { once: true });
});

// Exportar para uso global se necessário
window.MariaApp = {
    APP_DATA,
    Utils,
    UIManager
};
