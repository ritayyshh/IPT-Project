namespace RestaurantReservation.DTOs.TableReservation
{
    public class UserTableReservationDTO
    {
        public int TableReservationID { get; set; }
        public DateTime ReservationDate { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public int PartySize { get; set; }
        public string SpecialRequests { get; set; }
        public string RestaurantName { get; set; } // Comes from the associated table's restaurant
        public string TableName { get; set; }
    }
}
