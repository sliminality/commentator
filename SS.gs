/***************************************************************
onOpen : null -> void

- creates a menu for Commentator functions
****************************************************************/
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Commentator')
      .addItem('Update form roster', 'updateFormRoster')
      .addItem('Update form debates', 'updateFormDebateList')
      .addSeparator()
      .addItem('Upload and archive all', 'testSubmitTrigger')
      .addToUi();
}

/***************************************************************
testSubmitTrigger : null -> void

- creates a simulated Event based on contents of 'Form Responses 1'
- runs extractComments on the simulated Event
****************************************************************/
function testSubmitTrigger() {
  var dataRange = SpreadsheetApp.getActiveSheet().getDataRange();
  var data = dataRange.getValues();
  var headers = data[0];
  // Start at row 1, skipping headers in row 0
  for (var row=1; row < data.length; row++) {
    var e = {};
    e.values = data[row].filter(Boolean);  // filter: http://stackoverflow.com/a/19888749
    e.range = dataRange.offset(row,0,1,data[0].length);
    e.namedValues = {};
    // Loop through headers to create namedValues object
    // NOTE: all namedValues are arrays.
    for (var col=0; col<headers.length; col++) {
      e.namedValues[headers[col]] = [data[row][col]];
    }
    // Pass the simulated event to extractComments
    extractComments(e);
  }
}

/***************************************************************
extractComments : Event -> void

- takes a form submission Event and creates an array of four Comments
- passes array to displayComments();
****************************************************************/

function extractComments(e) {
  //EDIT VARIABLES HERE
  var url = 'https://sites.google.com/site/2015nudebateinstitute';
  var labPage = 'six-week-fitzmier-lundberg-abelkop';
  var commentsPage = 'six-week-fla-comments';
  
  //extract each student's comments from response
  var responses = e.namedValues;
  
  var judge = responses['Judge Name'][0];
  var debate = responses['Practice Debate'][0];
  
  //put student name and comments into array and create a Comment for each student
  var students = [];
  students[0] = [responses['1A'][0], responses['Comments for 1A'][0]];
  students[1] = [responses['2A'][0], responses['Comments for 2A'][0]];
  students[2] = [responses['1N'][0], responses['Comments for 1N'][0]];
  students[3] = [responses['2N'][0], responses['Comments for 2N'][0]];
  
  var comments = students.map(function(student) {
    return new Comment(debate, judge, student[0], student[1]);
  });
  
  //call displayComments
  displayComments(comments, url, labPage, commentsPage);
}

/***************************************************************
archiveResponses : null -> void

- moves all responses on the 'Form Responses 1' tab to 'Archive'
****************************************************************/

function archiveResponses() {
  var ss = SpreadsheetApp.getActive();
  var responseSheet = ss.getSheetByName('Form Responses 1');
  var responses = responseSheet.getRange(2, 1, responseSheet.getLastRow(), responseSheet.getLastColumn()).getValues();
  
  //copy responses to archive sheet
  var archiveSheet = ss.getSheetByName('Archive');
  
  archiveSheet.getRange(archiveSheet.getLastRow() + 1,
                        1,
                        responseSheet.getLastRow(),
                        responseSheet.getLastColumn()).setValues(responses);
  
  //clear original sheet except for header rule
  responseSheet.deleteRows(2, ss.getLastRow() - 1);
}

/***************************************************************
A Comment has:

- String debate: a practice debate
- String judge: a practice debate judge
- String student: a student in the practice debate
- String comments: judge comments for the student
****************************************************************/

function Comment(debate, judge, student, comments) {
  this.debate = debate;
  this.judge = judge;
  this.student = student;
  this.comments = comments;
}

/***************************************************************
logFormItemIDs : null -> void

- log item IDs for a given form
****************************************************************/

function logFormItemIDs() {
  var formID = '19Md_6mri520BH8ypnhrEXP2HSHu2nTlN6QJ_ZckMNfo';
  
  var form = FormApp.openById(formID);
  var items = form.getItems();
  for (i = 0; i < items.length; i++) {
    var id = items[i].getId();
    var title = items[i].getTitle();
    Logger.log(title + ': ' + id);
  }
}

/***************************************************************
sheetName : null -> String

- returns the name of the current sheet
****************************************************************/

function sheetName() {
  return SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getName();
}

/***************************************************************
studentCode : String -> String

- given a student name, returns the corresponding code
****************************************************************/

function studentCode(name) {
  var studentNames = getStudentNames();
  var studentCodes = getStudentCodes();
 
  //get data for student names and codes
  var index = studentNames.indexOf(name);
  return studentCodes[index];
}

/***************************************************************
studentName : String -> String

- given a student code, returns the corresponding name
****************************************************************/

function studentName(code) {
  var studentNames = getStudentNames();
  var studentCodes = getStudentCodes();
 
  //get data for student names and codes
  var index = studentCodes.indexOf(code);
  return studentNames[index];
}

/***************************************************************
getStudentNames : null -> String[]

- returns an array of student names
****************************************************************/

function getStudentNames() {
  var ss = SpreadsheetApp.getActive();
  var RosterSheet = ss.getSheetByName("Roster");
  
  var studentValues = RosterSheet.getRange(2, 1, RosterSheet.getMaxRows() - 1).getValues();
  var studentNames = [];
  for(var i = 0; i < studentValues.length; i++)    
    if(studentValues[i][0] != "")
      studentNames[i] = studentValues[i][0];
  
  return studentNames;
}

/***************************************************************
getStudentCodes : null -> String[]

- returns an array of student codes
****************************************************************/

function getStudentCodes() {
  var ss = SpreadsheetApp.getActive();
  var RosterSheet = ss.getSheetByName("Roster");
  
  var studentCodeValues = RosterSheet.getRange(2, 2, RosterSheet.getMaxRows() - 1).getValues();
  var studentCodes = [];
  for(var i = 0; i < studentCodeValues.length; i++)    
    if(studentCodeValues[i][0] != "")
      studentCodes[i] = studentCodeValues[i][0];

  return studentCodes;
}