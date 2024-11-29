namespace RestaurantReservation.DTOs.MenuItem
{
    public class MenuItemCreateDTO
    {
        public int RestaurantID { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
    }
}
