// Main application logic
document.addEventListener('DOMContentLoaded', function() {
    // Initialize charts
    setTimeout(() => {
        window.chartManager.initializeCharts();
    }, 100);

    // Bind event listeners
    bindEventListeners();

    // Show welcome message
    showWelcomeMessage();
});

function bindEventListeners() {
    // LeetCode submit button
    const leetcodeSubmit = document.getElementById('leetcode-submit');
    const leetcodeInput = document.getElementById('leetcode-search');
    
    leetcodeSubmit.addEventListener('click', () => {
        const username = leetcodeInput.value.trim();
        if (username) {
            window.apiManager.fetchLeetCodeData(username);
        }
    });

    leetcodeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            leetcodeSubmit.click();
        }
    });

    // Codeforces submit button
    const codeforcesSubmit = document.getElementById('codeforces-submit');
    const codeforcesInput = document.getElementById('codeforces-search');
    
    codeforcesSubmit.addEventListener('click', () => {
        const handle = codeforcesInput.value.trim();
        if (handle) {
            window.apiManager.fetchCodeforcesData(handle);
        }
    });

    codeforcesInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            codeforcesSubmit.click();
        }
    });

    // CodeChef submit button
    const codechefSubmit = document.getElementById('codechef-submit');
    const codechefInput = document.getElementById('codechef-search');
    
    codechefSubmit.addEventListener('click', () => {
        const username = codechefInput.value.trim();
        if (username) {
            window.apiManager.fetchCodeChefData(username);
        }
    });

    codechefInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            codechefSubmit.click();
        }
    });

    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add intersection observer for animations
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

    // Observe elements for animation
    document.querySelectorAll('.input-card, .stat-card, .analytics-card, .chart-container').forEach(el => {
        observer.observe(el);
    });
}

function showWelcomeMessage() {
    // Show a subtle welcome message
    setTimeout(() => {
        const welcomeAlert = document.createElement('div');
        welcomeAlert.className = 'alert alert-info fade-in';
        welcomeAlert.innerHTML = `
            <strong>Welcome to CodeMetrics!</strong> 
            Enter your usernames above to start tracking your competitive programming journey.
        `;
        
        const container = document.querySelector('.input-section .container');
        if (container) {
            container.insertBefore(welcomeAlert, container.firstChild);
            
            // Remove after 8 seconds
            setTimeout(() => {
                welcomeAlert.remove();
            }, 8000);
        }
    }, 1000);
}

// Utility functions
function animateNumber(element, start, end, duration = 1000) {
    const startTime = performance.now();
    const difference = end - start;

    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.round(start + (difference * easeOutQuart));
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// Export for global access
window.animateNumber = animateNumber;

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden, pause any animations or timers
        console.log('Page hidden');
    } else {
        // Page is visible, resume animations or timers
        console.log('Page visible');
    }
});

// Handle window resize for responsive charts
window.addEventListener('resize', debounce(() => {
    Object.values(window.chartManager.charts).forEach(chart => {
        if (chart) {
            chart.resize();
        }
    });
}, 250));

// Debounce utility function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Error handling for uncaught errors
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    // You could send this to an error reporting service
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    // You could send this to an error reporting service
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        }, 0);
    });
}