namespace RestaurantReservation.Models
{
    public class Restaurant
    {
        public int RestaurantID { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string ContactNumber { get; set; } = string.Empty;
        public double AverageRating { get; set; }

        public ICollection<MenuItem> MenuItems { get; set; }
        public ICollection<Review> Reviews { get; set; }
        public ICollection<Table> Tables { get; set; }
        public ICollection<Order> Orders { get; set; }
        public ICollection<Waitlist> Waitlists { get; set; }
    }
}