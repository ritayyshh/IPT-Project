namespace RestaurantReservation.Models
{
    public class Review
    {
        public int ReviewID { get; set; }
        public int RestaurantID { get; set; }
        public string UserID { get; set; } = string.Empty;
        public double Rating { get; set; }
        public string Comment { get; set; } = string.Empty;
        public DateTime ReviewDate { get; set; }

        public Restaurant Restaurant { get; set; }
        public AppUser User { get; set; }
    }
}
