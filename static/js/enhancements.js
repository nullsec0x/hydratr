class HydrationEnhancements {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupFloatingActionButton();
        this.setupProgressAnimations();
        this.setupSuccessAnimations();
        this.setupTooltips();
        this.setupKeyboardShortcuts();
        this.setupScrollEffects();
        this.setupLoadingStates();
    }
    
    setupFloatingActionButton() {
        const fab = document.createElement('button');
        fab.className = 'floating-action enhanced-tooltip';
        fab.setAttribute('data-tooltip', 'Quick log 250ml');
        fab.innerHTML = `
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
        `;
        
        fab.addEventListener('click', () => {
            this.quickLogWater(250);
        });
        
        if (window.location.pathname === '/' || window.location.pathname.includes('dashboard')) {
            document.body.appendChild(fab);
        }
    }
    
    quickLogWater(amount) {
        const amountInput = document.querySelector('input[name="amount"]');
        const form = document.querySelector('form[action*="log_water"]');
        
        if (amountInput && form) {
            amountInput.value = amount;
            
            const fab = document.querySelector('.floating-action');
            if (fab) {
                fab.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    fab.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        fab.style.transform = 'scale(1)';
                    }, 150);
                }, 100);
            }
            
            form.submit();
        }
    }
    
    setupProgressAnimations() {
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
            const progress = parseFloat(progressBar.dataset.progress || 0);
            
            setTimeout(() => {
                progressBar.style.width = Math.min(progress, 100) + '%';
            }, 500);
            
            progressBar.classList.add('enhanced-progress');
        }
    }
    
    setupSuccessAnimations() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                const submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.classList.add('success-pulse');
                    setTimeout(() => {
                        submitBtn.classList.remove('success-pulse');
                    }, 600);
                }
            });
        });
    }
    
    setupTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        tooltipElements.forEach(element => {
            element.classList.add('enhanced-tooltip');
        });
        
        const quickLogButtons = document.querySelectorAll('.quick-log');
        quickLogButtons.forEach(button => {
            const amount = button.dataset.amt;
            button.setAttribute('data-tooltip', `Log ${amount}ml quickly`);
            button.classList.add('enhanced-tooltip');
        });
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                const form = document.querySelector('form[action*="log_water"]');
                const amountInput = document.querySelector('input[name="amount"]');
                
                if (form && amountInput && amountInput.value) {
                    e.preventDefault();
                    form.submit();
                }
            }
            
            if (e.altKey && ['1', '2', '3', '4'].includes(e.key)) {
                e.preventDefault();
                const amounts = [250, 500, 1000, 1500];
                const amount = amounts[parseInt(e.key) - 1];
                this.quickLogWater(amount);
            }
        });
    }
    
    setupScrollEffects() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);
        
        const cards = document.querySelectorAll('.water-card');
        cards.forEach(card => {
            observer.observe(card);
        });
    }
    
    setupLoadingStates() {
        const buttons = document.querySelectorAll('button[type="submit"]');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const originalText = button.innerHTML;
                button.innerHTML = `
                    <div class="spinner mr-2"></div>
                    Processing...
                `;
                button.disabled = true;
                
                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.disabled = false;
                }, 2000);
            });
        });
    }
    
    checkAchievements(todayAmount, streak) {
        const achievements = [];
        
        if (todayAmount >= 2000) {
            achievements.push({ name: 'Hydration Hero', icon: '🏆' });
        }
        
        if (streak >= 7) {
            achievements.push({ name: 'Week Warrior', icon: '🔥' });
        }
        
        if (streak >= 30) {
            achievements.push({ name: 'Monthly Master', icon: '👑' });
        }
        
        return achievements;
    }
    
    showAchievement(achievement) {
        const achievementEl = document.createElement('div');
        achievementEl.className = 'achievement-badge';
        achievementEl.innerHTML = `${achievement.icon} ${achievement.name}`;
        
        document.body.appendChild(achievementEl);
        
        setTimeout(() => {
            achievementEl.remove();
        }, 5000);
    }
}

class FormEnhancements {
    constructor() {
        this.setupFormValidation();
        this.setupInputEnhancements();
    }
    
    setupFormValidation() {
        const inputs = document.querySelectorAll('input[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', this.validateInput);
            input.addEventListener('input', this.clearValidationError);
        });
    }
    
    validateInput(e) {
        const input = e.target;
        const value = input.value.trim();
        
        if (!value) {
            input.classList.add('border-red-500');
            input.classList.remove('border-green-500');
        } else {
            input.classList.add('border-green-500');
            input.classList.remove('border-red-500');
        }
    }
    
    clearValidationError(e) {
        const input = e.target;
        input.classList.remove('border-red-500');
    }
    
    setupInputEnhancements() {
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.classList.add('focus-ring');
            
            if (input.placeholder) {
                this.addFloatingLabel(input);
            }
        });
    }
    
    addFloatingLabel(input) {
        const wrapper = document.createElement('div');
        wrapper.className = 'relative';
        
        const label = document.createElement('label');
        label.className = 'absolute left-3 top-3 text-gray-500 transition-all duration-200 pointer-events-none';
        label.textContent = input.placeholder;
        
        input.parentNode.insertBefore(wrapper, input);
        wrapper.appendChild(input);
        wrapper.appendChild(label);
        
        input.placeholder = '';
        
        const updateLabel = () => {
            if (input.value || input === document.activeElement) {
                label.classList.add('text-xs', '-top-2', 'bg-white', 'px-1');
                label.classList.remove('top-3');
            } else {
                label.classList.remove('text-xs', '-top-2', 'bg-white', 'px-1');
                label.classList.add('top-3');
            }
        };
        
        input.addEventListener('focus', updateLabel);
        input.addEventListener('blur', updateLabel);
        input.addEventListener('input', updateLabel);
        
        updateLabel();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname === '/' || window.location.pathname.includes('dashboard')) {
        window.hydrationEnhancements = new HydrationEnhancements();
        window.formEnhancements = new FormEnhancements();
        
        console.log('Hydration enhancements loaded successfully!');
    }
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { HydrationEnhancements, FormEnhancements };
}

