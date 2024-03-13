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

        public DbSet<ClosureDates> ClosureDates { get; set; }
        public DbSet<Contributions> Contributions { get; set; }
        public DbSet<Faculties> Faculties { get; set; }
        public DbSet<Feedbacks> Feedbacks { get; set; }
        public DbSet<Images> Images { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Feedbacks>()
                .HasKey(f => new { f.UserId, f.ConId }); // Composite key

            modelBuilder.Entity<Feedbacks>()
                .HasOne(f => f.Users)
                .WithMany(u => u.Feedbacks)
                .HasForeignKey(f => f.UserId);

            modelBuilder.Entity<Feedbacks>()
                .HasOne(f => f.Contributions)
                .WithMany(c => c.Feedbacks)
                .HasForeignKey(f => f.ConId);
        }
    }

}
