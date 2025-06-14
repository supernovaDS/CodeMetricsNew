// Navigation functionality
class Navigation {
    constructor() {
        this.currentPage = 'home';
        this.init();
    }

    init() {
        this.bindEvents();
        this.handleInitialRoute();
    }

    bindEvents() {
        // Navigation link clicks
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.dataset.page;
                this.navigateTo(page);
            });
        });

        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            const page = e.state?.page || 'home';
            this.navigateTo(page, false);
        });
    }

    handleInitialRoute() {
        const hash = window.location.hash.slice(1);
        const validPages = ['home', 'leetcode', 'codeforces', 'codechef'];
        const page = validPages.includes(hash) ? hash : 'home';
        this.navigateTo(page, false);
    }

    navigateTo(page, pushState = true) {
        if (this.currentPage === page) return;

        // Hide current page
        const currentPageElement = document.getElementById(`${this.currentPage}-page`);
        if (currentPageElement) {
            currentPageElement.classList.remove('active');
        }

        // Show new page
        const newPageElement = document.getElementById(`${page}-page`);
        if (newPageElement) {
            newPageElement.classList.add('active');
        }

        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        const activeLink = document.querySelector(`[data-page="${page}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        // Update URL
        if (pushState) {
            history.pushState({ page }, '', `#${page}`);
        }

        this.currentPage = page;

        // Trigger page-specific initialization
        this.onPageChange(page);
    }

    onPageChange(page) {
        // Initialize page-specific functionality
        switch (page) {
            case 'home':
                // Home page initialization
                break;
            case 'leetcode':
                // LeetCode page initialization
                if (window.chartManager) {
                    window.chartManager.initializeLeetCodeChart();
                }
                break;
            case 'codeforces':
                // Codeforces page initialization
                if (window.chartManager) {
                    window.chartManager.initializeCodeforcesChart();
                }
                break;
            case 'codechef':
                // CodeChef page initialization
                if (window.chartManager) {
                    window.chartManager.initializeCodeChefChart();
                }
                break;
        }
    }

    getCurrentPage() {
        return this.currentPage;
    }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.navigation = new Navigation();
});