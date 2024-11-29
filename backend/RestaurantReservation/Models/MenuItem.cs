namespace RestaurantReservation.Models
{
    public class MenuItem
    {
        public int MenuItemID { get; set; }
        public int RestaurantID { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }

        public Restaurant Restaurant { get; set; }
        public ICollection<OrderItem> OrderItems { get; set; }
    }
}