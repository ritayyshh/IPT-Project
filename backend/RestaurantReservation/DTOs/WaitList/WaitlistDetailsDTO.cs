namespace RestaurantReservation.DTOs.WaitList
{
    public class WaitlistDetailsDTO
    {
        public int WaitlistID { get; set; }
        public int RestaurantID { get; set; }
        public string RestaurantName { get; set; } = string.Empty;
        public string UserID { get; set; } = string.Empty;
        public DateTime JoinTime { get; set; }
        public int PartySize { get; set; }
    }
}
