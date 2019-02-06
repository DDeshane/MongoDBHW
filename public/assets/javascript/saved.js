$(document).ready(function () {
    //Reference to the article container div we will be rendering all artiles inside of
    var articleContainer = $(".article-container");
    //Adding event listeners for dynamically generated buttons for deleting articles,
    //pulling up article notes, saving article notes, and deleting article notes
    $(document).on("click", ".btn.delete", handleArticleDelete);
    $(document).on("click", ".btn.notes", handleArticleNotes);
    $(document).on("click", ".btn.save", handleNoteSave);
    $(document).on("click", ".btn.note-delete", handleNoteDelete);

    //initPage kicks everything off when the page is loaded
    initPage();

    function initPage() {
        //Empty the aricle container, run as AJAX requet for an saved headlines
        articleContainer.empty();
        $.get("/apiheadlines?saved=true").then(function (data) {
            //If we have headlines, render them to the page 
            if (data && data.length) {
                renderArticles(data);
            } else {
                //Or render a message explaing there is no article
                renderEmpty();
            }
        });
    }
    function renderArticle(articles) {
        //This function handles appending HTML containing our article data to the page
        //We are passed an array of JSON containing all available articles in our database
        var articlePanels = [];
        //We pass each article JSON object to the createPanel function which returns a bootstrap
        //panel with our article data inside
        for (var i = 0; i < articles.length; i++) {
            articlePanels.push(createPanel(articles[i]));
        }
        //Once we have all of the HTML for the articles stored in our articlePannels array,
        //append them to the articlePanels Container
        articleContainer.append(articlePanels);
    }

    function createPanel(article) {
        //This function takes in a single JSON object for an article/headline
        //It constructs a jQuery element containing all of the formatted HTML for the
        //article panel
        var panel =
            $(["<div class='panel panel-default'>",
                "<div class='panel-heading'>",
                "<h3>",
                article.headline,
                "<a class='btn btn-danger delete'>",
                "Delete From Saved",
                "</a>",
                "<a class='btn btn-info notes'>Article Notes</a>",
                "</h3>",
                "</div>",
                "<div class='panel-body'>",
                article.summary,
                "</div>",
                "</div>"
            ].join(""));
        //Attach the article's id to the jQuery element
        //Use this when trying to figure out which article the user wants to remove or open
        //notes for
        panel.data("_id", article._id);
        //Return the constructed panel jQuery element
        return panel;
    }
    function renderNotesList(data){
        //This function handles rendering note list to our notes modal
        //Setting up an array of notes to render after finished
        //Also setting up a currentNote variable to temporarily store each note
        var notesToRender = [];
        var currentNote;
        if(!data,notes.length){
            //If we have no notes, just display a message explaining this 
            currentNote = [
                "<li class='list-group-item'>",
                "No notes for this article yet.",
                "</li>"
            ].join("");
            notesToRender.push(currentNote);
        }else{
            //If we do have notes, go through each one
            for (var i=0;i<data.notes.length; i++){
                //Constructs an Li element to contain our noteText and a delete button
                currentNote= $([
                    "<li class='list-group-item note'>",
                    data.notes[i].noteText,
                    "<button class='btn btn-danger note-delete'>x</button>",
                    "</li>"
                ].join(""));
                //Store the id on the delete button for east access when trying to delete
                currentNote.children("button").data("_id",data.notes[i]._id);
                //adding our currentNote to the notesToRender array
                notesToRender.push(currentNote);
            }
        }
        //Now append the notesToRender to the note-container inside the note modal
        $(".not-container").append(notesToRender);
            }
        },

    function handleArticleDelete() {
        //This function handles deleting articles/headlines
        //We grab the id of the article to delete from the panel element the delete button sits insde
        var articleToDelete = $(this).parents(".panel").data();
        //Using a delete method here just to be semantic since we are deleting an article/headline
        $.ajax({
            method: "Delete",
            url: "/api/headlines/" + articleToDelete._id,
        }).then(function (data) {
            //If it works, run initPage again which will rerender our list of saved articles
            if (data.ok) {
                initPage();
            }
        });
    }
    function handleArticleNotes() {
        //This function handles pending the notes modal and displaying our notes
        //we grab the id of the article to get notes for from the panel element the delete button sits
        //inside
        var currentArticle = $(this).parents(".panel").data();
        //Grab any notes with this headline/article id
        $.get("/api/notes/" + currentArticle._id).then(function (data) {
            //constructing our initial HTML to add to the notes modal
            var modalText = [
                "<div class='container-fluid text-center'>",
                "<h4>Notes For Article:",
                currentArticle._id,
                "</h4>",
                "<hr />",
                "<ul class='list-group note-container'>",
                "</ul>",
                "<textarea placeholder='New Note' rows='4' cols='60'></textarea>",
                "<button class= 'btn btn-success save'>Save Note</button>",
                "</div>"
            ].join("");
            //Adding the formatted HTML to the note modal
            bootbox.dialog({
                message: modalText,
                closeButton: true
            });han
            var noteData = {
                _id:currentArticle._id,
                notes:data || []
            };
            //Adding some information about the article and articl notes to the save button for easy
            //access
            //When trying to add a new note
            $(".btn.save").data("article", noteData);
            //renderNotesList will populate the actual note HTML inside of the modal we just created/
            //opened
            renderNotesList(noteData);
        });
    }

    function handleNoteSave(){
        //This function handles what happens when a user tries to save a new note for an article
        //Setting a variable to hold some formatted data about our note,
        //grabbing the note typed into the input box
        var noteData;
        var newNote = $(".bootbox-body textarea").val().trim();
        //If we have data typed into the note input field, format it 
        //and post it to the "/api/notes" route and send the formatted noteData as well
        if (newNote){
            noteData={
                
            }
        }
    }
        function renderEmpty() {
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
