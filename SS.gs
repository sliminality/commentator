/***************************************************************
onOpen : null -> void

- creates a menu for Commentator functions
****************************************************************/

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Commentator')
      .addItem('Configure form IDs', 'configFormItems')
      .addSeparator()
      .addItem('Update form rosters', 'updateFormRoster')
      .addItem('Update form debate list', 'updateFormDebateList')
      .addSeparator()
      .addItem('Upload all comments', 'testSubmitTrigger')
      .addItem('Archive all comments', 'archiveResponses')
      .addItem('Upload and archive all', 'uploadAndArchive')
      .addToUi();
}

/***************************************************************
extractOnSubmit : Event -> void

- handles a form submission Event and passes it to extractComments
- archives the response row
****************************************************************/

function extractOnSubmit(e) {
  extractComments(e);
  
  var ss = SpreadsheetApp.getActive();
  var archiveSheet = ss.getSheetByName('Archive');
  var responseSheet = ss.getSheetByName('Form Responses 1');
  
  var dest = archiveSheet.getRange(archiveSheet.getLastRow() + 1, 1, 1);
  e.range.copyTo(dest);
  
  responseSheet.deleteRow(e.range.getRow());
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
  //extract each student's comments from response
  var responses = e.namedValues;
  
  var judge = responses['Judge Name'][0];
  var debate = responses['Practice Debate'][0];
  
  //arbitrary ordering of students
  var students = ['1A', '2A', '1N', '2N'];
  
  //generate comments based for each student in list
  //pulls name of name of debate, name of judge, name of student, comments for student
  var comments = students.map(function(student) {
    return new Comment(debate, judge, responses[student][0], responses['Comments for ' + student][0]]);
  });
 
  //call displayComments
  displayComments(comments);
}

/***************************************************************
archiveResponses : null -> void

- moves all responses on the 'Form Responses 1' tab to 'Archive'
****************************************************************/

function archiveResponses() {
  var ss = SpreadsheetApp.getActive();
  var responseSheet = ss.getSheetByName('Form Responses 1');
  
  //make sure responses exist
  if ((responseSheet.getLastRow() - 1) > 0) {
    var responses = responseSheet.getRange(2, 1, responseSheet.getLastRow() - 1, responseSheet.getLastColumn()).getValues();
    var archiveSheet = ss.getSheetByName('Archive');
  
    //copy responses to archive sheet
    archiveSheet.getRange(archiveSheet.getLastRow() + 1,
                          1,
                          responseSheet.getLastRow(),
                          responseSheet.getLastColumn()).setValues(responses);
  
    //clear original sheet except for header rule
    responseSheet.deleteRows(2, responseSheet.getLastRow() - 1);
  }
}

/***************************************************************
uploadAndArchive : null -> void

- uploads all comments on the 'Form Responses 1' sheet
- moves all comments from 'Form Responses 1' to 'Archive'
****************************************************************/

function uploadAndArchive() {
  testSubmitTrigger();
  archiveResponses();
}

/***************************************************************
configFormItems : null -> void

- sets Form item values in Config sheet
****************************************************************/

function configFormItems() {
  var ss = SpreadsheetApp.getActive();
  
  //get form URL from Config sheet
  var configSheet = ss.getSheetByName('Config');
  var urls = configSheet.getRange(2, 1, 2, configSheet.getMaxColumns());
  var formURL = urls.getCell(2, 2).getValue();
  
  //set range with IDs
  var values = logFormItemIDs(formURL);
  var range = configSheet.getRange(6, 1, values.length, configSheet.getMaxColumns());
  
  Logger.log(values);
  range.setValues(values);
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
getFormURL : null -> String

- returns the form URL specified in the Config sheet
****************************************************************/

function getFormURL() {
  var ss = SpreadsheetApp.getActive();
  var configSheet = ss.getSheetByName('Config');
  var urls = configSheet.getRange(2, 1, 2, configSheet.getMaxColumns());
  var formURL = urls.getCell(2, 2).getValue();
  
  return formURL;
}

/***************************************************************
getCommentsURL : null -> String

- returns the comments page URL specified in the Config sheet
****************************************************************/

function getCommentsURL() {
  var ss = SpreadsheetApp.getActive();
  var configSheet = ss.getSheetByName('Config');
  var urls = configSheet.getRange(2, 1, 2, configSheet.getMaxColumns());
  var commentsURL = urls.getCell(1, 2).getValue();
  
  return commentsURL;
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
