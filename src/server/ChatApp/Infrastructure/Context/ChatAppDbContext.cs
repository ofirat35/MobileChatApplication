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

        public override int SaveChanges()
        {
            HandleSaveChanges();
            return base.SaveChanges();
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            HandleSaveChanges();
            return base.SaveChangesAsync(cancellationToken);
        }

        public void HandleSaveChanges()
        {
            foreach (var entry in ChangeTracker.Entries())
            {
                if (entry.State == EntityState.Added)
                {
                    if (entry.Entity is IHasCreatedDate c)
                        c.CreatedDate = DateTime.UtcNow;

                    if (entry.Entity is IHasSoftDelete sd)
                        sd.IsValid = true;
                }

                if (entry.State == EntityState.Modified)
                {
                    if (entry.Entity is IHasUpdatedDate u)
                        u.UpdatedDate = DateTime.UtcNow;
                }

                if (entry.State == EntityState.Deleted)
                {
                    if (entry.Entity is IHasSoftDelete s)
                        s.IsValid = false;
                }
            }
        }

        public DbSet<AppUser> AppUsers { get; set; }
        public DbSet<UserImage> UserImages { get; set; }
        public DbSet<Preference> Preferences { get; set; }
        public DbSet<Swipe> Swipes { get; set; }
        public DbSet<Match> Matches { get; set; }
        public DbSet<UserMembership> UserMemberships { get; set; }
        public DbSet<Membership> Memberships { get; set; }
    }
}
