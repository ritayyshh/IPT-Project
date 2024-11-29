namespace RestaurantReservation.DTOs.Restaurant
{
    public class RestaurantBasicDTO
    {
        public int RestaurantID { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public double AverageRating { get; set; }
    }
}
