/* Form field IDs
[15-07-08 01:01:15:476 CDT] Judge Name: 43525939
[15-07-08 01:01:15:492 CDT] Practice Debate: 1445144735
[15-07-08 01:01:15:518 CDT] 1A: 360919578
[15-07-08 01:01:15:542 CDT] Comments for 1A: 80599934
[15-07-08 01:01:15:555 CDT] 2A: 1151492526
[15-07-08 01:01:15:571 CDT] Comments for 2A: 1750418357
[15-07-08 01:01:15:583 CDT] 1N: 1644951990
[15-07-08 01:01:15:607 CDT] Comments for 1N: 1114399512
[15-07-08 01:01:15:622 CDT] 2N: 1652246354
[15-07-08 01:01:15:637 CDT] Comments for 2N: 558994508
*/

/***************************************************************
updateFormDebateList : null -> void

- update the form view based on the 'DebateList' sheet
****************************************************************/

function updateFormDebateList() {
  //modify these
  var formID = '19Md_6mri520BH8ypnhrEXP2HSHu2nTlN6QJ_ZckMNfo';
  var debateListID = '1445144735';
  
  //import form items
  var form = FormApp.openById(formID);
  var debateList = form.getItemById(debateListID).asListItem();
  var ss = SpreadsheetApp.getActive();
  
  var debateSheet = ss.getSheetByName("DebateList");
  var debateVals = debateSheet.getRange(2, 1, debateSheet.getMaxRows() - 1).getValues();

  var debates = [];

  // convert 2D to 1D array and ignore empty cells
  for(var i = 0; i < debateVals.length; i++)    
    if(debateVals[i][0] != "")
      debates[i] = debateVals[i][0];
  
  //set the eventNames array in reverse-chronological order
  debates.reverse();

  // populate the list
  debateList.setChoiceValues(debates);
}

/***************************************************************
updateFormRoster : null -> void

- update the form view based on the 'Roster' sheet
****************************************************************/

function updateFormRoster() {
  //modify these
  var formID = '19Md_6mri520BH8ypnhrEXP2HSHu2nTlN6QJ_ZckMNfo';
  var studentLists = [360919578, //1A
                      1151492526, //2A
                      1644951990, //1N
                      1652246354] //2N
  
  //import form items
  var form = FormApp.openById(formID);
  var ss = SpreadsheetApp.getActive();
  
  var studentSheet = ss.getSheetByName("Roster");
  var studentVals = studentSheet.getRange(2, 1, studentSheet.getMaxRows() - 1).getValues();

  var students = [];

  // convert 2D to 1D array and ignore empty cells
  for(var i = 0; i < studentVals.length; i++)    
    if(studentVals[i][0] != "")
      students[i] = studentVals[i][0];
  
  for (var i = 0; i < studentLists.length; i++) {
    var item = form.getItemById(studentLists[i]).asListItem();
    item.setChoiceValues(students);
  }
}