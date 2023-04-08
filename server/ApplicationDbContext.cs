using System.Diagnostics.CodeAnalysis;
using Microsoft.EntityFrameworkCore;

namespace server;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext([NotNull] DbContextOptions options) : base(options)
    {
    }
    
}