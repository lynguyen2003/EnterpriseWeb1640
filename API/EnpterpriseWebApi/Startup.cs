using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using AutoMapper;
using DataServices;
using DataServices.Data;
using DataServices.Interfaces;
using DataServices.Repositories;
using DataServices.Configurations;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using DataServices.JwtServices;
using Microsoft.OpenApi.Models;
using Models.Entities;
using DataServices.MappingProfile;
using EnpterpriseWebApi;
using DataServices.Service;
using Models.DTO;

public class Startup
{
    public Startup(IConfiguration configuration)
    {
        Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {
        // Configure other services
        services.AddDbContext<DataContext>(options =>
        {
            options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"),
                b => b.MigrationsAssembly("DataServices"));
        });

        services.Configure<JwtConfig>(Configuration.GetSection("JwtConfig"));

        var key = Encoding.ASCII.GetBytes(Configuration.GetSection("JwtConfig:Secret").Value);

        var tokenValidationParameter = new TokenValidationParameters()
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = false, // private
            ValidateAudience = false, // private too
            RequireExpirationTime = false,
            ValidateLifetime = true,
            ValidIssuer = Configuration.GetSection("JwtConfig:Issuer").Value,
            ValidAudience= Configuration.GetSection("JwtConfig:Audience").Value
        };


        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(jwt =>
        {
            jwt.SaveToken = true;
            jwt.TokenValidationParameters = tokenValidationParameter;
        });


        services.AddSingleton(tokenValidationParameter);
        services.AddIdentity<IdentityUser, IdentityRole>()
            .AddEntityFrameworkStores<DataContext>()
            .AddDefaultTokenProviders();

        services.Configure<DataProtectionTokenProviderOptions>(opts => opts.TokenLifespan = TimeSpan.FromHours(2));

        var emailConfig = Configuration.GetSection("EmailConfig").Get<EmailConfiguration>();
        services.AddSingleton(emailConfig);

        services.AddTransient<IManageImage, ManageImage>();
        services.AddAutoMapper(typeof(MappingProfile));
        services.AddAutoMapper(typeof(Startup));
        services.AddScoped<IJwtService, JwtService>();
        services.AddScoped<IEmailService, EmailService>();
        services.AddScoped<IUnitOfWorks, UnitOfWorks>();
        services.AddScoped<IClosureDates, ClosureDatesRepository>();
        services.AddScoped<IFacultiesRepository, FacultiesRepository>();
        services.AddControllers();

        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo { Title = "Your API", Version = "v1" });
            c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                Description = "JWT Authorization header using the Bearer scheme.",
                Name = "Authorization",
                In = ParameterLocation.Header,
                Type = SecuritySchemeType.ApiKey,
                Scheme = "Bearer"
            });
            c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        new string[] { }
                    }
                });
        });


        services.AddCors(options =>
        {
            options.AddPolicy("AllowFirebaseClient",
                builder =>
                {
                    builder.WithOrigins("http://localhost:3000")
                           .AllowAnyHeader()
                           .AllowAnyMethod()
                           .AllowCredentials(); // Allow credentials
                });
        });
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }

        app.UseSwagger();
        app.UseSwaggerUI();

        app.UseHttpsRedirection();

        app.UseRouting();
        app.UseCors("AllowFirebaseClient");

        app.UseAuthentication(); // Add authentication middleware
        app.UseAuthorization();

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
        });
    }
}
