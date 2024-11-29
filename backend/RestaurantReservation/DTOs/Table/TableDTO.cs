namespace RestaurantReservation.DTOs.Table
{
    public class TableDTO
    {
        public int TableID { get; set; }
        public int Capacity { get; set; }
        public bool IsReserved { get; set; }
    }
}
