using RestaurantReservation.DTOs.OrderItem;

namespace RestaurantReservation.DTOs.Order
{
    public class OrderDetailsDTO
    {
        public int OrderID { get; set; }
        public string UserID { get; set; } = string.Empty;
        public int RestaurantID { get; set; }
        public string RestaurantName { get; set; } = string.Empty;
        public DateTime OrderDate { get; set; }
        public decimal TotalAmount { get; set; }
        public string OrderStatus { get; set; } = string.Empty;
        public List<OrderItemDetailsDTO> OrderItems { get; set; } = new();
    }
}
