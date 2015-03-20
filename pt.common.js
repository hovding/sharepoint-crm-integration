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
