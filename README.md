# commentator
Commentator is a Google Apps Script addon that makes it easy for policy debate judges to publish individual student comments.

Judges submit comments for a debate or speech via a simple Google Form. Commentator reads the form results from a Google Sheet, and appends each student's comments to their individual Google Sites page.

Written by [Sarah Lim](http://sarahlim.com) for the 2015 [Northwestern Debate Institute](http://nhsi.northwestern.edu/debate-institute/). Contact the author for support and inquiries regarding custom installations.

## Demo
You can give Commentator a whirl [here](https://sites.google.com/a/sarahlim.com/commentator-demo/).

## To Do
* Allow whitespaced student codes

## Getting started
Depending on how overwhelming this looks, I offer support and custom installations -- just contact me.

1. **Set up and configure your Google Site ([example](https://sites.google.com/site/2015nudebateinstitute/home)).** Page hierarchy should be as follows:
```
|- Home
   |- Lab Page
      |- Lab Comments Page
         |- S1
         |- S2
```
If you click "Manage Site" and navigate to "Pages," your sitemap should look like the following:
![Google Site page hierarchy](https://cldup.com/D5Ji41uncT-3000x3000.png)

Each individual student's page should be named with a code for that student (e.g. initials). Commentator currently does not allow student codes to contain spaces.

**If you do not use sub-page hierarchies, Commentator will not work.** When creating a new page, select the option to "Put page under..." and choose the appropriate parent, rather than creating the page at the top level.
![Creating a sub-page](https://cldup.com/5TgTgWFBMq-1200x1200.png)

Tip: on the "Lab Comments Page," insert a Subpage Listing to automatically display links to all sub-pages.

2. **Copy the main sheet, and attach scripts.** Make a copy of [this sheet](https://docs.google.com/spreadsheets/d/1vTvlFovMUcyNTOOpluA67tOM9XwTZz6zvmJFmOTq5iQ/edit?usp=sharing).

Open up your copy of the sheet. In the menu, navigate to Tools > Script Editor.

In the Script Editor for your spreadsheet, navigate to File > New.
![Create a new script file](https://cldup.com/mSrvdSqWOa.png) and create a file called `Form.gs`. Copy and paste in the contents of `Form.gs` from this repo. Repeat for `SS.gs` and `Site.gs`.

3. **Copy and link the submission form.** Make a copy of [this form](https://docs.google.com/forms/d/1kJvUYSyfdG0HiC0eJAuKLHYSOdwOElH0HbQAfSbTTe0/edit?usp=sharing). Navigate to Responses > Choose response destination > New sheet in an existing spreadsheet and select the copy of the sheet you made in step 2.

4. **Configure the sheet.** Return to the sheet. Linking the form should have created a new tab called "Form Responses *x*." Delete the old tab and rename the newly-inserted tab such that your tab bar looks exactly as follows: 
![Tab bar](https://cldup.com/eVzalr0EVe-2000x2000.png)

**It's crucial that you have only one tab for responses, and that tab be called 'Form Responses 1'.**

In the "Config" tab, enter the complete URL of your lab's Comments Page on Google Sites, and the complete URL of your **published** Google Form (NOT the URL of the question editing interface).

From the menu, click Commentator > Configure form IDs. (If the Commentator option is missing, double-check that step 3 was completed correctly.) This should auto-populate the Form IDs section.

5. **Add your student roster and practice debates.** Navigate to the "Roster" tab of the sheet. Enter each student's full name in the left column, and their code in the right. The student code should match the name of that student's individual feedback page in step 1.

If you don't want to use codes to anonymize feedback pages, simply duplicate the contents of the "Student" column into the "Code" column.

From the menu, click Commentator > Update form rosters. This will auto-populate the 1A, 2A, 1N, and 2N drop-down selections in your comments submission form with the names of your students.

Navigate to the "DebateList" tab of the sheet. Enter each practice debate and date. Again, from the menu, click Commentator > Update form debate list. This will auto-populate the "Practice Debate" drop-down selection in your comments submission form.

6. **Set up triggers to automate uploading.** This step is technically optional. You can use Commentator without triggers, but you will need to manually run "Upload and archive all" from the Commentator menu (which is still much faster than manually editing each student's page).

Go back to the comment submission form, in edit mode. Navigate to the Script Editor again (Tools > Script Editor). Note that this is a DIFFERENT Script Editor than we previously used (that one was attached to our sheet; this one is attached to our form).

From the Script Editor, click Resources > Current project's triggers. Click the link to add a new trigger. In the "Run" field, choose `extractOnSubmit`. Under "Events," choose "From spreadsheet" and "On form submit." Grant authorization if prompted (necessary to allow site management).

And that's it! You've set up Commentator for your lab.

## Usage

Direct judges to fill out the comment submission form every time they judge a debate. If you've set up triggers, comments should automatically appear on individual students' pages whenever a judge submits the form. If you're not using triggers -- or if the trigger fails for whatever reason -- you can open up the response spreadsheet to use Commentator's manual upload tools.

Here's a description of each tab in the main sheet.

**Form Responses 1** is a "processing queue" for comments that have been submitted but not uploaded. You can see any comment whose upload failed here.

**Archive** is a log of all successfully uploaded comments. After a comment is uploaded, it is moved from Form Responses to the Archive.

**DebateList** is a list of all debates. Add events here and run "Update form debate list" to update the form. Judges can select from all listed debates when entering comments, and the selected debate will be uploaded to the student's feedback page along with their individual comments.

**Roster** stores a list of all students. Each row contains a student's full name (displayed on the submission form) and code (displayed on the website). Add students here and run "Update form rosters" to automatically update the drop-down boxes for 1A, 2A, 1N, and 2N to reflect the roster.

**Config** includes two fields for URLs, one for your Google Sites comments page and one for your Google Form.

If you've successfully added the script files to your spreadsheet, you should see the "Commentator" menu in the spreadsheet. Here is an explanation of what each action does.

**Configure form IDs** should be run once, whenever the submission form URL is updated. It takes the URL of a form and automatically retrieves information about each field, which Commentator needs to process submissions. You can ignore these values on the Config tab.

**Update form rosters** reads from the Roster tab and automatically updates the submission form 1A, 2A, 1N, and 2N fields to reflect the roster.
**Update form debate list** reads from the DebateList tab and automatically updates the comments submission form Practice Debate field to reflect the debate list.

**Upload all comments** uploads all comments in "Form Responses 1" to the Google Site, but does not move them to the Archive tab.
**Archive all comments** moves all comments in "Form Responses 1" to the Archive tab, but does not upload them to the Google Site.
**Upload and archive all** uploads all comments in "Form Responses 1" to the Google Site, then moves them to the Archive tab.