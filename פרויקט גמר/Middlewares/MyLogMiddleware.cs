
using System.Diagnostics; 
using Microsoft.AspNetCore.Http; 
using Microsoft.Extensions.Logging; 
using projectWebApi.Interface; 
using projectWebApi.Services; 


namespace projectWebApi.Middlewares;

    public class MyLogMiddleware
    {
        private RequestDelegate next;
        private ILogger<MyLogMiddleware>? logger;
 
        public MyLogMiddleware(RequestDelegate next, ILogger<MyLogMiddleware> logger)
        {
            this.next = next;
            this.logger = logger;   

        }

        public async Task Invoke(HttpContext httpContext)
        {
            var sw = new Stopwatch();
            sw.Start();
            await next(httpContext);
            logger.LogDebug($"{httpContext.Request.Path}.{httpContext.Request.Method} took {sw.ElapsedMilliseconds}ms."
            + $" User: {httpContext.User?.FindFirst("userId")?.Value ?? "unknown"}");
                    
        }
    }

    public static partial class MiddlewareExtensions
    {
        public static IApplicationBuilder UseMyLogMiddleware(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<MyLogMiddleware>();
        }
    }

