namespace RestaurantReservation.DTOs.Review
{
    public class ReviewUpdateDTO
    {
        public double Rating { get; set; }
        public string Comment { get; set; } = string.Empty;
    }
}
