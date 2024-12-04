using RestaurantReservation.DTOs.Table;
namespace RestaurantReservation.DTOs.Restaurant
{
    public class RestaurantWithReservationsDTO
    {
        public int RestaurantID { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public ICollection<TableDTO> Tables { get; set; }
    }
}
