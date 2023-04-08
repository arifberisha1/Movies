using System.Diagnostics.CodeAnalysis;
using Microsoft.EntityFrameworkCore;
using server.Entities;

namespace server;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext([NotNull] DbContextOptions options) : base(options)
    {
    }
    
    public DbSet<Genre> Genres { get; set; }
}