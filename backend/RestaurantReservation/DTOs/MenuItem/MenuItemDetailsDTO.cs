namespace RestaurantReservation.DTOs.MenuItem
{
    public class MenuItemDetailsDTO
    {
        public int MenuItemID { get; set; }
        public int RestaurantID { get; set; }
        public string RestaurantName { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
    }
}
