using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestaurantReservation.Data;
using RestaurantReservation.Models;
using RestaurantReservation.DTOs.Restaurant;
using RestaurantReservation.DTOs.MenuItem;
using RestaurantReservation.DTOs.Review; // Include namespace for DTOs

namespace RestaurantReservation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RestaurantsController : ControllerBase
    {
        private readonly AppDBContext _context;

        public RestaurantsController(AppDBContext context)
        {
            _context = context;
        }

        // GET: api/Restaurants
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RestaurantBasicDTO>>> GetRestaurants()
        {
            var restaurants = await _context.Restaurants
                .Select(r => new RestaurantBasicDTO
                {
                    RestaurantID = r.RestaurantID,
                    Name = r.Name,
                    Location = r.Location,
                    AverageRating = r.AverageRating
                })
                .ToListAsync();

            return Ok(restaurants);
        }

        // GET: api/Restaurants/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RestaurantDetailsDTO>> GetRestaurant(int id)
        {
            var restaurant = await _context.Restaurants
            .Include(r => r.MenuItems)
            .Include(r => r.Reviews)
                .ThenInclude(rv => rv.User) // Include related AppUser data
            .Where(r => r.RestaurantID == id)
            .Select(r => new RestaurantDetailsDTO
            {
                RestaurantID = r.RestaurantID,
                Name = r.Name,
                Location = r.Location,
                Description = r.Description,
                ContactNumber = r.ContactNumber,
                AverageRating = r.AverageRating,
                MenuItems = r.MenuItems.Select(mi => new MenuItemDTO
                {
                    MenuItemID = mi.MenuItemID,
                    Name = mi.Name,
                    Description = mi.Description,
                    Price = mi.Price
                }).ToList(),
                Reviews = r.Reviews.Select(rv => new ReviewDTO
                {
                    ReviewID = rv.ReviewID,
                    Rating = rv.Rating,
                    Comment = rv.Comment,
                    ReviewDate = rv.ReviewDate,
                    UserName = rv.User.UserName // Assuming AppUser has a Name property
                }).ToList()
            })
            .FirstOrDefaultAsync();


            if (restaurant == null)
            {
                return NotFound();
            }

            return Ok(restaurant);
        }

        // PUT: api/Restaurants/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRestaurant(int id, RestaurantUpdateDTO restaurantDTO)
        {
            var restaurant = await _context.Restaurants.FindAsync(id);
            if (restaurant == null)
            {
                return NotFound();
            }

            // Update fields from DTO
            restaurant.Name = restaurantDTO.Name;
            restaurant.Location = restaurantDTO.Location;
            restaurant.Description = restaurantDTO.Description;
            restaurant.ContactNumber = restaurantDTO.ContactNumber;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RestaurantExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Restaurants
        [HttpPost]
        public async Task<ActionResult<Restaurant>> PostRestaurant(RestaurantCreateDTO restaurantDTO)
        {
            var restaurant = new Restaurant
            {
                Name = restaurantDTO.Name,
                Location = restaurantDTO.Location,
                Description = restaurantDTO.Description,
                ContactNumber = restaurantDTO.ContactNumber
            };

            _context.Restaurants.Add(restaurant);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetRestaurant), new { id = restaurant.RestaurantID }, restaurant);
        }

        // DELETE: api/Restaurants/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRestaurant(int id)
        {
            var restaurant = await _context.Restaurants.FindAsync(id);
            if (restaurant == null)
            {
                return NotFound();
            }

            _context.Restaurants.Remove(restaurant);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool RestaurantExists(int id)
        {
            return _context.Restaurants.Any(e => e.RestaurantID == id);
        }
    }
}
