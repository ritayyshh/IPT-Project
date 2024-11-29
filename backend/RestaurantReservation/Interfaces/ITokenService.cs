using RestaurantReservation.Models;
namespace RestaurantReservation.Interfaces
{
    public interface ITokenService
    {
        string CreateToken(AppUser user);
    }
}