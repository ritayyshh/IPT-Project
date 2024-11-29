namespace RestaurantReservation.DTOs.TableReservation
{
    public class UserTableReservationDTO
    {
        public int TableReservationID { get; set; }
        public string ReservationDate { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public int PartySize { get; set; }
        public string SpecialRequests { get; set; }
        public string RestaurantName { get; set; } // Comes from the associated table's restaurant
        public string TableName { get; set; }
    }
}
