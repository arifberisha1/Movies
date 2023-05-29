using System.IdentityModel.Tokens.Jwt;
using System.Reflection;
using System.Text;
using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using server;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MoviesAPI.Helpers;
using NetTopologySuite;
using NetTopologySuite.Geometries;
using server.APIBehavior;
using server.Filters;
using server.Helpers;
using Microsoft.OpenApi.Models;
using server.SeedData;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"),
        sqlOptions => sqlOptions.UseNetTopologySuite()));




// Add services to the container.

builder.Services.AddControllers(options =>
{
    options.Filters.Add(typeof(ParseBadRequest));
}).ConfigureApiBehaviorOptions(BadRequestBehavior.Parse);

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("IsAdmin", policy => policy.RequireClaim("role", "admin"));
});

builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "v1",
        Title = "Movies API",
        Description = "An ASP.NET Core Web API for managing Movies API",
    });
    
    var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));
});
builder.Services.AddIdentity<IdentityUser, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration.GetValue<string>("keyjwt"))),
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(_builder =>
    {
        _builder.WithOrigins(builder.Configuration.GetValue<string>("frontend_url"))
            .AllowAnyMethod().AllowAnyHeader()
            .WithExposedHeaders(new string [] {"totalAmountOfRecords"});
    });
});


builder.Services.AddAutoMapper(typeof(Program).Assembly);

builder.Services.AddSingleton(provider => new MapperConfiguration(config =>
{
    var geometryFactory = provider.GetRequiredService<GeometryFactory>();
    config.AddProfile(new AutoMapperProfiles(geometryFactory));
}).CreateMapper());
builder.Services.AddSingleton<GeometryFactory>(NtsGeometryServices
    .Instance.CreateGeometryFactory(srid: 4326));

builder.Services.AddScoped<IFileStorageService, InAppStorageService>();
builder.Services.AddHttpContextAccessor();

var app = builder.Build();


using (var scope = app.Services.CreateScope())
{
    AdminSeedData.InitializeAdminUser(scope.ServiceProvider).GetAwaiter().GetResult();
    ActorsSeedData.InitializeActors(scope.ServiceProvider).GetAwaiter().GetResult();
    GenresSeedData.InitializeGenres(scope.ServiceProvider).GetAwaiter().GetResult();
    WebsitesSeedData.InitializeWebsites(scope.ServiceProvider).GetAwaiter().GetResult();
    MovieTheatersSeedData.InitializeMovieTheaters(scope.ServiceProvider).GetAwaiter().GetResult();
    MoviesSeedData.InitializeMovies(scope.ServiceProvider).GetAwaiter().GetResult();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseDeveloperExceptionPage();
}

app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseRouting();

app.UseCors();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
