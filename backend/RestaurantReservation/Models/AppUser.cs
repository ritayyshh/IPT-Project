using Microsoft.AspNetCore.Identity;
namespace RestaurantReservation.Models
{
    public class AppUser : IdentityUser
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;

        public ICollection<TableReservation> TableReservations { get; set; }
        public ICollection<Order> Orders { get; set; }
        public ICollection<Review> Reviews { get; set; }
       // public ICollection<Waitlist> Waitlists { get; set; }
    }
}