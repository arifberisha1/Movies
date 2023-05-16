using Microsoft.AspNetCore.Authentication.JwtBearer;
using server;
using Microsoft.EntityFrameworkCore;
using MoviesAPI.Helpers;
using NetTopologySuite;
using NetTopologySuite.Geometries;
using server.APIBehavior;
using server.Filters;
using server.Helpers;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"),
        sqlOptions => sqlOptions.UseNetTopologySuite()));

builder.Services.AddSingleton<GeometryFactory>(NtsGeometryServices.Instance.CreateGeometryFactory(srid: 4326));


// Add services to the container.

builder.Services.AddControllers(options =>
{
    options.Filters.Add(typeof(ParseBadRequest));
}).ConfigureApiBehaviorOptions(BadRequestBehavior.Parse);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
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

builder.Services.AddScoped<IFileStorageService, InAppStorageService>();
builder.Services.AddHttpContextAccessor();

var app = builder.Build();

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
