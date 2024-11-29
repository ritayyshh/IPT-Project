using System.ComponentModel.DataAnnotations;
namespace RestaurantReservation.DTOs.Account
{
    public class LoginDTO
    {
        [Required]
        public string Username { get; set; }
        [Required]
        public string Password { get; set; }
    }
}