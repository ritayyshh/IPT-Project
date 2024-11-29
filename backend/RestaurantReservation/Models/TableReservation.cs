namespace RestaurantReservation.Models
{
    public class TableReservation
    {
        public int TableReservationID { get; set; }
        public int TableID { get; set; }
        public int RestaurantID { get; set; }
        public string UserID {get; set; }
        public string Username { get; set; } = string.Empty;
        public DateTime ReservationDate { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public int PartySize { get; set; }
        public string SpecialRequests { get; set; } = string.Empty;

        public Table Table { get; set; }
        public AppUser User { get; set; }
    }
}
