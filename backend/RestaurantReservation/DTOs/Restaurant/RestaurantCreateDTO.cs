namespace RestaurantReservation.DTOs.Restaurant
{
    public class RestaurantCreateDTO
    {
        public string Name { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string ContactNumber { get; set; } = string.Empty;
    }
}
