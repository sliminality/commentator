/***************************************************************
displayComments : Comments[], String, String, String -> void

- loads a comments index page for a Google Site
- adds each Comment to the appropriate subpage
****************************************************************/

function displayComments(commentsArray, url, labPageName, commentsPageName) {
  //import pages
  var site = SitesApp.getSiteByUrl(url);
  var commentsPage = site.getChildByName("home").getChildByName(labPageName).getChildByName(commentsPageName);
  var studentPages = commentsPage.getChildren();
  
  //loop through Comments[] array and load the appropriate page
  for (var i = 0; i < commentsArray.length; i++) {
    
    //check to make sure student exists
    if (commentsArray[i].student) {
      //load page info
      var student = studentCode(commentsArray[i].student);
      var page = commentsPage.getChildByName(student.toLowerCase());
      var html = page.getHtmlContent();
    
      //get info to add to page and generate addition
      var debate = commentsArray[i].debate;
      var judge = commentsArray[i].judge;
      var comments = commentsArray[i].comments;
      var addition = '<h2>' + debate + ' &mdash; ' + judge + '</h2><p style="white-space: pre-wrap;">' + comments + '</p>';
    
      //add to page
      var top = "<table class='sites-layout-name-one-column sites-layout-hbox' cellspacing='0'><tbody><tr><td class='sites-layout-tile sites-tile-name-content-1'>";
      var output = top + addition + html.slice(145); //assumes a 145char top html substring
      page.setHtmlContent(output);
    }
  }
  
  //archive all Form Responses
  archiveResponses();
}