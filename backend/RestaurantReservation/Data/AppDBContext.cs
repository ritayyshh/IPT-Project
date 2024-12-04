using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using RestaurantReservation.Models;
namespace RestaurantReservation.Data
{
    public class AppDBContext : IdentityDbContext<AppUser>
    {
        public AppDBContext(DbContextOptions<AppDBContext> options) : base(options)
        {

        }
        public DbSet<Restaurant> Restaurants { get; set; }
        public DbSet<MenuItem> MenuItems { get; set; }
        public DbSet<Table> Tables { get; set; }
        public DbSet<TableReservation> TableReservations { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<WaitList> WaitLists { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // TableReservation → User
            modelBuilder.Entity<TableReservation>()
                .HasOne(tr => tr.User)
                .WithMany(u => u.TableReservations)
                .HasForeignKey(tr => tr.UserID)
                .OnDelete(DeleteBehavior.Cascade);

            // Order → User
            modelBuilder.Entity<Order>()
                .HasOne(o => o.User)
                .WithMany(u => u.Orders)
                .HasForeignKey(o => o.UserID)
                .OnDelete(DeleteBehavior.Cascade);

            // Review → User
            modelBuilder.Entity<Review>()
                .HasOne(r => r.User)
                .WithMany(u => u.Reviews)
                .HasForeignKey(r => r.UserID)
                .OnDelete(DeleteBehavior.Cascade);

            // Waitlist → User
            //modelBuilder.Entity<Waitlist>()
            //    .HasOne(w => w.User)
            //    .WithMany(u => u.Waitlists)
            //    .HasForeignKey(w => w.UserID)
            //    .OnDelete(DeleteBehavior.Cascade);

            // MenuItem → Restaurant
            modelBuilder.Entity<MenuItem>()
                .HasOne(m => m.Restaurant)
                .WithMany(r => r.MenuItems)
                .HasForeignKey(m => m.RestaurantID);

            // Review → Restaurant
            modelBuilder.Entity<Review>()
                .HasOne(r => r.Restaurant)
                .WithMany(r => r.Reviews)
                .HasForeignKey(r => r.RestaurantID);

            // Order → Restaurant
            modelBuilder.Entity<Order>()
                .HasOne(o => o.Restaurant)
                .WithMany(r => r.Orders)
                .HasForeignKey(o => o.RestaurantID);

            // Table → Restaurant
            modelBuilder.Entity<Table>()
                .HasOne(t => t.Restaurant)
                .WithMany(r => r.Tables)
                .HasForeignKey(t => t.RestaurantID);

            // Waitlist → Restaurant
            //modelBuilder.Entity<Waitlist>()
            //    .HasOne(w => w.Restaurant)
            //    .WithMany(r => r.Waitlists)
            //    .HasForeignKey(w => w.RestaurantID);

            // Order → OrderItems
            modelBuilder.Entity<Order>()
                .HasMany(o => o.OrderItems)
                .WithOne(oi => oi.Order)
                .HasForeignKey(oi => oi.OrderID)
                .OnDelete(DeleteBehavior.Restrict);

            // MenuItem → OrderItems
            modelBuilder.Entity<MenuItem>()
                .HasMany(mi => mi.OrderItems)
                .WithOne(oi => oi.MenuItem)
                .HasForeignKey(oi => oi.MenuItemID)
                .OnDelete(DeleteBehavior.Restrict);

            // TableReservation → Table
            modelBuilder.Entity<TableReservation>()
                .HasOne(tr => tr.Table)
                .WithMany(t => t.TableReservations)
                .HasForeignKey(tr => tr.TableID);

            // Configuring the foreign key relationship between Waitlist and Table
            modelBuilder.Entity<WaitList>()
               .HasOne<Table>() // No navigation property, just specify the related entity
               .WithMany() // No navigation property on Table for Waitlist
               .HasForeignKey(w => w.TableID) // The foreign key in Waitlist
               .OnDelete(DeleteBehavior.Cascade); // Cascade delete for this relationship

            // Configuring the foreign key relationship between Waitlist and Restaurant
            modelBuilder.Entity<WaitList>()
               .HasOne<Restaurant>() // No navigation property, just specify the related entity
               .WithMany() // No navigation property on Restaurant for Waitlist
               .HasForeignKey(w => w.RestaurantID) // The foreign key in Waitlist
               .OnDelete(DeleteBehavior.Restrict); // Prevent cascade delete for this relationship

            // Configuring the foreign key relationship between Waitlist and User
            modelBuilder.Entity<WaitList>()
               .HasOne<AppUser>() // Assuming ApplicationUser as the User model
               .WithMany() // No navigation property on ApplicationUser for Waitlist
               .HasForeignKey(w => w.UserID) // The foreign key in Waitlist
               .OnDelete(DeleteBehavior.Restrict); // Prevent cascade delete for this relationship

            modelBuilder.Entity<WaitList>()
                .Property(w => w.WaitListID)
                .ValueGeneratedOnAdd();


            // Fluent API for Additional Constraints
            modelBuilder.Entity<Restaurant>()
                .Property(r => r.AverageRating)
                .HasPrecision(2, 1);

            modelBuilder.Entity<MenuItem>()
                .Property(mi => mi.Price)
                .HasColumnType("decimal(10, 2)");

            // Seed Roles
            List<IdentityRole> roles = new List<IdentityRole>
            {
                new IdentityRole
                {
                    Name = "Admin",
                    NormalizedName = "ADMIN"
                },
                new IdentityRole
                {
                    Name = "User",
                    NormalizedName = "USER"
                }
            };
            modelBuilder.Entity<IdentityRole>().HasData(roles);
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.ConfigureWarnings(warnings =>
                warnings.Ignore(RelationalEventId.PendingModelChangesWarning));
        }
    }
}