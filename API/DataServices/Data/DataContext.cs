using Microsoft.EntityFrameworkCore;
using Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataServices.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {

        }

        public DbSet<ClosureDates> ClosureDates { get; set; }
        public DbSet<Contributions> Contributions { get; set; }
        public DbSet<Faculities> Faculities { get; set; }
        public DbSet<FeedBacks> FeedBacks { get; set; }
    }

}
