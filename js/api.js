// API management and data fetching
class APIManager {
    constructor() {
        this.CF_API_KEY = "4577466f6f3dfb4e02047d933f7cb9df7fd8c9fc";
        this.CF_API_SECRET = "b5878eb5d29283345466da572edd5e80bad3df27";
        this.data = {
            leetcode: null,
            codeforces: null,
            codechef: null
        };
    }

    // Utility functions
    validateUsername(username) {
        if (username.trim() === "") {
            this.showAlert("Username should not be empty", "warning");
            return false;
        }
        const regex = /^[a-zA-Z0-9_-]{1,15}$/;
        const isMatching = regex.test(username);
        if (!isMatching) {
            this.showAlert("Invalid username format", "danger");
        }
        return isMatching;
    }

    showAlert(message, type = "info") {
        // Create alert element
        const alert = document.createElement('div');
        alert.className = `alert alert-${type} fade-in`;
        alert.textContent = message;
        
        // Add to page
        const container = document.querySelector('.container');
        if (container) {
            container.insertBefore(alert, container.firstChild);
            
            // Remove after 5 seconds
            setTimeout(() => {
                alert.remove();
            }, 5000);
        }
    }

    showLoading(show = true) {
        const modal = document.getElementById('loading-modal');
        if (modal) {
            modal.style.display = show ? 'block' : 'none';
        }
    }

    setButtonLoading(button, loading = true) {
        if (loading) {
            button.classList.add('loading');
            button.disabled = true;
        } else {
            button.classList.remove('loading');
            button.disabled = false;
        }
    }

    // LeetCode API
    async fetchLeetCodeData(username) {
        const button = document.getElementById('leetcode-submit');
        
        if (!this.validateUsername(username)) return;

        this.setButtonLoading(button, true);
        
        try {
            const [statsResponse, contestResponse] = await Promise.allSettled([
                fetch(`https://leetcode-stats-api.herokuapp.com/${username}`),
                fetch(`https://alfa-leetcode-api.onrender.com/${username}/contest`)
            ]);

            let statsData = null;
            let contestData = null;

            if (statsResponse.status === 'fulfilled' && statsResponse.value.ok) {
                statsData = await statsResponse.value.json();
            }

            if (contestResponse.status === 'fulfilled' && contestResponse.value.ok) {
                contestData = await contestResponse.value.json();
            }

            if (!statsData && !contestData) {
                throw new Error("Unable to fetch LeetCode data");
            }

            const combinedData = {
                ...statsData,
                contestRating: contestData?.contestRating || null,
                contestGlobalRanking: contestData?.contestGlobalRanking || null,
                contestTopPercentage: contestData?.contestTopPercentage || null
            };

            this.data.leetcode = combinedData;
            this.updateLeetCodeUI(combinedData);
            this.updateOverallStats();
            this.showAlert("LeetCode data fetched successfully!", "success");

        } catch (error) {
            console.error('LeetCode API error:', error);
            this.showAlert("Failed to fetch LeetCode data. Please check the username.", "danger");
        } finally {
            this.setButtonLoading(button, false);
        }
    }

    // Codeforces API
    async fetchCodeforcesData(handle) {
        const button = document.getElementById('codeforces-submit');
        
        if (!this.validateUsername(handle)) return;

        this.setButtonLoading(button, true);

        try {
            const time = Math.floor(Date.now() / 1000);
            const rand = Math.floor(100000 + Math.random() * 900000).toString();
            const method = 'user.info';

            const params = {
                apiKey: this.CF_API_KEY,
                handles: handle,
                time: time
            };

            const sortedParams = Object.entries(params).sort();
            const paramStr = sortedParams.map(([k, v]) => `${k}=${v}`).join('&');
            const stringToHash = `${rand}/${method}?${paramStr}#${this.CF_API_SECRET}`;

            const hashBuffer = await crypto.subtle.digest("SHA-512", new TextEncoder().encode(stringToHash));
            const hashHex = [...new Uint8Array(hashBuffer)].map(b => b.toString(16).padStart(2, '0')).join('');
            const apiSig = `${rand}${hashHex}`;
            const fullURL = `https://codeforces.com/api/${method}?${paramStr}&apiSig=${apiSig}`;

            const [userResponse, submissionsResponse] = await Promise.allSettled([
                fetch(fullURL),
                fetch(`https://codeforces.com/api/user.status?handle=${handle}&from=1&count=10000`)
            ]);

            let userData = null;
            let submissionsData = null;

            if (userResponse.status === 'fulfilled' && userResponse.value.ok) {
                const userResult = await userResponse.value.json();
                if (userResult.status === "OK") {
                    userData = userResult.result[0];
                }
            }

            if (submissionsResponse.status === 'fulfilled' && submissionsResponse.value.ok) {
                const submissionsResult = await submissionsResponse.value.json();
                if (submissionsResult.status === "OK") {
                    submissionsData = this.processCodeforcesSubmissions(submissionsResult.result);
                }
            }

            if (!userData && !submissionsData) {
                throw new Error("Unable to fetch Codeforces data");
            }

            const combinedData = {
                ...userData,
                ...submissionsData
            };

            this.data.codeforces = combinedData;
            this.updateCodeforcesUI(combinedData);
            this.updateOverallStats();
            this.showAlert("Codeforces data fetched successfully!", "success");

        } catch (error) {
            console.error('Codeforces API error:', error);
            this.showAlert("Failed to fetch Codeforces data. Please check the handle.", "danger");
        } finally {
            this.setButtonLoading(button, false);
        }
    }

    processCodeforcesSubmissions(submissions) {
        const solvedSet = new Set();
        let totalSubs = submissions.length;
        let acceptedCount = 0;
        const difficultyCount = { easy: 0, medium: 0, hard: 0 };
        const ratingDistribution = {};

        submissions.forEach(sub => {
            if (sub.verdict === "OK") {
                const key = `${sub.problem.contestId}-${sub.problem.index}`;
                if (!solvedSet.has(key)) {
                    solvedSet.add(key);
                    acceptedCount++;
                    const rating = sub.problem.rating || 0;
                    
                    // Categorize by difficulty
                    if (rating <= 900) difficultyCount.easy++;
                    else if (rating <= 1200) difficultyCount.medium++;
                    else difficultyCount.hard++;

                    // Rating distribution
                    const ratingRange = Math.floor(rating / 100) * 100;
                    ratingDistribution[ratingRange] = (ratingDistribution[ratingRange] || 0) + 1;
                }
            }
        });

        return {
            totalSolved: solvedSet.size,
            easySolved: difficultyCount.easy,
            mediumSolved: difficultyCount.medium,
            hardSolved: difficultyCount.hard,
            totalSubmissions: totalSubs,
            acceptanceRate: totalSubs > 0 ? ((acceptedCount / totalSubs) * 100).toFixed(2) : "0.00",
            ratingDistribution
        };
    }

    // CodeChef API
    async fetchCodeChefData(username) {
        const button = document.getElementById('codechef-submit');
        
        if (!this.validateUsername(username)) return;

        this.setButtonLoading(button, true);

        try {
            const response = await fetch(`https://codechef-api.vercel.app/${username}`);
            
            if (!response.ok) {
                throw new Error("Unable to fetch CodeChef data");
            }

            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.message || "CodeChef API returned an error");
            }

            this.data.codechef = data;
            this.updateCodeChefUI(data);
            this.updateOverallStats();
            this.showAlert("CodeChef data fetched successfully!", "success");

        } catch (error) {
            console.error('CodeChef API error:', error);
            this.showAlert("Failed to fetch CodeChef data. Please check the username.", "danger");
        } finally {
            this.setButtonLoading(button, false);
        }
    }

    // UI Update functions
    updateLeetCodeUI(data) {
        // Home page updates
        document.querySelector('.leetcode-total-value').textContent = data.totalSolved || 0;
        document.querySelector('.leetcode-easy-value').textContent = data.easySolved || 0;
        document.querySelector('.leetcode-medium-value').textContent = data.mediumSolved || 0;
        document.querySelector('.leetcode-hard-value').textContent = data.hardSolved || 0;
        document.querySelector('.leetcode-acceptance-rate').textContent = data.acceptanceRate || '-';
        document.querySelector('.leetcode-contest-rating').textContent = data.contestRating || '-';
        document.querySelector('.leetcode-contest-ranking').textContent = data.contestGlobalRanking || '-';
        document.querySelector('.leetcode-top-percentage').textContent = data.contestTopPercentage || '-';

        // LeetCode page updates
        document.getElementById('lc-total').textContent = data.totalSolved || 0;
        document.getElementById('lc-easy').textContent = data.easySolved || 0;
        document.getElementById('lc-medium').textContent = data.mediumSolved || 0;
        document.getElementById('lc-hard').textContent = data.hardSolved || 0;
        document.getElementById('lc-rating').textContent = data.contestRating || '-';
        document.getElementById('lc-ranking').textContent = data.contestGlobalRanking || '-';
        document.getElementById('lc-percentage').textContent = data.contestTopPercentage ? `${data.contestTopPercentage}%` : '-';
        document.getElementById('lc-acceptance').textContent = data.acceptanceRate ? `${data.acceptanceRate}%` : '-';

        // Update charts
        if (window.chartManager) {
            window.chartManager.updateLeetCodeChart(data);
        }
    }

    updateCodeforcesUI(data) {
        // Home page updates
        document.querySelector('.cf-total-value').textContent = data.totalSolved || 0;
        document.querySelector('.cf-easy-value').textContent = data.easySolved || 0;
        document.querySelector('.cf-medium-value').textContent = data.mediumSolved || 0;
        document.querySelector('.cf-hard-value').textContent = data.hardSolved || 0;
        document.querySelector('.cf-total-submissions').textContent = data.totalSubmissions || 0;
        document.querySelector('.cf-acceptance-rate').textContent = data.acceptanceRate ? `${data.acceptanceRate}%` : '-';
        document.querySelector('.cf-contest-rating').textContent = data.rating || 'Unrated';

        // Codeforces page updates
        document.getElementById('cf-total').textContent = data.totalSolved || 0;
        document.getElementById('cf-easy').textContent = data.easySolved || 0;
        document.getElementById('cf-medium').textContent = data.mediumSolved || 0;
        document.getElementById('cf-hard').textContent = data.hardSolved || 0;
        document.getElementById('cf-rating').textContent = data.rating || 'Unrated';
        document.getElementById('cf-max-rating').textContent = data.maxRating || data.rating || '-';
        document.getElementById('cf-submissions').textContent = data.totalSubmissions || 0;
        document.getElementById('cf-acceptance').textContent = data.acceptanceRate ? `${data.acceptanceRate}%` : '-';

        // Update charts
        if (window.chartManager) {
            window.chartManager.updateCodeforcesChart(data);
        }
    }

    updateCodeChefUI(data) {
        const profile = data.profile || {};
        const problemStats = data.problemStats || {};

        // Calculate totals
        const totalSolved = Object.values(problemStats).reduce((sum, category) => {
            return sum + (category.solved || 0);
        }, 0);

        // Home page updates
        document.querySelector('.codechef-total-value').textContent = totalSolved;
        document.querySelector('.codechef-easy-value').textContent = problemStats.school?.solved || 0;
        document.querySelector('.codechef-medium-value').textContent = (problemStats.easy?.solved || 0) + (problemStats.medium?.solved || 0);
        document.querySelector('.codechef-hard-value').textContent = (problemStats.hard?.solved || 0) + (problemStats.challenge?.solved || 0);
        document.querySelector('.codechef-stars-value').textContent = profile.stars || '-';
        document.querySelector('.codechef-contest-rating').textContent = profile.currentRating || 'Unrated';

        // CodeChef page updates
        document.getElementById('cc-total').textContent = totalSolved;
        document.getElementById('cc-easy').textContent = problemStats.school?.solved || 0;
        document.getElementById('cc-medium').textContent = (problemStats.easy?.solved || 0) + (problemStats.medium?.solved || 0);
        document.getElementById('cc-hard').textContent = (problemStats.hard?.solved || 0) + (problemStats.challenge?.solved || 0);
        document.getElementById('cc-rating').textContent = profile.currentRating || 'Unrated';
        document.getElementById('cc-stars').textContent = profile.stars || '-';
        document.getElementById('cc-rank').textContent = profile.globalRank || '-';
        document.getElementById('cc-country-rank').textContent = profile.countryRank || '-';

        // Update charts
        if (window.chartManager) {
            window.chartManager.updateCodeChefChart(data);
        }
    }

    updateOverallStats() {
        const leetcode = this.data.leetcode || {};
        const codeforces = this.data.codeforces || {};
        const codechef = this.data.codechef || {};

        // Calculate CodeChef totals
        const codechefStats = codechef.problemStats || {};
        const codechefTotal = Object.values(codechefStats).reduce((sum, category) => {
            return sum + (category.solved || 0);
        }, 0);
        const codechefEasy = codechefStats.school?.solved || 0;
        const codechefMedium = (codechefStats.easy?.solved || 0) + (codechefStats.medium?.solved || 0);
        const codechefHard = (codechefStats.hard?.solved || 0) + (codechefStats.challenge?.solved || 0);

        // Calculate totals
        const totalSolved = (leetcode.totalSolved || 0) + (codeforces.totalSolved || 0) + codechefTotal;
        const totalEasy = (leetcode.easySolved || 0) + (codeforces.easySolved || 0) + codechefEasy;
        const totalMedium = (leetcode.mediumSolved || 0) + (codeforces.mediumSolved || 0) + codechefMedium;
        const totalHard = (leetcode.hardSolved || 0) + (codeforces.hardSolved || 0) + codechefHard;

        // Update UI
        document.getElementById('total-solved').textContent = totalSolved;
        document.getElementById('easy-solved').textContent = totalEasy;
        document.getElementById('medium-solved').textContent = totalMedium;
        document.getElementById('hard-solved').textContent = totalHard;

        // Update charts
        if (window.chartManager) {
            window.chartManager.updateOverallCharts({
                platforms: {
                    leetcode: leetcode.totalSolved || 0,
                    codeforces: codeforces.totalSolved || 0,
                    codechef: codechefTotal
                },
                difficulty: {
                    easy: totalEasy,
                    medium: totalMedium,
                    hard: totalHard
                }
            });
        }
    }
}

// Initialize API manager
window.apiManager = new APIManager();