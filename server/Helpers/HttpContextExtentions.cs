using Microsoft.EntityFrameworkCore;

namespace server.Helpers;

public static class HttpContextExtentions
{
    public async static Task InsertParametersPaginationInHeader<T>(this HttpContext httpContext,
        IQueryable<T> queryable)
    {
        if (httpContext == null)
        {
            throw new ArgumentNullException(nameof(httpContext));
        }

        double count = await queryable.CountAsync();
        httpContext.Response.Headers.Add("totalAmountOfRecords", count.ToString());
        
    }
}