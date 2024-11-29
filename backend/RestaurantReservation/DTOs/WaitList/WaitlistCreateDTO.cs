namespace RestaurantReservation.DTOs.WaitList
{
    public class WaitlistCreateDTO
    {
        public int RestaurantID { get; set; }
        public string UserID { get; set; } = string.Empty;
        public DateTime JoinTime { get; set; }
        public int PartySize { get; set; }
    }
}
