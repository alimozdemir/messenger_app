using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace messenger_api
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public DbSet<UserMessage> UserMessages { get; set; }
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { 

            //this.Database.Migrate();
        }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<UserMessage>()
                .HasKey(i => new { i.Id });

            modelBuilder.Entity<UserMessage>()
                .HasOne(i => i.FromUser)
                .WithMany(i => i.SendMessages)
                .HasForeignKey(i => i.FromUserId);

            modelBuilder.Entity<UserMessage>()
                .HasOne(i => i.ToUser)
                .WithMany(i => i.ReceivedMessages)
                .HasForeignKey(i => i.ToUserId);
        }
    }
}