namespace RestaurantReservation.DTOs.WaitList
{
    public class WaitListCreateDTO
    {
        public int RestaurantID { get; set; }
        public int TableID { get; set; }
        public string UserID { get; set; }
    }
}