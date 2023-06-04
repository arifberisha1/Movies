using Moq;
using MoviesAPI.Helpers;
using Xunit;

namespace server.Tests.UnitTests;

public class UnitTest2
{
    private readonly Mock<IWebHostEnvironment> _mockWebHostEnvironment;
    private readonly Mock<IHttpContextAccessor> _mockHttpContextAccessor;

    public UnitTest2()
    {
        _mockWebHostEnvironment = new Mock<IWebHostEnvironment>();
        _mockHttpContextAccessor = new Mock<IHttpContextAccessor>();
    }

    [Fact]
    public async Task DeleteFile_WithEmptyFileRoute_DoesNothing()
    {
        // Arrange
        var storageService = new InAppStorageService(_mockWebHostEnvironment.Object, _mockHttpContextAccessor.Object);
        string fileRoute = null;
        var containerName = "uploads";

        // Act
        await storageService.DeleteFile(fileRoute, containerName);
    }
}