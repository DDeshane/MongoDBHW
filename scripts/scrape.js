//Require request and cheerio, for our scrapes

var request = require("request");
var cheerio = require("cheerio");

var scrape = function (cb) {
    request("https://abcnews.go.com/", function(err, res, body){
        var $ = cheerio.load(body);
        var articles = [];
        $("article figcaption .caption-wrapper h1").each(function(i, element){
            var head = $(this).children("a").text().trim();
            var sum = $(this).children("a").attr("href").trim();

            if(head && sum){
                var headNeat = head.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
                var sumNeat = sum.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
                
                var dataToAdd = {
                    headline: headNeat,
                    summary: sumNeat
                };

                articles.push(dataToAdd);
            }
        });
        cb(articles);
    });
};

module.exports = scrape;