namespace RestaurantReservation.DTOs.Review
{
    public class ReviewDetailsDTO
    {
        public int ReviewID { get; set; }
        public double Rating { get; set; }
        public string Comment { get; set; } = string.Empty;
        public DateTime ReviewDate { get; set; }
        public string UserName { get; set; } = string.Empty; // Retrieved from AppUser.Name
        public string RestaurantName { get; set; } = string.Empty; // Retrieved from Restaurant.Name
    }
}
