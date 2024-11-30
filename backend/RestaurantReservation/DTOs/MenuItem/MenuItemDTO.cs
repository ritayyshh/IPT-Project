namespace RestaurantReservation.DTOs.MenuItem
{
    public class MenuItemDTO
    {
        public int MenuItemID { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; }
        public decimal Price { get; set; }
    }
}
