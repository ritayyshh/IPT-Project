namespace RestaurantReservation.DTOs.TableReservation
{
    public class TableReservationDetailsDTO
    {
        public int TableReservationID { get; set; }
        public int TableID { get; set; }
        public int RestaurantID { get; set; }
        public string? Username { get; set; }
        public DateTime ReservationDate { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public int PartySize { get; set; }
        public string SpecialRequests { get; set; } = string.Empty;
    }
}
