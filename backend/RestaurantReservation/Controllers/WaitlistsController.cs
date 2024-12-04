using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestaurantReservation.Data;
using RestaurantReservation.Models;
using RestaurantReservation.DTOs.WaitList;

namespace RestaurantReservation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WaitListsController : ControllerBase
    {
        private readonly AppDBContext _context;

        public WaitListsController(AppDBContext context)
        {
            _context = context;
        }

        // GET: api/WaitLists/by-user/{userId}
        [HttpGet("by-user/{userId}")]
        public async Task<IActionResult> GetWaitListsByUser(string userId)
        {
            var waitLists = await _context.WaitLists
                .Where(w => w.UserID == userId)
                .ToListAsync();

            // if (waitLists == null || !waitLists.Any())
            //     return NotFound(new { Message = "No waitlists found for the given user ID." });

            return Ok(waitLists);
        }

        // GET: api/WaitLists/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetWaitListById(int id)
        {
            var waitList = await _context.WaitLists
                .FirstOrDefaultAsync(w => w.WaitListID == id);

            // if (waitList == null)
            //     return NotFound(new { Message = "Waitlist not found with the given ID." });

            return Ok(waitList);
        }
        [HttpPost]
        public async Task<IActionResult> CreateWaitList([FromBody] WaitListCreateDTO waitListDto)
        {
            if (waitListDto == null)
                return BadRequest(new { Message = "Invalid waitlist data." });

            // Map DTO to entity
            var waitList = new WaitList
            {
                UserID = waitListDto.UserID,
                RestaurantID = waitListDto.RestaurantID,
                TableID = waitListDto.TableID
            };

            // Add the new waitlist to the database
            _context.WaitLists.Add(waitList);
            await _context.SaveChangesAsync();

            // Return the created waitlist with the auto-generated IDs
            return CreatedAtAction(nameof(GetWaitListById), new { id = waitList.WaitListID }, waitList);
        }
        // GET: api/WaitLists
        [HttpGet]
        public async Task<IActionResult> GetAllWaitLists()
        {
            var waitLists = await _context.WaitLists.ToListAsync();

            // if (waitLists == null || !waitLists.Any())
            //     return NotFound(new { Message = "No waitlists found." });

            return Ok(waitLists);
        }
        // GET: api/WaitLists/by-table/{tableId}
        [HttpGet("by-table/{tableId}")]
        public async Task<IActionResult> GetWaitListsByTable(int tableId)
        {
            var waitLists = await _context.WaitLists
                .Where(w => w.TableID == tableId)
                .ToListAsync();

            // if (waitLists == null || !waitLists.Any())
            //     return NotFound(new { Message = "No waitlists found for the given table ID." });

            return Ok(waitLists);
        }
        // DELETE: api/WaitLists/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWaitList(int id)
        {
            var waitList = await _context.WaitLists
                .FirstOrDefaultAsync(w => w.WaitListID == id);

            if (waitList == null)
                return NotFound(new { Message = "Waitlist not found with the given ID." });

            _context.WaitLists.Remove(waitList);
            await _context.SaveChangesAsync();

            return NoContent(); // Successfully deleted, no content to return
        }

    }
}