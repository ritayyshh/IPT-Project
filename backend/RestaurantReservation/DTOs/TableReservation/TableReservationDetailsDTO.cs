namespace RestaurantReservation.DTOs.TableReservation
{
    public class TableReservationDetailsDTO
    {
        public int TableReservationID { get; set; }
        public int TableID { get; set; }
        public int RestaurantID { get; set; }
        public string RestaurantName { get; set; }
        public string? Username { get; set; }
        public string ReservationDate { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public int PartySize { get; set; }
        public string SpecialRequests { get; set; } = string.Empty;
    }
}
