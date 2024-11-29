namespace RestaurantReservation.Models
{
    public class Waitlist
    {
        public int WaitlistID { get; set; }
        public int RestaurantID { get; set; }
        public string UserID { get; set; } = string.Empty;
        public DateTime JoinTime { get; set; }
        public int PartySize { get; set; }

        // Navigation Properties
        public Restaurant Restaurant { get; set; }
        public AppUser User { get; set; }
    }

}
