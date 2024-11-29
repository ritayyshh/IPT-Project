using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestaurantReservation.Data;
using RestaurantReservation.Models;

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

        // GET: api/Waitlists
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Waitlist>>> GetWaitlists()
        {
            return await _context.Waitlists.ToListAsync();
        }

        // GET: api/Waitlists/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Waitlist>> GetWaitlist(int id)
        {
            var waitlist = await _context.Waitlists.FindAsync(id);

            if (waitlist == null)
            {
                return NotFound();
            }

            return waitlist;
        }

        // PUT: api/Waitlists/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutWaitlist(int id, Waitlist waitlist)
        {
            if (id != waitlist.WaitlistID)
            {
                return BadRequest();
            }

            _context.Entry(waitlist).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!WaitlistExists(id))
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

        // POST: api/Waitlists
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Waitlist>> PostWaitlist(Waitlist waitlist)
        {
            _context.Waitlists.Add(waitlist);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetWaitlist", new { id = waitlist.WaitlistID }, waitlist);
        }

        // DELETE: api/Waitlists/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWaitlist(int id)
        {
            var waitlist = await _context.Waitlists.FindAsync(id);
            if (waitlist == null)
            {
                return NotFound();
            }

            _context.Waitlists.Remove(waitlist);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool WaitlistExists(int id)
        {
            return _context.Waitlists.Any(e => e.WaitlistID == id);
        }
    }
}
