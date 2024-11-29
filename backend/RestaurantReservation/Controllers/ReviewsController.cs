using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestaurantReservation.Data;
using RestaurantReservation.DTOs.Review;
using RestaurantReservation.Models;

namespace RestaurantReservation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewsController : ControllerBase
    {
        private readonly AppDBContext _context;

        public ReviewsController(AppDBContext context)
        {
            _context = context;
        }

        // GET: api/Reviews
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReviewBasicDTO>>> GetReviews()
        {
            var reviews = await _context.Reviews
                .Include(r => r.User)
                .Include(r => r.Restaurant)
                .Select(r => new ReviewBasicDTO
                {
                    ReviewID = r.ReviewID,
                    Rating = r.Rating,
                    Comment = r.Comment,
                    ReviewDate = r.ReviewDate
                })
                .ToListAsync();

            return Ok(reviews);
        }

        // GET: api/Reviews/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ReviewDetailsDTO>> GetReview(int id)
        {
            var review = await _context.Reviews
                .Include(r => r.User)
                .Include(r => r.Restaurant)
                .Where(r => r.ReviewID == id)
                .Select(r => new ReviewDetailsDTO
                {
                    ReviewID = r.ReviewID,
                    Rating = r.Rating,
                    Comment = r.Comment,
                    ReviewDate = r.ReviewDate,
                    UserName = r.User.UserName, // Assuming User.Name exists
                    RestaurantName = r.Restaurant.Name // Assuming Restaurant.Name exists
                })
                .FirstOrDefaultAsync();

            if (review == null)
            {
                return NotFound();
            }

            return Ok(review);
        }

        // PUT: api/Reviews/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutReview(int id, ReviewUpdateDTO reviewDTO)
        {
            var review = await _context.Reviews.FindAsync(id);
            if (review == null)
            {
                return NotFound();
            }

            // Update allowed fields
            review.Rating = reviewDTO.Rating;
            review.Comment = reviewDTO.Comment;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ReviewExists(id))
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

        // POST: api/Reviews
        [HttpPost]
        public async Task<ActionResult<ReviewDetailsDTO>> PostReview(ReviewCreateDTO reviewDTO)
        {
            var review = new Review
            {
                RestaurantID = reviewDTO.RestaurantID,
                UserID = reviewDTO.UserID,
                Rating = reviewDTO.Rating,
                Comment = reviewDTO.Comment,
                ReviewDate = DateTime.UtcNow // Set the current date
            };

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            // Map back to ReviewDetailsDTO for response
            var createdReview = await _context.Reviews
                .Include(r => r.User)
                .Include(r => r.Restaurant)
                .Where(r => r.ReviewID == review.ReviewID)
                .Select(r => new ReviewDetailsDTO
                {
                    ReviewID = r.ReviewID,
                    Rating = r.Rating,
                    Comment = r.Comment,
                    ReviewDate = r.ReviewDate,
                    UserName = r.User.UserName,
                    RestaurantName = r.Restaurant.Name
                })
                .FirstOrDefaultAsync();

            return CreatedAtAction("GetReview", new { id = review.ReviewID }, createdReview);
        }

        // DELETE: api/Reviews/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReview(int id)
        {
            var review = await _context.Reviews.FindAsync(id);
            if (review == null)
            {
                return NotFound();
            }

            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ReviewExists(int id)
        {
            return _context.Reviews.Any(e => e.ReviewID == id);
        }
    }
}