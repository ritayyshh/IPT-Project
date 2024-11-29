using RestaurantReservation.DTOs.MenuItem;
using RestaurantReservation.DTOs.Review;
namespace RestaurantReservation.DTOs.Restaurant
{
    public class RestaurantDetailsDTO
    {
        public int RestaurantID { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string ContactNumber { get; set; } = string.Empty;
        public double AverageRating { get; set; }
        public ICollection<MenuItemDTO> MenuItems { get; set; }
        public ICollection<ReviewDTO> Reviews { get; set; }
    }
}