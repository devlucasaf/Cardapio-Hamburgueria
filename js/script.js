document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const menuNav = document.querySelector('.menu-nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const cards = document.querySelectorAll('.card');
    const sections = document.querySelectorAll('.section');
    
    menuToggle.addEventListener('click', function() {
        menuNav.classList.toggle('active');
        const icon = this.querySelector('i');
        if (icon.classList.contains('fa-bars')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } 
        else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
            if (menuNav.classList.contains('active')) {
                menuNav.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
            navLinks.forEach(item => item.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    cards.forEach(card => {
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.98) translateY(-6px)';
            this.style.boxShadow = '0 8px 20px rgba(93, 64, 55, 0.2)';
            setTimeout(() => {
                this.style.transform = '';
                this.style.boxShadow = '';
            }, 150);
            const cardTitle = this.querySelector('.card-title');
            const originalColor = cardTitle.style.color;
            cardTitle.style.color = '#D84315';
            setTimeout(() => {
                cardTitle.style.color = originalColor;
            }, 300);
        });
    });
    
    window.addEventListener('scroll', function() {
        let current = '';
        const scrollPosition = window.scrollY + 150;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s, transform 0.5s';
        observer.observe(card);
    });
    
    setTimeout(() => {
        cards.forEach(card => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        });
    }, 300);
    
    const btnVerCardapio = document.querySelector('.btn');
    if (btnVerCardapio) {
        btnVerCardapio.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                navLinks.forEach(link => link.classList.remove('active'));
                document.querySelector(`a[href="${targetId}"]`).classList.add('active');
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const cardImg = this.querySelector('.card-img');
            if (cardImg) {
                cardImg.style.transform = 'scale(1.05)';
                cardImg.style.transition = 'transform 0.3s ease';
            }
            const cardPrice = this.querySelector('.card-price');
            if (cardPrice) {
                cardPrice.style.transform = 'scale(1.05)';
                cardPrice.style.backgroundColor = '#BF360C';
            }
        });
        card.addEventListener('mouseleave', function() {
            const cardImg = this.querySelector('.card-img');
            if (cardImg) {
                cardImg.style.transform = 'scale(1)';
            }
            const cardPrice = this.querySelector('.card-price');
            if (cardPrice) {
                cardPrice.style.transform = 'scale(1)';
                cardPrice.style.backgroundColor = '';
            }
        });
    });
    
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        const scrollY = window.scrollY;
        if (scrollY > 50) {
            header.style.boxShadow = '0 6px 25px rgba(61, 35, 28, 0.25)';
            header.style.backgroundImage = 'linear-gradient(to right, #5D4037, #795548)';
        } 
        else {
            header.style.boxShadow = '0 4px 20px rgba(61, 35, 28, 0.15)';
            header.style.backgroundImage = 'linear-gradient(to right, #5D4037, #795548)';
        }
    });
});

function fixHeaderLayout() {
    const header = document.querySelector('header');
    const logo = document.querySelector('.logo');
    const nav = document.querySelector('.menu-nav');
    
    if (header && logo && nav) {
        const headerHeight = header.offsetHeight;
        const logoHeight = logo.offsetHeight;
        
        if (logoHeight > 60) {
            header.style.padding = '15px 0';
        }
        
        nav.style.display = 'flex';
        nav.style.alignItems = 'center';
    }
}

window.addEventListener('load', fixHeaderLayout);
window.addEventListener('resize', fixHeaderLayout);

function optimizeMenu() {
    const nav = document.querySelector('.menu-nav');
    const navItems = document.querySelectorAll('.menu-nav a');
    const windowWidth = window.innerWidth;
    
    if (windowWidth < 950 && windowWidth > 768) {
        navItems.forEach(item => {
            const text = item.textContent;
            let shortText = text;
            
            if (text.includes('Combo')) shortText = 'Combos';
            if (text.includes('Acompanhamentos')) shortText = 'Acomp.';
            if (text.includes('Sobremesas')) shortText = 'Doces';
            if (text.includes('Bebidas')) shortText = 'Bebidas';
            if (text.includes('Burguer')) shortText = 'Burgers';
            if (text.includes('Entradas')) shortText = 'Entradas';
            if (text === 'Início') shortText = 'Início';
            
            item.setAttribute('data-long', text);
            item.innerHTML = `<span class="short-text">${shortText}</span>
                            <span class="long-text" style="display:none;">${text}</span>`;
        });
    } 
    else {
        navItems.forEach(item => {
            const longText = item.getAttribute('data-long') || item.textContent;
            item.innerHTML = longText;
        });
    }
}

window.addEventListener('load', optimizeMenu);
window.addEventListener('resize', optimizeMenu);
