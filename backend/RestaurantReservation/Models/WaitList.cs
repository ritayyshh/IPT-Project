using System.ComponentModel.DataAnnotations;

namespace RestaurantReservation.Models
{
    public class WaitList
    {
        public int WaitListID { get; set; }
        public int RestaurantID { get; set; }
        public int TableID { get; set; }
        public string UserID { get; set; }
    }
}