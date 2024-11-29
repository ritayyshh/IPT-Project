using RestaurantReservation.DTOs.TableReservation;

namespace RestaurantReservation.DTOs.Table
{
    public class RestaurantTablesDTO
    {
        public int TableID { get; set; }
        public int SeatingCapacity { get; set; }
        public bool IsAvailable { get; set; }
    }
}