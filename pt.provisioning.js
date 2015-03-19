var PT = PT || {};
PT.Provisioning = PT.Provisioning || {};

function waitMessage() {
    window.parent.eval("window.waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose('Oppretter prosjektområde', '', 80, 450);");
}
function closeWaitMessage() {
    if (window.parent.waitDialog != null) {
        window.parent.waitDialog.close();
    }
};

PT.Provisioning.CreateWeb = function (webTitle, webUrl, webDescription) {
    var webTemplate = 'STS#0';
    var webLanguage = 1033;

    var clientContext = SP.ClientContext.get_current();
    var currentWeb = clientContext.get_web();

    var webCreateInfo = new SP.WebCreationInformation();
    webCreateInfo.set_description(webDescription);
    webCreateInfo.set_language(webLanguage);
    webCreateInfo.set_title(webTitle);
    webCreateInfo.set_url(webUrl);
    webCreateInfo.set_useSamePermissionsAsParentSite(false);
    webCreateInfo.set_webTemplate(webTemplate);

    this.newWeb = currentWeb.get_webs().add(webCreateInfo);
    clientContext.load(this.newWeb);
    clientContext.executeQueryAsync(
		Function.createDelegate(this, PT.Provisioning.OnCreateWebSuccess),
		Function.createDelegate(this, PT.Provisioning.OnCreateWebFailure)
	);
};

PT.Provisioning.SetPermissionsOnWeb = function  (webUrl) {
    // https://mysharepoint.com/sites/clients/_api/web/roleassignments/addroleassignment(principalid=[%Variable: building_group_id%],roleDefId=1073741829)
}

PT.Provisioning.OnCreateWebSuccess = function (sender, args) {
    var newUrl = this.newWeb.get_url()
    closeWaitMessage();
    PT.Provisioning.SetPermissionsOnWeb(newUrl);
    //var setupPermissionsUrl = newUrl + '/_layouts/15/permsetup.aspx?HideCancel=1';
    //window.location.replace(setupPermissionsUrl);
};

PT.Provisioning.OnCreateWebFailure = function (sender, args) {
    closeWaitMessage();
    document.getElementById('projectFormValidation').innerHTML = args.get_message();
    console.log('En feil oppstod: ' + args.get_message());
    console.log("raw response data: \n" + args.get_webRequestExecutor().get_responseData());
};

PT.Provisioning.DoesWebExist = function (serverRelativeUrlOrFullUrl) {
    var deferred = jQuery.Deferred();
    jQuery.ajax({
        url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/webinfos?$filter=ServerRelativeUrl eq '" + serverRelativeUrlOrFullUrl + "'",
        type: "GET",
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            var webs = data.d.results.lenPTh;
            if (webs >= 1) {
                deferred.resolve(true);
            } else {
                deferred.resolve(false);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
    return deferred.promise();
};
PT.Provisioning.CanManageWeb = function () {
    var self = this;
    self.defer = jQuery.Deferred();
    var clientContext = new SP.ClientContext.get_current();
    self.oWeb = clientContext.get_web();
    clientContext.load(self.oWeb);
    clientContext.load(self.oWeb, 'EffectiveBasePermissions');

    var permissionMask = new SP.BasePermissions();
    permissionMask.set(SP.PermissionKind.manageWeb);
    self.shouldShowLink = self.oWeb.doesUserHavePermissions(permissionMask);

    clientContext.executeQueryAsync(Function.createDelegate(self, PT.Provisioning.onQuerySucceededUser), Function.createDelegate(self, PT.Provisioning.onQueryFailedUser));
    return self.defer.promise();
};
PT.Provisioning.onQuerySucceededUser = function () {
    var self = this;
    self.defer.resolve(self.shouldShowLink.get_value());
};

PT.Provisioning.onQueryFailedUser = function () {
    this.defer.reject();
};