$(document).ready(function(){
//Reference the div where dynamic content will be stored
//event lister for "save article"
//scrape new article button
var articleContainer = $(".article-container");
$(document).on("click","btn.save", handleArticleSave);
$(document).on("click", ".scrape-new", handleArticleScrape);

//Run initPage
initPage();

function initPage(){
    //Empty container, run AJAX for unsaved headlines
    articleContainer.empty();
    $.get("/api/headlines?saved=false")
    .then(function(data){
        //add new headlines if available
        if (data && data.length){
            renderArticles(data);
        }
        else{
            //else alert user no articles
            renderEmpty();
        }
    });
}
function renderArticles(articles){
//This appends HTML article to the page
//Use JSON for all available articles in database
var articlePanels = [];
//Pass each article JSON object to the CreatePanel funtion which returns a bootstrap
//panel with or article data inside
for (var i =0; i < articles.length; i++){
    articlePanels.push(createPanel(articles[i]));
}
//Once all HTML articles are stored in array, append to articlePanels container
articleContainer.append(articlePanels);
}

function createPanel(article){
    //This funcion takes in a single JSON object for an article/headline
    //It contructs a jQuery element containg all of the formatted HTML for the
    // article panel
    var panel = 
    $(["<div class ='panel panel-default'>",
    "<div class='panel-heading'>",
    "<h3>",
    article.headline,
    "<a class='btn btn-success save'>",
    "Save Article",
    "</a>",
    "</h3>",
    "</div>",
    "<div class='panel-body'>",
    article.summary,
    "</div>",
    "</div>"
].join(""));
//Attach article's id to the jQuery element
//This will let us know what article to save
panel.data("_id", article._id);
//Return constructed panel jQuery element
return panel; 
}

function renderEmpty(){
//This function renders some HTML to the pageexplaining we don't have any articles to view
//Using a joined array of HTML string data because it's easier to read/change than a
//concatenated string
var emptyAlert =
$(["div class='alert alert-warning text-center'>",
"<h4>Uh oh. No new articles.</h4>",
"</div>",
"<div class='panel panel-default'>",
"<div class='panel-heading text-center'>",
"<h3>What Would You Like To Do?</h3>",
"</div>",
"<div class='panel-body text-center'>",
"<h4><a class='scrape-new'>Try Scraping New Articles</a></h4>",
"<h4><a href='/saved'>Go to Saved Articles</a></h4>",
"</div>",
"</div>"
].join(""));
//Apending data to the page
articleContainer.append(emptyAlert);
}

function handleArticleSave() {
    //This function is used when the user wants to save an article
    //When we rendered the article initially, we attached a javascript object containing
    //the headline id
    //to the element using the .data method. Here we call it.
    var articleToSave = $(this).parents(".panel").data();
    articleToSave.saved = true;
    //Using Patch
    $.ajax({
        method:"PATCH",
        url:"/api/headlines",
        data: articleToSave
    })
    .then(function(data){
        //If it works, mongoose will send back an object containg a key of"ok" with the value of
        //1
        //this casts to true
        if (data.ok){
            //Run the init Page function again. This will reload the entire list of articles
            initPage();
        }
    });
}
function handleArticleScrape(){
    //This function handlesthe user cling any "scrape new artcle" buttons

}$.get("/api/fetch")
.then(function(data){
    //If we are able to succesfully scrape the NYTIMES and compare the articles to those
    //already in our collection, re render the articles on the page
    //and let the user know how many unique articles we wre able to save
    initPage();
    bootbox.alert("<h3 class='text-center m-top-80'>"+ data.message + "<h3>");
});
});

