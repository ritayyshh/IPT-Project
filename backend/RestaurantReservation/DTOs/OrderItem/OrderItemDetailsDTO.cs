namespace RestaurantReservation.DTOs.OrderItem
{
    public class OrderItemDetailsDTO
    {
        public int OrderItemID { get; set; }
        public int OrderID { get; set; }
        public int MenuItemID { get; set; }
        public string MenuItemName { get; set; }
        public int Quantity { get; set; }
    }
}
