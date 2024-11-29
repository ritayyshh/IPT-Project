namespace RestaurantReservation.DTOs.Table
{
    public class TableBasicDTO
    {
        public int TableID { get; set; }
        public int RestaurantID { get; set; }
        public int SeatingCapacity { get; set; }
        public bool IsAvailable { get; set; }
    }
}
