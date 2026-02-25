/*
    (PLEASE DO NOT DELETE THIS HEADER OR CREDIT!)

    User customizable settings below!
    Please refer to my guide over on https://virtualobserver.moe/ayano/comment-widget if you're confused on how to use this.
    The IDs at the top are a requirement but everything else is optional!
    Do not delete any settings even if you aren't using them! It could break the program.

    After filling out your options, just paste this anywhere you want a comment section
    (But change the script src URL to wherever you have this widget stored on your site!)

        <div id="wwc_widget"></div>
        <script src="comment-widget.js"></script>

    Have fun! Bug reports are encouraged if you happen to run into any issues.
    - Ayano (https://virtualobserver.moe/)
*/

// The values in this section are REQUIRED for the widget to work! Keep them in quotes!
// here's our link https://docs.google.com/forms/d/e/1FAIpQLScHAuGuvI3ox8mboxdzZRWW7O2sxiPe4i7lGC6Tk9rFYGpjPQ/viewform?usp=pp_url&entry.360310354=Email&entry.529349566=YES
const wws_stylePath = 'darkly.css';
const wws_formId = '1FAIpQLScHAuGuvI3ox8mboxdzZRWW7O2sxiPe4i7lGC6Tk9rFYGpjPQ';
const wws_nameId = '360310354';
const wws_textId = '529349566';
const wws_sheetId = '1p2rlbk0u6j8Ga-LOR2X0cfSQcoLb6lAB1VAh4Lct5gI';

// Misc - Other random settings
const wws_commentsPerPage = 5; // The max amount of comments that can be displayed on one page, any number >= 1 (Replies not counted)
const wws_maxLength = 500; // The max character length of a comment
const wws_maxLengthName = 16; // The max character length of a name
const wws_commentsOpen = true; // Change to false if you'd like to close your comment section site-wide (Turn it off on Google Forms too!)
const wws_collapsedReplies = true; // True for collapsed replies with a button, false for replies to display automatically
const wws_longTimestamp = false; // True for a date + time, false for just the date
let wws_includeUrlParameters = false; // Makes new comment sections on pages with URL parameters when set to true (If you don't know what this does, leave it disabled)
const wws_fixRarebitIndexPage = false; // If using Rarebit, change to true to make the index page and page 1 of your webcomic have the same comment section

// Text - Change what messages/text appear on the form and in the comments section (Mostly self explanatory)
const wws_widgetTitle = 'Leave A Comment';
const wws_nameFieldLabel = 'Email';
const wws_websiteFieldLabel = 'Your Site';
const wws_textFieldLabel = '';
const wws_submitButtonLabel = 'Submit';
const wws_loadingText = 'Loading comments...';
const wws_noCommentsText = 'Comments temporarily unavailable';
const wws_closedCommentsText = 'Comments are closed temporarily';
const wws_websiteText = '&nbsp;'; // The links to websites left by users on their comments
const wws_replyButtonText = 'Reply'; // The button for replying to someone
const wws_replyingText = 'Replying to'; // The text that displays while the user is typing a reply
const wws_expandRepliesText = 'Show Replies';
const wws_leftButtonText = '<<';
const wws_rightButtonText = '>>';

/*
    DO NOT edit below this point unless you are confident you know what you're doing!
    Everything else is automatic, you don't have to change anything else. ^^
    However, feel free to edit this code as much as you like! Just please don't remove my credit if possible <3
*/

// Fix the URL parameters setting for Rarebit just in case
if (wws_fixRarebitIndexPage) {wws_includeUrlParameters = true}

// Apply CSS
const wwc_cssLink = document.createElement('link');
wwc_cssLink.type = 'text/css';
wwc_cssLink.rel = 'stylesheet';
wwc_cssLink.href = 'consolidated.css';
document.getElementsByTagName('head')[0].appendChild(wwc_cssLink);

// HTML Form
const wwv_mainHtml = `
    <div id="wwc_inputDiv">
        <form id="wwc_form" onsubmit="wwc_submitButton.disabled = true; wwv_submitted = true;" method="post" target="wwc_hiddenIframe" action="https://docs.google.com/forms/d/e/${wws_formId}/formResponse"></form>
    </div>
`;

// NAME FIELD IS FOR EMAIL
// TEXT FIELD IS FOR CHECKBOX
const wwv_formHtml = `
    <div id="wwc_nameWrapper" class="c-inputWrapper">
        <label class="c-label c-nameLabel" for="entry.${wws_nameId}">${wws_nameFieldLabel}</label>
        <input class="c-input c-nameInput" placeholder="..." name="entry.${wws_nameId}" id="entry.${wws_nameId}" type="text" required>
    </div>
	
	<div id="ww_textWrapper" class="c-inputWrapper">
		<input type="checkbox" class="ww-CHECKBOX" name="entry.${wws_textId}" id="entry.${wws_textId}">
		<label for="entry.${wws_textId}"> Remove from list (unsubscribe)</label><br>
	</div>

    <input class="btn btn-primary" id="wwc_submitButton" name="wwc_submitButton" type="submit" value="${wws_submitButtonLabel}">
`;

// Insert main HTML to page
document.getElementById('ww_widget').innerHTML = wwv_mainHtml;
const wwc_form = document.getElementById('wwc_form');
if (wws_commentsOpen) {wwc_form.innerHTML = wwv_formHtml} 
else {wwc_form.innerHTML = wws_closedCommentsText}

// Initialize misc things
const wwc_container = document.getElementById('wwc_container');
let wwv_pageNum = 1;
let wwv_amountOfPages = 1;
let wwv_commentMax = 1;
let wwv_commentMin = 1;

// The fake button is just a dummy placeholder for when comments are closed
let wwc_submitButton;
if (wws_commentsOpen) {wwc_submitButton = document.getElementById('wwc_submitButton')}
else {wwc_submitButton = document.createElement('button')}

// Add invisible page input to document
let wwv_pagePath = window.location.pathname;
if (wws_includeUrlParameters) {wwv_pagePath += window.location.search}
if (wws_fixRarebitIndexPage && wwv_pagePath == '/') {wwv_pagePath = '/?pg=1'}
const wwc_pageInput = document.createElement('input');
wwc_pageInput.value = wwv_pagePath; wwc_pageInput.type = 'text'; wwc_pageInput.style.display = 'none';
wwc_pageInput.id = 'entry.' + wws_pageId; wwc_pageInput.name = wwc_pageInput.id; 
wwc_form.appendChild(wwc_pageInput);

// Add the invisible iFrame to the document for catching the default Google Forms submisson page
let wwv_submitted = false;
let wwc_hiddenIframe = document.createElement('iframe');
wwc_hiddenIframe.id = 'wwc_hiddenIframe'; wwc_hiddenIframe.name = 'wwc_hiddenIframe'; wwc_hiddenIframe.style.display = 'none'; wwc_hiddenIframe.setAttribute('onload', 'if(wwv_submitted){wwfixFrame()}');
wwc_form.appendChild(wwc_hiddenIframe);
wwc_hiddenIframe = document.getElementById('wwc_hiddenIframe');

// Fix the invisible iFrame so it doesn't keep trying to load stuff
function wwfixFrame() {
    wwv_submitted = false;
    wwc_hiddenIframe.srcdoc = '';
    getEmailsub(); // Reload comments after submission
}

// Processes comment data with the Google Sheet ID
function getEmailsub() {
    // Disable the submit button while comments are reloaded
    wwc_submitButton.disabled;

    // Reset reply stuff to default
    wwc_replyingText.style.display = 'none';
    wwc_replyInput.value = '';

    // Clear input fields too
    if (wws_commentsOpen) {
        document.getElementById(`entry.${wws_nameId}`).value = '';
        document.getElementById(`entry.${wws_websiteId}`).value = '';
        document.getElementById(`entry.${wws_textId}`).value = '';
    }
	
    wwc_submitButton.disabled = false // Now that everything is done, re-enable the submit button
}
