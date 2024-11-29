namespace RestaurantReservation.DTOs.WaitList
{
    public class WaitlistDTO
    {
        public int WaitlistID { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public DateTime RequestedTime { get; set; }
    }
}
