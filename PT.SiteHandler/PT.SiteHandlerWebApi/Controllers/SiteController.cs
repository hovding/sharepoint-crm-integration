using Microsoft.SharePoint.Client;
using OfficeDevPnP.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security;
using System.Web.Http;

namespace PT.SiteHandlerWebApi.Controllers
{
	public class SiteController : ApiController
	{
		// GET api/site
		public IEnumerable<string> Get()
		{
			return new string[] { "value1", "value2" };
		}

		// GET api/site/5
		public string Get(int id)
		{
			return "value";
		}

		// POST api/site
		public void Post([FromBody] SiteEntity site)
		{
			using (ClientContext clientContext = new ClientContext("https://pointtaken.sharepoint.com/sites/crmutv"))
			{
				SecureString passWord = new SecureString();

				foreach (char c in "w8ing4dooM".ToCharArray()) passWord.AppendChar(c);

				clientContext.Credentials = new SharePointOnlineCredentials("kh@ptaken.no", passWord);
				Web web = clientContext.Web;

				clientContext.Load(web);

				clientContext.ExecuteQuery();
				var name = site.Title;
				if (!clientContext.Web.WebExists(name))
                {
                    // Create the sub site
                    Web newWeb = clientContext.Web.CreateWeb(name, name, name, "STS#0", 1033);

                    // Let's add two document libraries to the site 
                    newWeb.CreateDocumentLibrary("Specifications");
                    newWeb.CreateDocumentLibrary("Presentations");

                    // Let's also apply theme to the site to demonstrate how easy this is
                    newWeb.SetComposedLookByUrl("Characters");

                    string newUrl = clientContext.Web.Url + "/" + name;
                   
                }
                else
                {
                    //lblStatus1.Text = "URL has been already taken for sub site. Creation cancelled.";
                }
				
			}

		}

		// PUT api/site/5
		public void Put(int id, [FromBody]string value)
		{

		}

		// DELETE api/values/5
		public void Delete(int id)
		{
		}
	}
}
