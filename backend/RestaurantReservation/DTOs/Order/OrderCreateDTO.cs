using RestaurantReservation.DTOs.OrderItem;

namespace RestaurantReservation.DTOs.Order
{
    public class OrderCreateDTO
    {
        public string UserID { get; set; } = string.Empty;
        public int RestaurantID { get; set; }
        public int TableID { get; set; }
        public int ReservationID { get; set; }
        public DateTime OrderDate { get; set; }
    }
}
