namespace RestaurantReservation.DTOs.Review
{
    public class ReviewCreateDTO
    {
        public int RestaurantID { get; set; }
        public string UserID { get; set; } = string.Empty;
        public double Rating { get; set; }
        public string Comment { get; set; } = string.Empty;
    }
}
