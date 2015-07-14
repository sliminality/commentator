/***************************************************************
updateFormDebateList : null -> void

- update the form view based on the 'DebateList' sheet
****************************************************************/

function updateFormDebateList() {
  //get form item IDs from Config sheet
  var ss = SpreadsheetApp.getActive();
  var configSheet = ss.getSheetByName('Config');
  var ids = configSheet.getRange(6, 1, configSheet.getLastRow() - 5, configSheet.getLastColumn());
  var debateListID = ids.getCell(2, 2).getValue();
  
  //import form items
  var formURL = getFormURL();
  var form = FormApp.openByUrl(formURL);
  
  //get values from DebateList sheet
  var debateSheet = ss.getSheetByName("DebateList");
  var debateVals = debateSheet.getRange(2, 1, debateSheet.getMaxRows() - 1).getValues();

  var debates = [];
  
  // convert 2D to 1D array and ignore empty cells
  for(var i = 0; i < debateVals.length; i++)    
    if(debateVals[i][0] != "")
      debates[i] = debateVals[i][0];
  
  //set the debates array in reverse-chronological order
  debates.reverse();
  
  // populate the list
  var debateList = form.getItemById(debateListID).asListItem();
  debateList.setChoiceValues(debates);
}

/***************************************************************
updateFormRoster : null -> void

- update the form view based on the 'Roster' sheet
****************************************************************/

function updateFormRoster() {
  //get form item IDs from Config sheet
  var ss = SpreadsheetApp.getActive();
  var configSheet = ss.getSheetByName('Config');
  var ids = configSheet.getRange(6, 1, configSheet.getLastRow() - 5, configSheet.getLastColumn());
  var studentLists = [ids.getCell(3, 2).getValue(), //1A
                      ids.getCell(5, 2).getValue(), //2A
                      ids.getCell(7, 2).getValue(), //1N
                      ids.getCell(9, 2).getValue() //2N
                     ];
  Logger.log(studentLists);
  
  //import form
  var formURL = getFormURL();
  var form = FormApp.openByUrl(formURL);
  
  //get values from Roster sheet
  var studentSheet = ss.getSheetByName("Roster");
  var studentVals = studentSheet.getRange(2, 1, studentSheet.getMaxRows() - 1).getValues();

  var students = [];

  // convert 2D to 1D array and ignore empty cells
  for(var i = 0; i < studentVals.length; i++)    
    if(studentVals[i][0] != "")
      students[i] = studentVals[i][0];
  
  //set form values for each student field
  for (var i = 0; i < studentLists.length; i++) {
    var item = form.getItemById(studentLists[i]).asListItem();
    item.setChoiceValues(students);
  }
}

/***************************************************************
logFormItemIDs : String -> Array[]

- log item IDs for a given Form
- return a 2D array of Item titles and IDs
****************************************************************/

function logFormItemIDs() {
  var form = FormApp.openByUrl(formURL);
  var items = form.getItems();
  var ids = [];
  
  for (i = 0; i < items.length; i++) {
    var id = items[i].getId();
    var title = items[i].getTitle();
    Logger.log(title + ': ' + id);
    ids[i] = [title, id];
  }
  
  return ids;
}