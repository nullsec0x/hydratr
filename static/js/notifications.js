class WaterNotificationSystem {
    constructor() {
        this.isActive = false;
        this.currentNotification = null;
        this.timeoutId = null;
        this.intervalId = null;
        this.lastNotificationTime = 0;
        this.minInterval = 25 * 60 * 1000;
        this.maxInterval = 35 * 60 * 1000;
        this.notificationDuration = 5000;
        
        this.init();
    }
    
    init() {
        this.setupVisibilityHandlers();
        this.start();
        this.setupActivityListeners();
    }
    
    setupVisibilityHandlers() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.resume();
            }
        });
        
        window.addEventListener('focus', () => {
            this.resume();
        });
        
        window.addEventListener('blur', () => {
            this.pause();
        });
    }
    
    setupActivityListeners() {
        let activityTimeout;
        const resetActivityTimer = () => {
            clearTimeout(activityTimeout);
            this.isActive = true;
            
            activityTimeout = setTimeout(() => {
                this.isActive = false;
            }, 5 * 60 * 1000);
        };
        
        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'].forEach(event => {
            document.addEventListener(event, resetActivityTimer, { passive: true });
        });
        
        resetActivityTimer();
    }
    
    start() {
        if (this.intervalId) return;
        
        this.scheduleNextNotification();
    }
    
    pause() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
        
        if (this.currentNotification) {
            this.hideNotification();
        }
    }
    
    resume() {
        if (!this.timeoutId && !document.hidden) {
            this.scheduleNextNotification();
        }
    }
    
    scheduleNextNotification() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
        
        const randomInterval = Math.random() * (this.maxInterval - this.minInterval) + this.minInterval;
        
        this.timeoutId = setTimeout(() => {
            this.showNotification();
            this.scheduleNextNotification();
        }, randomInterval);
        
        console.log(`Next water reminder scheduled in ${Math.round(randomInterval / 60000)} minutes`);
    }
    
    showNotification() {
        const now = Date.now();
        if (!this.isActive || 
            document.hidden || 
            (now - this.lastNotificationTime) < this.minInterval) {
            return;
        }
        
        if (this.currentNotification) {
            return;
        }
        
        this.lastNotificationTime = now;
        
        const notification = this.createNotificationElement();
        document.body.appendChild(notification);
        this.currentNotification = notification;
        
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });
        
        setTimeout(() => {
            this.hideNotification();
        }, this.notificationDuration);
        
        const closeBtn = notification.querySelector('.notification-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hideNotification();
            });
        }
        
        notification.addEventListener('mouseenter', () => {
            notification.classList.add('hovered');
        });
        
        notification.addEventListener('mouseleave', () => {
            notification.classList.remove('hovered');
            if (this.currentNotification === notification) {
                setTimeout(() => {
                    this.hideNotification();
                }, 2000);
            }
        });
    }
    
    createNotificationElement() {
        const notification = document.createElement('div');
        notification.className = 'water-notification';
        
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                </div>
                <div class="notification-text">
                    <div class="notification-title">Hydration Reminder</div>
                    <div class="notification-message">Don't forget to drink water!! 💧</div>
                </div>
                <button class="notification-close" type="button">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                </button>
            </div>
            <div class="notification-progress"></div>
        `;
        
        return notification;
    }
    
    hideNotification() {
        if (!this.currentNotification) return;
        
        const notification = this.currentNotification;
        notification.classList.remove('show');
        notification.classList.add('hide');
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            if (this.currentNotification === notification) {
                this.currentNotification = null;
            }
        }, 400);
    }
    
    triggerNotification() {
        this.showNotification();
    }
    
    stop() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
        
        if (this.currentNotification) {
            this.hideNotification();
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname === '/' || window.location.pathname.includes('dashboard')) {
        window.waterNotifications = new WaterNotificationSystem();
        
        if (typeof console !== 'undefined') {
            console.log('Water notification system initialized. Use waterNotifications.triggerNotification() to test.');
        }
    }
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = WaterNotificationSystem;
}

