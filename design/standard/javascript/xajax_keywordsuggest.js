/*
    http://www.webreference.com/programming/javascript/ncz/index.html
    http://www.webreference.com/programming/javascript/ncz/column2/index.html
    http://www.webreference.com/programming/javascript/ncz/column3/

    http://www.sitepoint.com/article/life-autocomplete-textboxes
*/

function initKeywordSuggest(e)
{
    if (!e){
       var e=window.event;
    }

    if (arguments.callee.done) {
        return;
    }

    // flag this function so we do not do the same thing twice
    arguments.callee.done = true;

    var inputs = document.getElementsByTagName( 'input' );
    var c = inputs.length;
    //window.alert( 'number of input elements: '+ c);
    var i;
    var searchClass = 'xajax-keyword-suggest';
    // if you use \b for word boundaries, then a class name of foo-bar will also be matched when searching for foo
    var pattern = new RegExp("(^|\\s)"+searchClass+"(\\s|$)");
    var id;
    for (i=0;i<c;i++) {
        if ( pattern.test( inputs[i].className ) )
        {
            //alert( 'found a keyword suggestion box' );
            id = inputs[i].id;
            inputs[i].setAttribute( 'autocomplete', 'off' );
            inputs[i].onkeyup = function (oEvent) {
                if (!oEvent) {
                    oEvent = window.event;
                }
                return handleKeyUp(id, oEvent);
            };
            inputs[i].onkeydown = function(oEvent) {
                if (!oEvent)
                {
                    oEvent = window.event;
                }
                return handleKeyDown(id, oEvent);
            };
        }
    }
}

if (document.addEventListener) {
    document.addEventListener("DOMContentLoaded", initKeywordSuggest, false );
    // fallback for browsers supporting addEventListener but not the DOMContentLoaded event
    window.addEventListener("load", initKeywordSuggest, false );
} else if (window.attachEvent) {
    // IE
    window.attachEvent("onload", initKeywordSuggest);
};

// handle up and down arrow keys, to scroll between autosuggest values
function handleKeyDown(textBoxID, oEvent)
{
    var c = oEvent.keyCode || oEvent.which;

    if (c == 38 || c == 40)
    {
        //window.alert( 'up or down key pressed' );
        // cancel default behavior on key down (moving to the left or the right in the text input box)
        return false;
    }
}

function handleKeyUp(textBoxID, oEvent)
{
    var textBox = document.getElementById( textBoxID );
    var sTextBoxValue = textBox.value;

    // only continue when we are at the end of the line
    var currentPos = getCaretPos(textBox);
    if ( currentPos != sTextBoxValue.length ) {
        return false;
    }

    var parts = sTextBoxValue.split(',');
    var keyword = parts.pop();

    // left trim it
    keyword = keyword.replace(/^\s+/g,'');
    //window.alert( keyword );

    if ( keyword.length == 0 ) {
        var layer = document.getElementById( 'suggestions' );
        if ( layer ) {
            hideSuggestions( layer );
        }
        return false;
    }

    var tid = setTimeout( 'realHandleKeyUp("' + textBoxID + '", ' + oEvent.keyCode + ', "' +  sTextBoxValue + '")', 800 );
    return true;
}

function getCaretPos(el) {
var rng, ii=-1;
if(typeof el.selectionStart=="number") {
ii=el.selectionStart;
} else if (document.selection && el.createTextRange){
rng=document.selection.createRange();
rng.collapse(true);
rng.moveStart("character", -el.value.length);
ii=rng.text.length;
}
return ii;
}

function realHandleKeyUp( textBoxID, iKeyCode, sTextBoxOldValue )
{
    var textBox = document.getElementById( textBoxID );
    var sTextBoxValue = textBox.value;

    if (sTextBoxOldValue != sTextBoxValue) {
        return false;
    }

    var parts = sTextBoxValue.split(',');
    var keyword = parts.pop();

    //window.alert( keyword );

    // left trim it
    keyword = keyword.replace(/^\s+/g,'');
    //window.alert( keyword );

    if (iKeyCode == 8 || iKeyCode == 46) {
        xajax_keywordSuggest(keyword, textBoxID, 0);
    }

    if (iKeyCode < 32 || (iKeyCode >= 33 && iKeyCode <= 46) || (iKeyCode >= 112 && iKeyCode <= 123)) {
    //ignore
    } else {
        xajax_keywordSuggest(keyword, textBoxID, 1);
    }
}

function autoSuggest(textBoxID, aSuggestions, bTypeAhead)
{
    //window.alert( 'auto suggest with ' + aSuggestions.length + 'results: ' + "\r\n" + aSuggestions.join( "\r\n" ) );
    if (aSuggestions.length > 0 ) {
        if ( bTypeAhead ) {
            typeAhead(textBoxID, aSuggestions[0]);
        }

        if (aSuggestions.length > 1 ) {
            showSuggestions( textBoxID, aSuggestions );
        } else {
            var layer = document.getElementById( 'suggestions' );
            if ( layer ){
                hideSuggestions( layer );
            }
        }
    } else {
        var layer = document.getElementById( 'suggestions' );
        if ( layer ) {
            hideSuggestions( layer );
        }
    }
}

function typeAhead(textBoxID, sSuggestion)
{
    textBox = document.getElementById( textBoxID );
    sTextBoxValue = textBox.value;
    var parts = sTextBoxValue.split(',');
    var keyword = parts.pop();
    var leftTrimmedKeyword = keyword.replace(/^\s+/g,'');

    var lenDiff = keyword.length - leftTrimmedKeyword.length;
    var leftSpace = keyword.substr(0,lenDiff);

    if (textBox.createTextRange || textBox.setSelectionRange) {
        var iLen = sTextBoxValue.length;
        selectSuggestion(textBoxID, sSuggestion);
        if (textBox.createTextRange) {
            var oRange = textBox.createTextRange();
            oRange.moveStart("character", iLen);
            //window.alert( iLen );
            oRange.moveEnd("character", textBox.value.length);
            oRange.select();
        } else if (textBox.setSelectionRange) {
            //window.alert( 'setSelectionRange: '  + iLen );
            textBox.setSelectionRange(iLen, textBox.value.length);
        }
    }
}

function selectSuggestion(textBoxID, sSuggestion)
{
    textBox = document.getElementById( textBoxID );
    sTextBoxValue = textBox.value;
    var parts = sTextBoxValue.split(',');
    var keyword = parts.pop();
    var leftTrimmedKeyword = keyword.replace(/^\s+/g,'');

    var lenDiff = keyword.length - leftTrimmedKeyword.length;
    var leftSpace = keyword.substr(0,lenDiff);

    parts.push( leftSpace + sSuggestion );
    textBox.value = parts.join(',');
}

function highlightSuggestion( layer, oSuggestionNode )
{
    for (var i=0; i < layer.childNodes.length; i++) {
        var oNode = layer.childNodes[i];
        if (oNode == oSuggestionNode) {
            oNode.className = "current"
        } else if (oNode.className == "current") {
            oNode.className = "";
        }
    }
}

function createDropDown( textBoxID )
{
    textBox = document.getElementById( textBoxID );
    layer = document.createElement("div");
    layer.className = "suggestions";
    layer.id="suggestions";
    layer.style.visibility = "hidden";
    layer.style.width = textBox.offsetWidth + 'px';
    document.body.appendChild(layer);

    // do not use onmousedown here, you won't be able to set the focus...
    layer.onmouseup = layer.onmouseover = function (oEvent) {
        oEvent = oEvent || window.event;
        var oTarget = oEvent.target || oEvent.srcElement;

        if ( oTarget.id == 'suggestions' ) {
            return true;
        }
        if (oEvent.type == "mouseup") {
            selectSuggestion( textBoxID, oTarget.firstChild.nodeValue );
            hideSuggestions( layer );
            focusAtTheEnd(textBoxID);
        } else if (oEvent.type == "mouseover") {
            highlightSuggestion( layer, oTarget );
        } else {
            focusAtTheEnd(textBoxID);
        }

        return true;
    };
}

function focusAtTheEnd(textBoxID)
{
    textBox=document.getElementById(textBoxID);
    if (textBox.createTextRange) {
        // IE
        var oRange = textBox.createTextRange();
        //window.alert( 'text length: ' + textBox.value.length );
        oRange.moveStart("character", textBox.value.length);
        oRange.moveEnd("character", textBox.value.length);
        oRange.select();
    } else {
        // hopefully all others
        textBox.focus();
    }
}

function hideSuggestions( element )
{
    element.style.visibility = "hidden";
}

function getLeft( oNode )
{
    var iLeft = 0;

    while(oNode && oNode.tagName.toLowerCase != "body") {
        iLeft += oNode.offsetLeft;
        oNode = oNode.offsetParent;
    }

    return iLeft;
}

function getTop( oNode )
{
    var iTop = 0;

    while(oNode && oNode.tagName.toLowerCase != "body") {
        iTop += oNode.offsetTop;
        oNode = oNode.offsetParent;
    }

    return iTop;
}

function showSuggestions( textBoxID, aSuggestions )
{
    //window.alert( 'auto suggest with ' + aSuggestions.length + ' results' );

    var textBox = document.getElementById(textBoxID);
    //window.alert( textBox );
    var oDiv = null;
    var layer = document.getElementById( 'suggestions' );

    if ( layer == null ) {
        createDropDown( textBoxID );
        layer = document.getElementById( 'suggestions' );
    }

    //window.alert( layer );
    layer.innerHTML = "";

    for (var i=0; i < aSuggestions.length; i++) {
        oDiv = document.createElement("div");
        oDiv.appendChild(document.createTextNode(aSuggestions[i]));
        layer.appendChild(oDiv);
    }

    layer.style.left = getLeft(textBox) + "px";
    layer.style.top = (getTop(textBox)+textBox.offsetHeight) + "px";
    layer.style.visibility = "visible";
}
