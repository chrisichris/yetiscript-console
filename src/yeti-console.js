console._log = function(msg){
	chrome.devtools.inspectedWindow.eval('console.log("'+msg+'");',
			function(){});	
};
var tabId = chrome.devtools.inspectedWindow.tabId;

var compiled = ace.edit("cc-results");
compiled.setTheme("ace/theme/twilight");
compiled.session.setMode("ace/mode/javascript");
compiled.session.setUseSoftTabs(true);
compiled.session.setTabSize(2);
compiled.setShowPrintMargin(false);
compiled.setReadOnly(true);

var editor = ace.edit("cc-editor");
editor.setTheme("ace/theme/twilight");
editor.session.setMode("ace/mode/coffee");
editor.session.setUseSoftTabs(true);
editor.session.setTabSize(2);
editor.setShowPrintMargin(false);

// DevTools page -- devtools.js
// Create a connection to the background page
var backgroundPageConnection = chrome.runtime.connect({
    name: "devtools-page"
});

backgroundPageConnection.onMessage.addListener(function (message) {
    // Handle responses from the background page, if any
});

function evalIt(code){
	code = code || compiled.session.getValue();
	// Relay the tab ID to the background page
	chrome.devtools.inspectedWindow.eval(code,
           function(result, isException) {
             if (isException)
               console._log("Exception:" + result);
             else
               console._log(result);
           }
      );
	
	/*
	chrome.runtime.sendMessage({
		tabId: chrome.devtools.inspectedWindow.tabId,
		code: code
	});
	*/
}
var showModules = false;
var modulesSrc = "";
var exprSrc = "";

function setJSCode(){
	if(showModules)
		compiled.session.setValue(moduleSrc+exprSrc);
	else
		compiled.session.setValue(exprSrc);
}

function update(){
	$.ajax({
		type:"POST",
		url:"http://localhost:9090/compile",
		data:{src:editor.session.getValue()}
	})
	.done(function(jscode){
		var sepPos = jscode.indexOf('// --- yjsmain ---');
		if(sepPos == -1) {
			moduleSrc = "";
			exprSrc = jscode;
		}else{
			moduleSrc = jscode.substring(0,sepPos);
			exprSrc = jscode.substring(sepPos);
		}
		setJSCode();
		$("#cc-error").hide();
	    evalIt(jscode);	
	})
	.fail(function(jqXHR,textStatus, errorThrown){
		var txt = jqXHR.responseText;
		if(jqXHR.status != 400)
			txt = "Server-Error: "+txt;
		else
			txt = "Compile-Error: "+txt;
		$("#cc-error").html(txt);
		$("#cc-error").show();
	});
    //localStorage.setItem("state" + tabId, editor.session.getValue());
}
/*
schedule = function(fn, timeout) {
    if (fn.$timer) return;
    fn.$timer = setTimeout(function() {fn.$timer = null; fn()}, timeout || 10);
}

editor.on("change", function(e){
    schedule(update, 1000);
});

var compileOptions = {
    name: "compileIt",
    exec: compileIt,
    bindKey: "Ctrl-Return|Command-Return|Shift-Return"
};
*/

var compileOptions = {
    name: "update",
    exec: update,
    bindKey: "Ctrl-Return|Command-Return|Shift-Return"
};

editor.commands.addCommand(compileOptions);
compiled.commands.addCommand(compileOptions);

$("#runcc").click(update);
$("#show-module").click(function(){
	showModules = !showModules;
	setJSCode();
});
	
//document.getElementById('show-module').addEventListener('click'
//document.getElementById('runcc').addEventListener('click', update());
//editor.session.setValue(localStorage.getItem("state" + tabId));
//schedule(function(){ editor.focus() }, 20);
