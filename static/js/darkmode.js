class DarkMode {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.currentTheme = localStorage.getItem('theme') || 
                           (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        
        this.init();
    }
    
    init() {
        this.setTheme(this.currentTheme);
        
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }
        
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (!localStorage.getItem('theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
    
    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.classList.toggle('dark', theme === 'dark');
        localStorage.setItem('theme', theme);
        
        this.updateToggleIcon();
        
        this.updateServerTheme(theme);
        
        document.dispatchEvent(new CustomEvent('themeChanged', { detail: theme }));
    }
    
    updateToggleIcon() {
        if (this.themeToggle) {
            const icon = this.themeToggle.querySelector('i');
            if (this.currentTheme === 'dark') {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        }
    }
    
    toggleTheme() {
        this.setTheme(this.currentTheme === 'light' ? 'dark' : 'light');
    }
    
    async updateServerTheme(theme) {
        const isAuthenticated = document.body.classList.contains('logged-in');
        
        if (isAuthenticated) {
            try {
                const response = await fetch('/update-theme', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: JSON.stringify({ theme: theme })
                });
                
                if (!response.ok) {
                    console.error('Failed to update theme preference on server');
                }
            } catch (error) {
                console.error('Error updating theme preference:', error);
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.darkMode = new DarkMode();
});

