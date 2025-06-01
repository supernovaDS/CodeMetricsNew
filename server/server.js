const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");
const app = express();
const PORT = 3000;

app.use(cors());

app.get("/codechef/:handle", async (req, res) => {
    const handle = req.params.handle;
    const url = `https://www.codechef.com/users/${handle}`;

    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        const rating = {
            stars: $(".rating-star").text().trim() || null,
            rating: $(".rating-number").text().trim() || null
        };

        let total_problems_solved = 0;
        let total_submissions = 0;

        const problems = {
            easy: { count: 0 },
            medium: { count: 0 },
            hard: { count: 0 }
        };

      
        const solvedText = $(".rating-data-section.problems-solved").text();
        const match = solvedText.match(/Fully Solved \((\d+)\)/);
        if (match) {
            total_problems_solved = parseInt(match[1]);
        }

       
        $(".problems-solved a").each((i, el) => {
            const href = $(el).attr("href");
            const text = $(el).text();
            const count = parseInt(text.match(/\((\d+)\)/)?.[1] || 0);
            if (href.includes("/easy")) problems.easy.count = count;
            if (href.includes("/medium")) problems.medium.count = count;
            if (href.includes("/hard")) problems.hard.count = count;
        });

       
        const activityText = $("section.activity-section p").first().text();
        const submissionMatch = activityText.match(/(\d+) submissions/);
        if (submissionMatch) {
            total_submissions = parseInt(submissionMatch[1]);
        }

        res.json({
            rating,
            problems,
            total_problems_solved,
            total_submissions
        });
    } catch (error) {
        console.error("Scraping failed:", error);
        res.status(500).json({ error: "Failed to scrape CodeChef profile." });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
