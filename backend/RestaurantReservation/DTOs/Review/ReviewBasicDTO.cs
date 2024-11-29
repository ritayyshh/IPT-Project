namespace RestaurantReservation.DTOs.Review
{
    public class ReviewBasicDTO
    {
        public int ReviewID { get; set; }
        public double Rating { get; set; }
        public string Comment { get; set; } = string.Empty;
        public DateTime ReviewDate { get; set; }
    }
}
