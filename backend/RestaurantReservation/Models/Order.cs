namespace RestaurantReservation.Models
{
    public class Order
    {
        public int OrderID { get; set; }
        public string UserID { get; set; } = string.Empty;
        public int RestaurantID { get; set; }
        public int TableID { get; set; }
        public int ReservationID { get; set; }
        public DateTime OrderDate { get; set; }
        public decimal TotalAmount { get; set; }
        public string OrderStatus { get; set; } = string.Empty;

        public AppUser User { get; set; }
        public Restaurant Restaurant { get; set; }
        public ICollection<OrderItem> OrderItems { get; set; }
    }
}