PT.Common.EnsureNamespace("PT.Lists");
PT.Lists.GetListItems = function (url, listName) {
	var deferred = jQuery.Deferred();
	jQuery.ajax({
		url: url + "/_api/web/lists/GetByTitle('"+listName+"')/items",
		type: "GET",
		headers: { "Accept": "application/json; odata=verbose" },
		success: function (data) {
			deferred.resolve(data.d.results);
		},
		error: function (jqXHR, textStatus, errorThrown) {
			console.log(textStatus);
			deferred.reject(jqXHR, textStatus, errorThrown);

		}
	});
	return deferred.promise();
};

