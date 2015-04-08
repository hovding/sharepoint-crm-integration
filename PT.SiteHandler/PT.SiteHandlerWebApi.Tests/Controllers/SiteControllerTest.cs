using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Web.Http;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using PT.SiteHandlerWebApi;
using PT.SiteHandlerWebApi.Controllers;

namespace PT.SiteHandlerWebApi.Tests.Controllers
{
	[TestClass]
	public class SiteControllerTest
	{
		[TestMethod]
		public void Get()
		{
			// Arrange
			SiteController controller = new SiteController();

			// Act
			IEnumerable<string> result = controller.Get();

			// Assert
			Assert.IsNotNull(result);
			Assert.AreEqual(2, result.Count());
			Assert.AreEqual("value1", result.ElementAt(0));
			Assert.AreEqual("value2", result.ElementAt(1));
		}

		[TestMethod]
		public void GetById()
		{
			// Arrange
			SiteController controller = new SiteController();

			// Act
			string result = controller.Get(5);

			// Assert
			Assert.AreEqual("value", result);
		}

		[TestMethod]
		public void Post()
		{
			// Arrange
			SiteController controller = new SiteController();

			// Act
			controller.Post(new OfficeDevPnP.Core.Entities.SiteEntity
			{ Url="123", Description="123", Title="123" }
			);

			// Assert
		}

		[TestMethod]
		public void Put()
		{
			// Arrange
			SiteController controller = new SiteController();

			// Act
			controller.Put(5, "value");

			// Assert
		}

		[TestMethod]
		public void Delete()
		{
			// Arrange
			SiteController controller = new SiteController();

			// Act
			controller.Delete(5);

			// Assert
		}
	}
}
