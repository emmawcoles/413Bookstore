using Mission11.API.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendClient", policy =>
    {
        // Allow both the local Vite app and the deployed Azure Static Web Apps frontend.
        policy.WithOrigins("http://localhost:5173",
                            "https://proud-forest-082a3c710.7.azurestaticapps.net")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});
builder.Services.AddSqlite<BookstoreContext>(
    builder.Configuration.GetConnectionString("BookstoreConnection"));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseCors("FrontendClient");

app.UseAuthorization();

app.MapControllers();

app.Run();
