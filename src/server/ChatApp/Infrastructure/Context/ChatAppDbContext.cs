using ChatApp.Core.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.Infrastructure.Data
{
    public class ChatAppDbContext(DbContextOptions<ChatAppDbContext> options) : DbContext(options)
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AppUser>()
                .HasOne(_ => _.Preference)
                .WithOne(_ => _.AppUser)
                .HasForeignKey<Preference>(p => p.Id)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<AppUser>()
                .HasMany(u => u.UserImages)
                .WithOne(u => u.AppUser)
                .HasForeignKey(u => u.AppUserId)
                .OnDelete(DeleteBehavior.Cascade);
        }

        public DbSet<AppUser> AppUsers { get; set; }
        public DbSet<UserImage> UserImages { get; set; }
        public DbSet<Preference> Preferences { get; set; }
        public DbSet<Swipe> Swipes { get; set; }
    }
}
