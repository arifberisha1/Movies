using Moq;
using MoviesAPI.Helpers;
using Xunit;

namespace server.Tests.UnitTests;

public class UnitTest1
{

    private readonly Mock<IWebHostEnvironment> _mockWebHostEnvironment;
    private readonly Mock<IHttpContextAccessor> _mockHttpContextAccessor;
    
    public UnitTest1()
    {
        _mockWebHostEnvironment = new Mock<IWebHostEnvironment>();
        _mockHttpContextAccessor = new Mock<IHttpContextAccessor>();
    }
    
    [Fact]
    public async Task DeleteFile_WithValidFileRoute_DeletesFile()
    {
        // Arrange
        var storageService = new InAppStorageService(_mockWebHostEnvironment.Object, _mockHttpContextAccessor.Object);
        var fileRoute = "/uploads/test.jpg";
        var containerName = "uploads";
        var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", containerName, Path.GetFileName(fileRoute));
        _mockWebHostEnvironment.Setup(env => env.WebRootPath).Returns(Directory.GetCurrentDirectory());

        // Act
        await storageService.DeleteFile(fileRoute, containerName);

        // Assert
        Assert.False(File.Exists(filePath));
    }
}