namespace RestaurantReservation.DTOs.Table
{
    public class TableCreateDTO
    {
        public int RestaurantID { get; set; }
        public int SeatingCapacity { get; set; }
        public bool IsAvailable { get; set; }
    }
}
