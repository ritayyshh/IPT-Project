namespace RestaurantReservation.DTOs.OrderItem
{
    public class OrderItemCreateDTO
    {
        public int OrderID { get; set; }
        public int MenuItemID { get; set; }
        public int Quantity { get; set; }
    }
}
