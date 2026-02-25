/*
    (PLEASE DO NOT DELETE THIS HEADER OR CREDIT!)

    User customizable settings below!
    Please refer to my guide over on https://virtualobserver.moe/ayano/comment-widget if you're confused on how to use this.
    The IDs at the top are a requirement but everything else is optional!
    Do not delete any settings even if you aren't using them! It could break the program.

    After filling out your options, just paste this anywhere you want a comment section
    (But change the script src URL to wherever you have this widget stored on your site!)

        <div id="c_widget"></div>
        <script src="comment-widget.js"></script>

    Have fun! Bug reports are encouraged if you happen to run into any issues.
    - Ayano (https://virtualobserver.moe/)
*/

// The values in this section are REQUIRED for the widget to work! Keep them in quotes!
// here's our link https://docs.google.com/forms/d/e/1FAIpQLScHAuGuvI3ox8mboxdzZRWW7O2sxiPe4i7lGC6Tk9rFYGpjPQ/viewform?usp=pp_url&entry.360310354=Email&entry.529349566=YES
const s_stylePath = 'darkly.css';
const s_formId = '1FAIpQLScHAuGuvI3ox8mboxdzZRWW7O2sxiPe4i7lGC6Tk9rFYGpjPQ';
const s_nameId = '360310354';
const s_websiteId = 'null';
const s_textId = '529349566';
const s_pageId = 'null';
const s_replyId = 'null';
const s_sheetId = '1p2rlbk0u6j8Ga-LOR2X0cfSQcoLb6lAB1VAh4Lct5gI';

// Misc - Other random settings
const s_commentsPerPage = 5; // The max amount of comments that can be displayed on one page, any number >= 1 (Replies not counted)
const s_maxLength = 500; // The max character length of a comment
const s_maxLengthName = 16; // The max character length of a name
const s_commentsOpen = true; // Change to false if you'd like to close your comment section site-wide (Turn it off on Google Forms too!)
const s_collapsedReplies = true; // True for collapsed replies with a button, false for replies to display automatically
const s_longTimestamp = false; // True for a date + time, false for just the date
let s_includeUrlParameters = false; // Makes new comment sections on pages with URL parameters when set to true (If you don't know what this does, leave it disabled)
const s_fixRarebitIndexPage = false; // If using Rarebit, change to true to make the index page and page 1 of your webcomic have the same comment section

// Text - Change what messages/text appear on the form and in the comments section (Mostly self explanatory)
const s_widgetTitle = 'Leave A Comment';
const s_nameFieldLabel = 'Name';
const s_websiteFieldLabel = 'Your Site';
const s_textFieldLabel = '';
const s_submitButtonLabel = 'Submit';
const s_loadingText = 'Loading comments...';
const s_noCommentsText = 'Comments temporarily unavailable';
const s_closedCommentsText = 'Comments are closed temporarily';
const s_websiteText = '&nbsp;'; // The links to websites left by users on their comments
const s_replyButtonText = 'Reply'; // The button for replying to someone
const s_replyingText = 'Replying to'; // The text that displays while the user is typing a reply
const s_expandRepliesText = 'Show Replies';
const s_leftButtonText = '<<';
const s_rightButtonText = '>>';

/*
    DO NOT edit below this point unless you are confident you know what you're doing!
    Everything else is automatic, you don't have to change anything else. ^^
    However, feel free to edit this code as much as you like! Just please don't remove my credit if possible <3
*/

// Fix the URL parameters setting for Rarebit just in case
if (s_fixRarebitIndexPage) {s_includeUrlParameters = true}

// Apply CSS
const c_cssLink = document.createElement('link');
c_cssLink.type = 'text/css';
c_cssLink.rel = 'stylesheet';
c_cssLink.href = 'consolidated.css';
document.getElementsByTagName('head')[0].appendChild(c_cssLink);

// HTML Form
const v_mainHtml = `
    <div id="c_inputDiv">
        <form id="c_form" onsubmit="c_submitButton.disabled = true; v_submitted = true;" method="post" target="c_hiddenIframe" action="https://docs.google.com/forms/d/e/${s_formId}/formResponse"></form>
    </div>
    <div id="c_container">${s_loadingText}</div>
`;
// NAME FIELD IS FOR EMAIL
// TEXT FIELD IS FOR CHECKBOX
const v_formHtml = `
    <h4 id="c_widgetTitle" style="font-family:Goldman, sans-serif;">${s_widgetTitle}</h4>
	
    <div id="c_nameWrapper" class="c-inputWrapper">
        <label class="c-label c-nameLabel" for="entry.${s_nameId}">${s_nameFieldLabel}</label>
        <input class="c-input c-nameInput" placeholder="..." name="entry.${s_nameId}" id="entry.${s_nameId}" type="text" maxlength="${s_maxLengthName}" required>
    </div>
	
	<div id="ww_textWrapper" class="c-inputWrapper">
		<input class="ww-CHECKBOX" name="entry.${s_textId}" id="entry.${s_textId}">
		<label for="entry.${s_textId}"> Remove from list (unsubscribe)</label><br>
	</div>

    <input class="btn btn-primary" id="c_submitButton" name="c_submitButton" type="submit" value="${s_submitButtonLabel}" disabled>
`;

// Insert main HTML to page
document.getElementById('ww_widget').innerHTML = v_mainHtml;
const c_form = document.getElementById('c_form');
if (s_commentsOpen) {c_form.innerHTML = v_formHtml} 
else {c_form.innerHTML = s_closedCommentsText}

// Initialize misc things
const c_container = document.getElementById('c_container');
let v_pageNum = 1;
let v_amountOfPages = 1;
let v_commentMax = 1;
let v_commentMin = 1;

// The fake button is just a dummy placeholder for when comments are closed
let c_submitButton;
if (s_commentsOpen) {c_submitButton = document.getElementById('c_submitButton')}
else {c_submitButton = document.createElement('button')}

// Add invisible page input to document
let v_pagePath = window.location.pathname;
if (s_includeUrlParameters) {v_pagePath += window.location.search}
if (s_fixRarebitIndexPage && v_pagePath == '/') {v_pagePath = '/?pg=1'}
const c_pageInput = document.createElement('input');
c_pageInput.value = v_pagePath; c_pageInput.type = 'text'; c_pageInput.style.display = 'none';
c_pageInput.id = 'entry.' + s_pageId; c_pageInput.name = c_pageInput.id; 
c_form.appendChild(c_pageInput);

// Add the invisible iFrame to the document for catching the default Google Forms submisson page
let v_submitted = false;
let c_hiddenIframe = document.createElement('iframe');
c_hiddenIframe.id = 'c_hiddenIframe'; c_hiddenIframe.name = 'c_hiddenIframe'; c_hiddenIframe.style.display = 'none'; c_hiddenIframe.setAttribute('onload', 'if(v_submitted){fixFrame()}');
c_form.appendChild(c_hiddenIframe);
c_hiddenIframe = document.getElementById('c_hiddenIframe');

// Fix the invisible iFrame so it doesn't keep trying to load stuff
function fixFrame() {
    v_submitted = false;
    c_hiddenIframe.srcdoc = '';
    getComments(); // Reload comments after submission
}
