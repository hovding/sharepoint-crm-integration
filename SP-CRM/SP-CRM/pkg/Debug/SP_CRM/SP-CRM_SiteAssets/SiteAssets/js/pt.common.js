window.PT = window.PT || {};
PT.Common = PT.Common || {};
PT.Common.EnsureNamespace = function (ns) {
    nsArr = ns.split('.'); // split into array
    var obj = window; // start at window object
    for (var i = 0; i < nsArr.length; i++) {
        if (nsArr[i] == "window") // skip window if this is included in string
            continue;
        obj[nsArr[i]] = obj[nsArr[i]] || {}; // create an empty object
        obj = obj[nsArr[i]]; // get the new object and continue
    }
    console.log("Added namespace: " + ns);
};

PT.Common.openBasicDialogWithRefresh = function (tUrl, tTitle) {
    var options = {
        url: tUrl,
        title: tTitle,
        dialogReturnValueCallback: RefreshOnDialogClose
    };
    SP.UI.ModalDialog.showModalDialog(options);
};
PT.Common.openBasicDialog = function (tUrl, tTitle) {
    var options = {
        url: tUrl,
        title: tTitle
    };
    SP.UI.ModalDialog.showModalDialog(options);
};
PT.Common.getParameterByName = function (name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
};
// Based on the OOTB SetFullScreen function in core.js, except it doesn't store the selection in a cookie
// This way, only the current page will be affected
PT.Common.SetFullScreenModeForCurrentPage = function (enable) {
	var documentBody = document.body,
	fullScreenElement = document.getElementById("fullscreenmode"),
	exitFullScreenElement = document.getElementById("exitfullscreenmode");
	if (documentBody != null) {
		//Save selection in a cookie to be persisted on other pages
		//SetCookieEx("WSS_FullScreenMode", enabled, true, window);
		if (enable) {
			AddCssClassToElement(documentBody, "ms-fullscreenmode");
			if (fullScreenElement != null && exitFullScreenElement != null) {
				fullScreenElement.style.display = "none";
				exitFullScreenElement.style.display = "";
			}
		} else {
			RemoveCssClassFromElement(documentBody, "ms-fullscreenmode");
			if (fullScreenElement != null && exitFullScreenElement != null) {
				fullScreenElement.style.display = "";
				exitFullScreenElement.style.display = "none";
			}
		}
		if ("undefined" != typeof document.createEvent && "function" == typeof window.dispatchEvent) {
			var e = document.createEvent("Event");
			e.initEvent("resize", false, false);
			window.dispatchEvent(e);
		} else "undefined" != typeof document.createEventObject && document.body.fireEvent("onresize"); CallWorkspaceResizedEventHandlers();
	}
}