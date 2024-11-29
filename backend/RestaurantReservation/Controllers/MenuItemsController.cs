using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestaurantReservation.Data;
using RestaurantReservation.DTOs.MenuItem;
using RestaurantReservation.Models;

namespace RestaurantReservation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MenuItemsController : ControllerBase
    {
        private readonly AppDBContext _context;

        public MenuItemsController(AppDBContext context)
        {
            _context = context;
        }

        // GET: api/MenuItems
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MenuItemDetailsDTO>>> GetMenuItems()
        {
            var menuItems = await _context.MenuItems
                .Include(m => m.Restaurant)
                .Select(m => new MenuItemDetailsDTO
                {
                    MenuItemID = m.MenuItemID,
                    RestaurantID = m.RestaurantID,
                    RestaurantName = m.Restaurant.Name,
                    Name = m.Name,
                    Description = m.Description,
                    Price = m.Price
                })
                .ToListAsync();

            return Ok(menuItems);
        }

        // GET: api/MenuItems/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MenuItemDetailsDTO>> GetMenuItem(int id)
        {
            var menuItem = await _context.MenuItems
                .Include(m => m.Restaurant)
                .Where(m => m.MenuItemID == id)
                .Select(m => new MenuItemDetailsDTO
                {
                    MenuItemID = m.MenuItemID,
                    RestaurantID = m.RestaurantID,
                    RestaurantName = m.Restaurant.Name,
                    Name = m.Name,
                    Description = m.Description,
                    Price = m.Price
                })
                .FirstOrDefaultAsync();

            if (menuItem == null)
            {
                return NotFound();
            }

            return Ok(menuItem);
        }

        // PUT: api/MenuItems/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMenuItem(int id, MenuItemUpdateDTO menuItemDTO)
        {
            var menuItem = await _context.MenuItems.FindAsync(id);
            if (menuItem == null)
            {
                return NotFound();
            }

            menuItem.Name = menuItemDTO.Name;
            menuItem.Description = menuItemDTO.Description;
            menuItem.Price = menuItemDTO.Price;

            _context.Entry(menuItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MenuItemExists(id))
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

        // POST: api/MenuItems
        [HttpPost]
        public async Task<ActionResult<MenuItemDetailsDTO>> PostMenuItem(MenuItemCreateDTO menuItemDTO)
        {
            var restaurantExists = await _context.Restaurants.AnyAsync(r => r.RestaurantID == menuItemDTO.RestaurantID);
            if (!restaurantExists)
            {
                return BadRequest("Invalid RestaurantID.");
            }

            var menuItem = new MenuItem
            {
                RestaurantID = menuItemDTO.RestaurantID,
                Name = menuItemDTO.Name,
                Description = menuItemDTO.Description,
                Price = menuItemDTO.Price
            };

            _context.MenuItems.Add(menuItem);
            await _context.SaveChangesAsync();

            var createdMenuItem = new MenuItemDetailsDTO
            {
                MenuItemID = menuItem.MenuItemID,
                RestaurantID = menuItem.RestaurantID,
                RestaurantName = (await _context.Restaurants.FindAsync(menuItem.RestaurantID))?.Name ?? string.Empty,
                Name = menuItem.Name,
                Description = menuItem.Description,
                Price = menuItem.Price
            };

            return CreatedAtAction(nameof(GetMenuItem), new { id = menuItem.MenuItemID }, createdMenuItem);
        }

        // DELETE: api/MenuItems/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMenuItem(int id)
        {
            var menuItem = await _context.MenuItems.FindAsync(id);
            if (menuItem == null)
            {
                return NotFound();
            }

            _context.MenuItems.Remove(menuItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MenuItemExists(int id)
        {
            return _context.MenuItems.Any(e => e.MenuItemID == id);
        }
    }
}