namespace RestaurantReservation.Models
{
    public class Waitlist
    {
        public int WaitlistID { get; set; }
        public int RestaurantID { get; set; }
        public int TableID { get; set; }
        public string UserID { get; set; } = string.Empty;
    }
}