$(document).ready(function(){
    //Reference to the article container div we will be rendering all artiles inside of
    var articleContainer =$(".article-container");
    //Adding event listeners for dynamically generated buttons for deleting articles,
    //pulling up article notes, saving article notes, and deleting article notes
    $(document).on("click", ".btn.delete",handleArticleDelete);
    $(document).on("click", ".btn.notes",handleArticleNotes);
    $(document).on("click", ".btn.save",handleNoteSave);
    $(document).on("click", ".btn.note-delete",handleNoteDelete);

    //initPage kicks everything off when the page is loaded
    initPage();

    function initPage(){
        //Empty the aricle container, run as AJAX requet for an saved headlines
        articleContainer.empty();
        $.get("/apiheadlines?saved=true").then(function(data){
            //If we have headlines, render them to the page 
            if (data && data.length){
                renderArticles(data);
            }else{
                //Or render a message explaing there is no article
                renderEmpty();
            }
            });
        }
    function renderArticle(articles){
        //This function handles appending HTML containing our article data to the page
        //We are passed an array of JSON containing all available articles in our database
        var articlePanels=[];
        //We pass each article JSON object to the createPanel function which returns a bootstrap
        //panel with our article data inside
        for (var i = 0; i < articles.length; i++){
            articlePanels.push(createPanel(articles[i]));
        }
        //Once we have all of the HTML for the articles stored in our articlePannels array,
        //append them to the articlePanels Container
        articleContainer.append(articlePanels);
    }

    function createPanel(article){
        
    }

    function renderEmpty(){
            //This function renders some HTML to the page explaining we don't have any articles to view
            //Using a joined array of HTML string data because it's easier to read/change than a
            //concatenated string
            var emptyAlert =
            $(["div class='alert alert-warning text-center'>",
            "<h4>Uh oh. We do not have any saved articles.</h4>",
            "</div>",
            "<div class='panel panel-default'>",
            "<div class='panel-heading text-center'>",
            "<h3>Would You Like to Browse Available Articles?</h3>",
            "</div>",
            "<div class='panel-body text-center'>",
            "<h4><a href='/'>Browse Articles</a></h4>",
            "</div>",
            "</div>"
            ].join(""));
            //Apending data to the page
            articleContainer.append(emptyAlert);
            }
    //