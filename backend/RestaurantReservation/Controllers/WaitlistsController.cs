using Microsoft.AspNetCore.Mvc;
using RestaurantReservation.Data;
using RestaurantReservation.Models;
using Microsoft.EntityFrameworkCore;

namespace RestaurantReservation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WaitlistsController : ControllerBase
    {
        private readonly AppDBContext _context;

        public WaitlistsController(AppDBContext context)
        {
            _context = context;
        }

        // Check if the table exists in the restaurant
        private bool TableExists(int tableId, int restaurantId)
        {
            return _context.Tables.Any(e => e.TableID == tableId && e.RestaurantID == restaurantId); // Assuming you have a Tables table with RestaurantID
        }

        // POST: api/Waitlists
        [HttpPost]
        public async Task<ActionResult<Waitlist>> PostWaitlist([FromBody] WaitListCreateDTO waitlistDTO)
        {
            // Validate if the table exists for the specified restaurant
            if (!TableExists(waitlistDTO.TableID, waitlistDTO.RestaurantID))
            {
                return NotFound(new { message = "Table not found for the specified restaurant" });
            }

            // Create the waitlist entity from the DTO
            var waitlist = new Waitlist
            {
                TableID = waitlistDTO.TableID,
                RestaurantID = waitlistDTO.RestaurantID,
                UserID = waitlistDTO.UserID
            };

            // Add and save the waitlist entry
            _context.Waitlists.Add(waitlist);
            await _context.SaveChangesAsync();

            // Return the created waitlist entry
            return CreatedAtAction(nameof(PostWaitlist), new { id = waitlist.WaitlistID }, waitlist);
        }

        // GET: api/Waitlists/user/{userId}
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<Waitlist>>> GetWaitlistsByUserId(string userId)
        {
            var waitlists = await _context.Waitlists
                                          .Where(w => w.UserID == userId)
                                          .ToListAsync();

            if (waitlists == null || !waitlists.Any())
            {
                return NotFound(new { message = "No waitlists found for the specified user" });
            }

            return Ok(waitlists);
        }

        // DELETE: api/Waitlists/user/{userId}
        [HttpDelete("user/{userId}")]
        public async Task<IActionResult> DeleteWaitlistsByUserId(string userId)
        {
            var waitlists = await _context.Waitlists
                                          .Where(w => w.UserID == userId)
                                          .ToListAsync();

            if (waitlists == null || !waitlists.Any())
            {
                return NotFound(new { message = "No waitlists found for the specified user" });
            }

            _context.Waitlists.RemoveRange(waitlists);
            await _context.SaveChangesAsync();

            return NoContent(); // Indicates successful deletion
        }

        private bool WaitlistExists(int id)
        {
            return _context.Waitlists.Any(e => e.WaitlistID == id);
        }
    }
}