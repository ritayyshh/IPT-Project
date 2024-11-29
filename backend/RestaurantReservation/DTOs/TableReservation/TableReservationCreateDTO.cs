namespace RestaurantReservation.DTOs.TableReservation
{
    public class TableReservationCreateDTO
    {
        public int TableID { get; set; }
        public string UserID { get; set; }
        public string Username { get; set; } = string.Empty;
        public int RestaurantID { get; set; }
        public string ReservationDate { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public int PartySize { get; set; }
        public string SpecialRequests { get; set; } = string.Empty;
    }
}
