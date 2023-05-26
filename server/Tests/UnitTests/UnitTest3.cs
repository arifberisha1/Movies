using Microsoft.AspNetCore.Mvc.ModelBinding;
using Moq;
using server.Helpers;
using Xunit;

namespace server.Tests.UnitTests;

public class UnitTest3
{
    [Fact]
    public async Task BindModelAsync_ValueIsOfType_SuccessfullyBindsModel()
    {
        // Arrange
        var bindingContext = new DefaultModelBindingContext();
        var valueProvider = new Mock<IValueProvider>();
        var modelName = "myModel";
        var modelValue = "10";

        valueProvider.Setup(vp => vp.GetValue(modelName)).Returns(new ValueProviderResult(modelValue));

        bindingContext.ModelName = modelName;
        bindingContext.ValueProvider = valueProvider.Object;
        bindingContext.ModelMetadata = new EmptyModelMetadataProvider().GetMetadataForType(typeof(int));

        var typeBinder = new TypeBinder<int>();

        // Act
        await typeBinder.BindModelAsync(bindingContext);

        // Assert
        Assert.True(bindingContext.Result.IsModelSet);
        Assert.Equal(10, bindingContext.Result.Model);
        Assert.Equal(typeof(int), bindingContext.ModelMetadata.ModelType);
    }
}