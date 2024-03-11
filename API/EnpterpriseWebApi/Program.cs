
using DataServices.Data;
using DataServices;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using System.Reflection;
using DataServices.Interfaces;
using DataServices.Repositories;
using DataServices.MappingProfile;
using Microsoft.AspNetCore.Hosting;

namespace EnpterpriseWebApi
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
            .ConfigureWebHostDefaults(webBuilder =>
            {
                webBuilder.UseStartup<Startup>();
            });
    }
}