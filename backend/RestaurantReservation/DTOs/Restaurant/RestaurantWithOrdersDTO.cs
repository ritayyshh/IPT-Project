using RestaurantReservation.DTOs.Order;
namespace RestaurantReservation.DTOs.Restaurant
{
    public class RestaurantWithOrdersDTO
    {
        public int RestaurantID { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public ICollection<OrderDTO> Orders { get; set; }
    }
}
