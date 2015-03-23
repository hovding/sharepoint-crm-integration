PT.Common.EnsureNamespace("PT.Provisioning");

PT.Provisioning.WaitMessage = function() {
    window.parent.eval("window.waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose('Oppretter område..', '', 80, 450);");
}
PT.Provisioning.CloseWaitMessage = function() {
    if (window.parent.waitDialog != null) {
        window.parent.waitDialog.close();
    }
};

PT.Provisioning.CreateWeb = function (webTitle, webUrl, webDescription, webTemplate) {
    var deferred = jQuery.Deferred();
    PT.Provisioning.WaitMessage();
    debugger;
    var reqData = "{ 'parameters': { '__metadata': { 'type': 'SP.WebCreationInformation' },'Title': '" + webTitle + "', 'Url': '" + webUrl + "', 'Description': '" + webDescription + "', 'WebTemplate': '" + webTemplate + "','UseSamePermissionsAsParentSite': false } }";

    jQuery.ajax({
        url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/webs/add",
        type: "POST",
        contentType: "application/json;odata=verbose",
        data: reqData,
        dataType: 'json',
        headers: {
            "Accept": "application/json;odata=verbose",
            "X-RequestDigest": $('#__REQUESTDIGEST').val()
        },
        success: function (data) {
            PT.Provisioning.CloseWaitMessage();
            deferred.resolve(data.d);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            deferred.reject();
        }
    });

    return deferred.promise();

};

PT.Provisioning.SetPermissionsOnWeb = function  (webUrl) {

    var deferred = $.Deferred();
    var executor = new SP.RequestExecutor(webUrl);
    executor.executeAsync(
        {
            url: webUrl + "/_api/web/roleassignments/addroleassignment(principalid=8,roleDefId=1073741828)",
            method: "POST",
            headers: { "Accept": "application/json; odata=nometadata" },
            success: function(data){
            deferred.resolve(data);    
            },
            error: function(data, errorCode, errorMessage){
                deferred.reject(data,errorCode,errorMessage);    
            }
        }
        );
 
    return deferred.promise();      
   
   /*
    var deferred = jQuery.Deferred();
    jQuery.ajax({
        url: webUrl + "/_api/web/roleassignments/addroleassignment(principalid=8,roleDefId=1073741828)",
        type: "POST",
        headers: { "Accept": "application/json; odata=nometadata" },
        success: function (data) {
            debugger;
            deferred.resolve(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
    return deferred.promise();
    */
}

PT.Provisioning.DoesWebExist = function (serverRelativeUrlOrFullUrl) {
    var deferred = jQuery.Deferred();
    jQuery.ajax({
        url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/webinfos?$filter=Title eq '" + serverRelativeUrlOrFullUrl + "'",
        type: "GET",
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            var webs = data.d.results.length;
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