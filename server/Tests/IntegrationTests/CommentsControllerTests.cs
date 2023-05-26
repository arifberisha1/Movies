using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using server.Controllers;
using Microsoft.AspNetCore.Mvc;

namespace server.Tests.IntegrationTests
{
    [TestFixture]
    public class CommentsControllerTests
    {
        private ApplicationDbContext dbContext;
        private CommentsController commentsController;

        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "test_database")
                .Options;
            dbContext = new ApplicationDbContext(options);

            commentsController = new CommentsController(dbContext);
        }

        [TearDown]
        public void TearDown()
        {
            dbContext.Database.EnsureDeleted();
            dbContext.Dispose();
        }

        [Test]
        public async Task Delete_NonExistingComment_ReturnsNotFound()
        {
            // Act
            var result = await commentsController.Delete(999);

            // Assert
            Assert.That(result, Is.TypeOf<NotFoundResult>());
        }
    }
}