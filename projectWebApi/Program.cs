using projectWebApi.Interface;
using projectWebApi.Service;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddIceCreamServise();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseStaticFiles(); // מאפשר גישה לקבצים סטטיים כמו HTML, CSS, JS

app.MapGet("/", async context =>
{
    context.Response.Redirect("/index.html"); // מפנה לדף index.html
});

app.UseAuthorization();

app.MapControllers();

app.Run();
