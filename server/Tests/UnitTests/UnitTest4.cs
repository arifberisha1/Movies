using server.DTOs;
using server.Helpers;
using Xunit;

namespace server.Tests.UnitTests;

public class UnitTest4
{
    [Fact]
    public void Paginate_ReturnsCorrectRecords()
    {
        // Arrange
        var paginationDTO = new PaginationDTO
        {
            Page = 2,
            RecordsPerPage = 5
        };

        var data = Enumerable.Range(1, 10).AsQueryable();

        // Act
        var result = data.Paginate(paginationDTO);

        // Assert
        Assert.Equal(5, result.Count());
        Assert.Equal(new List<int> { 6, 7, 8, 9, 10 }, result);
    }
}