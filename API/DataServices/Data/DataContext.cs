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
        public DbSet<Feedbacks> Feedbacks { get; set; }
        public DbSet<Magazines> Magazines { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<ClosureDates>().HasData(
                new ClosureDates
                {
                    Id = 1,
                    AcademicYear = new DateTime(2024, 1, 1),
                    ClosureDate = new DateTime(2024, 4, 25, 11, 00, 00),
                    FinalClosureDate = new DateTime(2024, 5, 1)
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

            modelBuilder.Entity<Magazines>().HasData(
                new Magazines
                {
                    Id = 1,
                    Title = "Greenwich Gazette: Exploring Campus Life and Beyond",
                    Description = "Description for Magazine 1",
                    CoverImagePath = "image1.jpg"
                },
                new Magazines
                {
                    Id = 2,
                    Title = "Academic Insights: Greenwich University's Research & Scholarship Digest",
                    Description = "Description for Magazine 2",
                    CoverImagePath = "image2.jpg"
                },
                new Magazines
                {
                    Id = 3,
                    Title = "The Greenwich Pioneer: Celebrating Innovation and Leadership on Campus",
                    Description = "Description for Magazine 3",
                    CoverImagePath = "image3.jpg"
                },
                new Magazines
                {
                    Id = 4,
                    Title = "Campus Chronicles: Stories, Events, and Perspectives from Greenwich University",
                    Description = "Description for Magazine 4",
                    CoverImagePath = "image4.jpg"
                },
                new Magazines
                {
                    Id = 5,
                    Title = "Greenwich Perspectives: Diverse Voices, Shared Experiences in our University Community",
                    Description = "Description for Magazine 5",
                    CoverImagePath = "image5.jpg"
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
