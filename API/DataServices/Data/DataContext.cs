using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataServices.Data
{
    public class DataContext : IdentityDbContext
    {


        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {

        }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<ClosureDates> ClosureDates { get; set; }
        public DbSet<Contributions> Contributions { get; set; }
        public DbSet<Faculties> Faculties { get; set; }
        public DbSet<Comments> Comments { get; set; }

        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<ClosureDates>().HasData(
                new ClosureDates
                {
                    Id = 1,
                    AcademicYear = new string("2022/2025"),
                    ClosureDate = new DateTime(2024, 4, 25, 11, 00, 00),
                    FinalClosureDate = new DateTime(2024, 5, 1),
                }
            );

            modelBuilder.Entity<Faculties>().HasData(
                new Faculties
                {
                    Id = 1,
                    FacultyName = "Greenwich University"
                },
                new Faculties
                {
                    Id = 2,
                    FacultyName = "Faculty of Education, Health and Human Sciences"
                },
                new Faculties
                {
                    Id = 3,
                    FacultyName = "Faculty of Engineering and Science"
                },
                new Faculties
                {
                    Id = 4,
                    FacultyName = "Faculty of Liberal Arts and Sciences"
                },
                new Faculties
                {
                    Id = 5,
                    FacultyName = "Faculty of Information Technology"
                }
            );

            modelBuilder.Entity<IdentityRole>().HasData(
                new IdentityRole
                {
                    Name = "Admin",
                    NormalizedName = "ADMIN"
                },
                new IdentityRole
                {
                    Name = "MarketingManager",
                    NormalizedName = "MARKETINGMANAGER"
                },
                new IdentityRole
                {
                    Name = "MarketingCoordinator",
                    NormalizedName = "MARKETINGCOORDINATOR"
                },
                new IdentityRole
                {
                    Name = "Student",
                    NormalizedName = "STUDENT"
                },
                new IdentityRole
                {
                    Name = "Guest",
                    NormalizedName = "GUEST"
                }
            );
        }
    }

}
