using Microsoft.EntityFrameworkCore;
using Serilog;
using Serilog.Events;
using WorldCities.Server.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Host.UseSerilog((ctx, lc) => lc.ReadFrom.Configuration(ctx.Configuration).WriteTo.MSSqlServer(connectionString: ctx.Configuration.GetConnectionString("DefaultConnection"), restrictedToMinimumLevel: LogEventLevel.Information, sinkOptions: new Serilog.Sinks.MSSqlServer.MSSqlServerSinkOptions
{
    TableName = "LogEvents",
    AutoCreateSqlTable = true
}).WriteTo.Console());

builder.Services.AddControllers()
    //.AddJsonOptions(options =>
    //{
    //    options.JsonSerializerOptions.WriteIndented = true;
    //    options.JsonSerializerOptions.PropertyNamingPolicy = null;
    //})
    ;

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add ApplicationDbContext and SQL Server support
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
        )
);

var app = builder.Build();

app.UseSerilogRequestLogging();
app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();