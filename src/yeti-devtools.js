chrome.devtools.panels.create(
	"YetiScriptConsole",
	"badge.png",
	"yeti-console.html",
	function cb(panel) {
		panel.onShown.addListener(function(win){ win.focus(); });
	}
);

