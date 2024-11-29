namespace RestaurantReservation.DTOs.Review
{
    public class ReviewDTO
    {
        public int ReviewID { get; set; }
        public double Rating { get; set; }
        public string Comment { get; set; } = string.Empty;
        public DateTime ReviewDate { get; set; }
        public string UserName { get; set; } = string.Empty; // Add if User's name is needed
    }
}
