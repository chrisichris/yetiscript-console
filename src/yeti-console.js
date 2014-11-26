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
			txt = "Server-Error: "+jqXHR.statusText;
		else
			txt = "Compile-Error: "+txt;
		$("#cc-error").html(txt);
		$("#cc-error").show();
	});
    //localStorage.setItem("state" + tabId, editor.session.getValue());
}

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

editor.focus();
