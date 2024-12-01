namespace RestaurantReservation.Models
{
    public class TableReservation
    {
        public int TableReservationID { get; set; }
        public int TableID { get; set; }
        public int RestaurantID { get; set; }
        public string? UserID {get; set; }
        public string Username { get; set; } = string.Empty;
        public string? ReservationDate { get; set; }
        public string? StartTime { get; set; }
        public string? EndTime { get; set; }
        public int PartySize { get; set; }
        public string SpecialRequests { get; set; } = string.Empty;

        public Table? Table { get; set; }
        public AppUser? User { get; set; }
    }
}
