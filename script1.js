document.addEventListener("DOMContentLoaded", function() {
    const LeetcodeSearchButton = document.getElementById("leetcode-submit");
    const CodeforcesSearchButton = document.getElementById("codeforces-submit");
    const CodechefSearchButton = document.getElementById("codechef-submit");
    const LeetcodeUsernameInput = document.getElementById("leetcode-search")
    const CodeforcesUsernameInput = document.getElementById("codeforces-search");
    const CodechefUsernameInput = document.getElementById("codechef-search");
    const LeetcodeEasyValue = document.querySelector(".leetcode-easy-value");
    const LeetcodeMediumValue = document.querySelector(".leetcode-medium-value");
    const LeetcodeHardValue = document.querySelector(".leetcode-hard-value");
    const LeetcodeTotalValue = document.querySelector(".leetcode-total-value");
    const LeetcodeContestRatingLabel = document.querySelector(".leetcode-contest-rating");
    const LeetcodeContestRankingLabel = document.querySelector(".leetcode-contest-ranking");
    const LeetcodeTopPercentageLabel = document.querySelector(".leetcode-top-percentage");
    const LeetcodeAcceptanceRateLabel = document.querySelector(".leetcode-acceptance-rate");
    const CodechefTotalSolvedLabel = document.querySelector(".codechef-total-value");
    const CodechefEasySolvedLabel = document.querySelector(".codechef-easy-value");
    const CodechefMediumSolvedLabel = document.querySelector(".codechef-medium-value");
    const CodechefHardSolvedLabel = document.querySelector(".codechef-hard-value");
    const CodechefTotalSubmissionLabel = document.querySelector(".codechef-total-submission");
    const CodechefAceeptanceRateLabel = document.querySelector(".codechef-acceptance-rate");
    const CodechefStarsValueLabel = document.querySelector(".codechef-stars-value");
    const CodechefContestRatingLabel = document.querySelector(".codechef-contest-rating");
    const CfTotalSolvedLabel = document.querySelector(".cf-total-value");
    const CfEasySolvedLabel = document.querySelector(".cf-easy-value");
    const CfMediumSolvedLabel = document.querySelector(".cf-medium-value");
    const CfHardSolvedLabel = document.querySelector(".cf-hard-value");
    const CfTotalSubmissionLable = document.querySelector(".cf-total-submissions");
    const CfAcceptanceRateLable = document.querySelector(".cf-acceptance-rate");
    const CfContestRatingLabel = document.querySelector(".cf-contest-rating");
    const TotalSolvedLabel = document.querySelector(".total-solved");
    const TotalEasySolvedLabel = document.querySelector(".easy-solved");
    const TotalMediumSolvedLabel = document.querySelector(".medium-solved");
    const TotalHardSolvedLabel = document.querySelector(".hard-solved");
    let leetcodeSolved = { total: 0, easy: 0, medium: 0, hard: 0 };
    let codeforcesSolved = { total: 0, easy: 0, medium: 0, hard: 0 };





    function validateUsername(username) {
        if(username.trim() == "") {
            alert("Username Should not be empty");
            return false;
        }
            const regex = /^[a-zA-Z0-9_-]{1,15}$/;
            const isMatching = regex.test(username);
            if(!isMatching) {
                alert("Invalid Username");
            }
            return isMatching;
        }

    async function fetchUserDetails(username, url, searchButton, platform) {
        try {
            searchButton.textContent = "Searching...";
            searchButton.disabled = true;

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Unable to fetch the User details");
            }

            const parsedData = await response.json();
            console.log("logging data:", parsedData);

            if (platform === "leetcode") {
                displayLeetcodeData(parsedData, url, username);
            } else if (platform === "codeforces") {
                displayCodeforcesData(parsedData);
            } else if (platform === "codechef") {
                displayCodechefData(parsedData);
            }
        } catch (error) {
            alert("No data Found");
            console.error(error);
        } finally {
            searchButton.textContent = "Submit";
            searchButton.disabled = false;
        }
    }


    

    async function getCodeforcesUserInfo(handle, apiKey, apiSecret) {
        const time = Math.floor(Date.now() / 1000);
        const rand = Math.floor(100000 + Math.random() * 900000).toString();
        const method = 'user.info';

        const params = {
            apiKey: apiKey,
            handles: handle,
            time: time
        };

        const sortedParams = Object.entries(params).sort();
        const paramStr = sortedParams.map(([k, v]) => `${k}=${v}`).join('&');
        const stringToHash = `${rand}/${method}?${paramStr}#${apiSecret}`;

        const hashBuffer = await crypto.subtle.digest("SHA-512", new TextEncoder().encode(stringToHash));
        const hashHex = [...new Uint8Array(hashBuffer)].map(b => b.toString(16).padStart(2, '0')).join('');
        const apiSig = `${rand}${hashHex}`;
        const fullURL = `https://codeforces.com/api/${method}?${paramStr}&apiSig=${apiSig}`;

        try {
            const res = await fetch(fullURL);
            const data = await res.json();

            if (data.status === "OK") {
                const user = data.result[0];
                console.log("Codeforces Basic Info:", user);
                displayCodeforcesBasicInfo(user);
            } else {
                throw new Error(data.comment);
            }

            const submissionsURL = `https://codeforces.com/api/user.status?handle=${handle}&from=1&count=10000`;
            const subRes = await fetch(submissionsURL);
            const subData = await subRes.json();

            if (subData.status === "OK") {
                const solvedData = processCodeforcesSubmissions(subData.result);
                displayCodeforcesSolvedStats(solvedData);
            } else {
                throw new Error(subData.comment);
            }

        } catch (err) {
            console.error("Codeforces API error:", err);
            alert("Failed to fetch Codeforces data.");
        }
    }


    function processCodeforcesSubmissions(submissions) {
        const solvedSet = new Set();
        let totalSubs = submissions.length;
        let acceptedCount = 0;
        const difficultyCount = { easy: 0, medium: 0, hard: 0 };

        submissions.forEach(sub => {
            if (sub.verdict === "OK") {
                const key = `${sub.problem.contestId}-${sub.problem.index}`;
                if (!solvedSet.has(key)) {
                    solvedSet.add(key);
                    acceptedCount++;
                    const rating = sub.problem.rating || 0;
                    if (rating <= 900) difficultyCount.easy++;
                    else if (rating <= 1200) difficultyCount.medium++;
                    else difficultyCount.hard++;
                }
            }
        });

        return {
            totalSolved: solvedSet.size,
            easySolved: difficultyCount.easy,
            mediumSolved: difficultyCount.medium,
            hardSolved: difficultyCount.hard,
            totalSubmissions: totalSubs,
            acceptanceRate: ((acceptedCount / totalSubs) * 100).toFixed(2)
        };
    }





    LeetcodeSearchButton.addEventListener('click', function () {
        const username = LeetcodeUsernameInput.value;
        const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
        const url2 = `https://alfa-leetcode-api.onrender.com/${username}/contest`;
        if (validateUsername(username)) {
            fetchUserDetails(username, url, LeetcodeSearchButton, "leetcode");
            // fetchUserDetails(username, url2, LeetcodeSearchButton, "leetcode");
        }
    });

    const CF_API_KEY = "4577466f6f3dfb4e02047d933f7cb9df7fd8c9fc";
    const CF_API_SECRET = "b5878eb5d29283345466da572edd5e80bad3df27";

    CodeforcesSearchButton.addEventListener("click", () => {
        const username = CodeforcesUsernameInput.value;
        if (validateUsername(username)) {
            getCodeforcesUserInfo(username, CF_API_KEY, CF_API_SECRET);
        }
    });


    CodechefSearchButton.addEventListener('click', function () {
        const handle = "";
        const url = `http://localhost:3000/codechef/${handle}`;
        if (validateUsername(handle)) {
            fetchUserDetails(handle, url, CodechefSearchButton, "codechef");
        }
    });

    function updateCombinedTotals() {
        const total = leetcodeSolved.total + codeforcesSolved.total;
        const easy = leetcodeSolved.easy + codeforcesSolved.easy;
        const medium = leetcodeSolved.medium + codeforcesSolved.medium;
        const hard = leetcodeSolved.hard + codeforcesSolved.hard;

        updateProgress(total, TotalSolvedLabel);
        updateProgress(easy, TotalEasySolvedLabel);
        updateProgress(medium, TotalMediumSolvedLabel);
        updateProgress(hard, TotalHardSolvedLabel);
    }


    function updateProgress (data, label) {
        label.textContent = `${data}`;
    }

    function displayLeetcodeData(parsedData, url, username) {
        if(url ===  `https://leetcode-stats-api.herokuapp.com/${username}`) {
            leetcodeSolved.total = parsedData.totalSolved || 0;
            leetcodeSolved.easy = parsedData.easySolved || 0;
            leetcodeSolved.medium = parsedData.mediumSolved || 0;
            leetcodeSolved.hard = parsedData.hardSolved || 0;

            updateProgress(leetcodeSolved.total, LeetcodeTotalValue);
            updateProgress(leetcodeSolved.easy, LeetcodeEasyValue);
            updateProgress(leetcodeSolved.medium, LeetcodeMediumValue);
            updateProgress(leetcodeSolved.hard, LeetcodeHardValue);
            updateProgress(parsedData.acceptanceRate, LeetcodeAcceptanceRateLabel);

            updateCombinedTotals();
        }
        if(url === `https://alfa-leetcode-api.onrender.com/${username}/contest`){
            console.log("secondleetcode");
            const LeetcodeContestRating = parsedData.contestRating;
            const LeetcodeContestRanking = parsedData.contestGlobalRanking;
            const LeetcodeTopPercentage = parsedData.contestTopPercentage;
            updateProgress(LeetcodeContestRating, LeetcodeContestRatingLabel);
            updateProgress(LeetcodeContestRanking, LeetcodeContestRankingLabel);
            updateProgress(LeetcodeTopPercentage, LeetcodeTopPercentageLabel);
        }
        

    }


    function displayCodeforcesBasicInfo(user) {
        updateProgress(user.rating || "Unrated" , CfContestRatingLabel);
    }

    function displayCodeforcesSolvedStats(data) {
        codeforcesSolved.total = data.totalSolved || 0;
        codeforcesSolved.easy = data.easySolved || 0;
        codeforcesSolved.medium = data.mediumSolved || 0;
        codeforcesSolved.hard = data.hardSolved || 0;

        updateProgress(codeforcesSolved.total, CfTotalSolvedLabel);
        updateProgress(codeforcesSolved.easy, CfEasySolvedLabel);
        updateProgress(codeforcesSolved.medium, CfMediumSolvedLabel);
        updateProgress(codeforcesSolved.hard, CfHardSolvedLabel);
        updateProgress(data.totalSubmissions, CfTotalSubmissionLable);
        updateProgress(data.acceptanceRate, CfAcceptanceRateLable);

        updateCombinedTotals();
    }


    // function displayCodechefData(data) {
    //     try {
    //         const totalSolved = data.total_problems_solved || 0;
    //         const easy = data.problems?.easy?.count || 0;
    //         const medium = data.problems?.medium?.count || 0;
    //         const hard = data.problems?.hard?.count || 0;
    //         const totalSubmissions = data.total_submissions || 0;

    //         const acceptanceRate = totalSubmissions === 0 ? "0.00" : ((totalSolved / totalSubmissions) * 100).toFixed(2);
    //         const stars = data.rating?.stars || "-";
    //         const contestRating = data.rating?.rating || "Unrated";

    //         updateProgress(totalSolved, CodechefTotalSolvedLabel);
    //         updateProgress(easy, CodechefEasySolvedLabel);
    //         updateProgress(medium, CodechefMediumSolvedLabel);
    //         updateProgress(hard, CodechefHardSolvedLabel);
    //         updateProgress(totalSubmissions, CodechefTotalSubmissionLabel);
    //         updateProgress(acceptanceRate, CodechefAceeptanceRateLabel);
    //         updateProgress(stars, CodechefStarsValueLabel);
    //         updateProgress(contestRating, CodechefContestRatingLabel);
    //     } catch (err) {
    //         console.error("Error parsing new CodeChef data:", err);
    //         alert("CodeChef data format error.");
    //     }
    // }
    
    window.addEventListener('load', () => {
    const modal = document.getElementById('popup-modal');
    const closeBtn = document.getElementById('close-popup');

    modal.style.display = 'block';

    closeBtn.onclick = () => {
        modal.style.display = 'none';
    };

 
    window.onclick = (event) => {
        if (event.target === modal) {
        modal.style.display = 'none';
        }
    };
    });





})

