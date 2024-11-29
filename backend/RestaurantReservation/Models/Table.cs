namespace RestaurantReservation.Models
{
    public class Table
    {
        public int TableID { get; set; }
        public int RestaurantID { get; set; }
        public int SeatingCapacity { get; set; }
        public bool IsAvailable { get; set; }

        public Restaurant Restaurant { get; set; }
        public ICollection<TableReservation> TableReservations { get; set; }
    }
}