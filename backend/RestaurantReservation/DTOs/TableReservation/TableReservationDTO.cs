namespace RestaurantReservation.DTOs.TableReservation
{
    public class TableReservationDTO
    {
        public int ReservationID { get; set; }
        public DateTime ReservationDate { get; set; }
        public string Username { get; set; } // Assuming User or Customer details exist
    }
}