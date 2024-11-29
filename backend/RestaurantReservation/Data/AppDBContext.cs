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
        public DbSet<Waitlist> Waitlists { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Apply Identity configurations
            base.OnModelCreating(modelBuilder);

            // ApplicationUser Relationships
            modelBuilder.Entity<TableReservation>()
                .HasOne(tr => tr.User)
                .WithMany(u => u.TableReservations)
                .HasForeignKey(tr => tr.UserID);

            modelBuilder.Entity<Order>()
                .HasOne(o => o.User)
                .WithMany(u => u.Orders)
                .HasForeignKey(o => o.UserID);

            modelBuilder.Entity<Review>()
                .HasOne(r => r.User)
                .WithMany(u => u.Reviews)
                .HasForeignKey(r => r.UserID);

            modelBuilder.Entity<Waitlist>()
                .HasOne(w => w.User)
                .WithMany(u => u.Waitlists)
                .HasForeignKey(w => w.UserID);

            // Restaurant Relationships
            modelBuilder.Entity<MenuItem>()
                .HasOne(m => m.Restaurant)
                .WithMany(r => r.MenuItems)
                .HasForeignKey(m => m.RestaurantID);

            modelBuilder.Entity<Review>()
                .HasOne(r => r.Restaurant)
                .WithMany(r => r.Reviews)
                .HasForeignKey(r => r.RestaurantID);

            modelBuilder.Entity<Order>()
                .HasOne(o => o.Restaurant)
                .WithMany(r => r.Orders)
                .HasForeignKey(o => o.RestaurantID);

            modelBuilder.Entity<Table>()
                .HasOne(t => t.Restaurant)
                .WithMany(r => r.Tables)
                .HasForeignKey(t => t.RestaurantID);

            modelBuilder.Entity<Waitlist>()
                .HasOne(w => w.Restaurant)
                .WithMany(r => r.Waitlists)
                .HasForeignKey(w => w.RestaurantID);

            modelBuilder.Entity<Order>()
            .HasMany(o => o.OrderItems)  // Order has many OrderItems
            .WithOne(oi => oi.Order)     // OrderItem has one Order
            .HasForeignKey(oi => oi.OrderID) // Explicitly specify FK
            .OnDelete(DeleteBehavior.Restrict); // Restrict deletion


            modelBuilder.Entity<MenuItem>()
            .HasMany(mi => mi.OrderItems)
            .WithOne(oi => oi.MenuItem)
            .OnDelete(DeleteBehavior.Restrict);

            // Order Relationships
            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Order)
                .WithMany(o => o.OrderItems)
                .HasForeignKey(oi => oi.OrderID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.MenuItem)
                .WithMany(mi => mi.OrderItems)
                .HasForeignKey(oi => oi.MenuItemID)
                .OnDelete(DeleteBehavior.Restrict);

            // Table Relationships
            modelBuilder.Entity<TableReservation>()
                .HasOne(tr => tr.Table)
                .WithMany(t => t.TableReservations)
                .HasForeignKey(tr => tr.TableID);

            // Fluent API for Additional Constraints
            modelBuilder.Entity<Restaurant>()
                .Property(r => r.AverageRating)
                .HasPrecision(2, 1); // E.g., Max rating: 10.0

            modelBuilder.Entity<MenuItem>()
                .Property(mi => mi.Price)
                .HasColumnType("decimal(10, 2)"); // Ensures proper price precision

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