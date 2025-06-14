// Chart management using Chart.js
class ChartManager {
    constructor() {
        this.charts = {};
        this.defaultOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#cbd5e1',
                        font: {
                            family: 'Inter'
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#94a3b8'
                    },
                    grid: {
                        color: '#374151'
                    }
                },
                y: {
                    ticks: {
                        color: '#94a3b8'
                    },
                    grid: {
                        color: '#374151'
                    }
                }
            }
        };
    }

    // Initialize all charts
    initializeCharts() {
        this.initializePlatformChart();
        this.initializeDifficultyChart();
        this.initializeLeetCodeChart();
        this.initializeCodeforcesChart();
        this.initializeCodeChefChart();
    }

    // Platform comparison chart
    initializePlatformChart() {
        const ctx = document.getElementById('platformChart');
        if (!ctx) return;

        this.charts.platform = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['LeetCode', 'Codeforces', 'CodeChef'],
                datasets: [{
                    label: 'Problems Solved',
                    data: [0, 0, 0],
                    backgroundColor: [
                        'rgba(255, 161, 22, 0.8)',
                        'rgba(31, 141, 214, 0.8)',
                        'rgba(91, 70, 56, 0.8)'
                    ],
                    borderColor: [
                        'rgba(255, 161, 22, 1)',
                        'rgba(31, 141, 214, 1)',
                        'rgba(91, 70, 56, 1)'
                    ],
                    borderWidth: 2,
                    borderRadius: 8
                }]
            },
            options: {
                ...this.defaultOptions,
                plugins: {
                    ...this.defaultOptions.plugins,
                    title: {
                        display: false
                    }
                }
            }
        });
    }

    // Difficulty distribution chart
    initializeDifficultyChart() {
        const ctx = document.getElementById('difficultyChart');
        if (!ctx) return;

        this.charts.difficulty = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Easy', 'Medium', 'Hard'],
                datasets: [{
                    data: [0, 0, 0],
                    backgroundColor: [
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(239, 68, 68, 0.8)'
                    ],
                    borderColor: [
                        'rgba(16, 185, 129, 1)',
                        'rgba(245, 158, 11, 1)',
                        'rgba(239, 68, 68, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#cbd5e1',
                            font: {
                                family: 'Inter'
                            },
                            padding: 20
                        }
                    }
                }
            }
        });
    }

    // LeetCode specific chart
    initializeLeetCodeChart() {
        const ctx = document.getElementById('leetcodeChart');
        if (!ctx) return;

        this.charts.leetcode = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Easy', 'Medium', 'Hard'],
                datasets: [{
                    data: [0, 0, 0],
                    backgroundColor: [
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(239, 68, 68, 0.8)'
                    ],
                    borderColor: [
                        'rgba(16, 185, 129, 1)',
                        'rgba(245, 158, 11, 1)',
                        'rgba(239, 68, 68, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#cbd5e1',
                            font: {
                                family: 'Inter'
                            },
                            padding: 20
                        }
                    }
                }
            }
        });
    }

    // Codeforces specific chart
    initializeCodeforcesChart() {
        const ctx = document.getElementById('codeforcesChart');
        if (!ctx) return;

        this.charts.codeforces = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['800', '900', '1000', '1100', '1200', '1300+'],
                datasets: [{
                    label: 'Problems Solved',
                    data: [0, 0, 0, 0, 0, 0],
                    backgroundColor: 'rgba(31, 141, 214, 0.8)',
                    borderColor: 'rgba(31, 141, 214, 1)',
                    borderWidth: 2,
                    borderRadius: 8
                }]
            },
            options: {
                ...this.defaultOptions,
                plugins: {
                    ...this.defaultOptions.plugins,
                    title: {
                        display: false
                    }
                }
            }
        });
    }

    // CodeChef specific chart
    initializeCodeChefChart() {
        const ctx = document.getElementById('codechefChart');
        if (!ctx) return;

        this.charts.codechef = new Chart(ctx, {
            type: 'polarArea',
            data: {
                labels: ['School', 'Easy', 'Medium', 'Hard', 'Challenge'],
                datasets: [{
                    data: [0, 0, 0, 0, 0],
                    backgroundColor: [
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(6, 182, 212, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(239, 68, 68, 0.8)',
                        'rgba(139, 92, 246, 0.8)'
                    ],
                    borderColor: [
                        'rgba(16, 185, 129, 1)',
                        'rgba(6, 182, 212, 1)',
                        'rgba(245, 158, 11, 1)',
                        'rgba(239, 68, 68, 1)',
                        'rgba(139, 92, 246, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#cbd5e1',
                            font: {
                                family: 'Inter'
                            },
                            padding: 20
                        }
                    }
                },
                scales: {
                    r: {
                        ticks: {
                            color: '#94a3b8'
                        },
                        grid: {
                            color: '#374151'
                        }
                    }
                }
            }
        });
    }

    // Update chart data
    updateOverallCharts(data) {
        // Update platform chart
        if (this.charts.platform) {
            this.charts.platform.data.datasets[0].data = [
                data.platforms.leetcode,
                data.platforms.codeforces,
                data.platforms.codechef
            ];
            this.charts.platform.update();
        }

        // Update difficulty chart
        if (this.charts.difficulty) {
            this.charts.difficulty.data.datasets[0].data = [
                data.difficulty.easy,
                data.difficulty.medium,
                data.difficulty.hard
            ];
            this.charts.difficulty.update();
        }
    }

    updateLeetCodeChart(data) {
        if (this.charts.leetcode) {
            this.charts.leetcode.data.datasets[0].data = [
                data.easySolved || 0,
                data.mediumSolved || 0,
                data.hardSolved || 0
            ];
            this.charts.leetcode.update();
        }
    }

    updateCodeforcesChart(data) {
        if (this.charts.codeforces && data.ratingDistribution) {
            const distribution = data.ratingDistribution;
            const chartData = [
                distribution[800] || 0,
                distribution[900] || 0,
                distribution[1000] || 0,
                distribution[1100] || 0,
                distribution[1200] || 0,
                Object.keys(distribution)
                    .filter(rating => parseInt(rating) >= 1300)
                    .reduce((sum, rating) => sum + distribution[rating], 0)
            ];
            
            this.charts.codeforces.data.datasets[0].data = chartData;
            this.charts.codeforces.update();
        }
    }

    updateCodeChefChart(data) {
        if (this.charts.codechef && data.problemStats) {
            const stats = data.problemStats;
            this.charts.codechef.data.datasets[0].data = [
                stats.school?.solved || 0,
                stats.easy?.solved || 0,
                stats.medium?.solved || 0,
                stats.hard?.solved || 0,
                stats.challenge?.solved || 0
            ];
            this.charts.codechef.update();
        }
    }

    // Destroy chart
    destroyChart(chartName) {
        if (this.charts[chartName]) {
            this.charts[chartName].destroy();
            delete this.charts[chartName];
        }
    }

    // Destroy all charts
    destroyAllCharts() {
        Object.keys(this.charts).forEach(chartName => {
            this.destroyChart(chartName);
        });
    }
}

// Initialize chart manager
window.chartManager = new ChartManager();