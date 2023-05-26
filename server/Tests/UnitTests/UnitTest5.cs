using server.DTOs;
using server.Helpers;
using Xunit;

namespace server.Tests.UnitTests;

public class UnitTest5
{
    [Fact]
    public void Paginate_ReturnsEmpty_WhenPageIsOutOfBounds()
    {
        // Arrange
        var paginationDTO = new PaginationDTO
        {
            Page = 3,
            RecordsPerPage = 5
        };

        var data = Enumerable.Range(1, 10).AsQueryable();

        // Act
        var result = data.Paginate(paginationDTO);

        // Assert
        Assert.Empty(result);
    }
}