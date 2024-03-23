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
        public DbSet<Images> Images { get; set; }
        public DbSet<Magazines> Magazines { get; set; }
    }

}
