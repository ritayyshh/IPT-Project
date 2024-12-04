using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestaurantReservation.Data;
using RestaurantReservation.Models;
using RestaurantReservation.DTOs;
using RestaurantReservation.DTOs.Table;
using RestaurantReservation.DTOs.TableReservation;

namespace RestaurantReservation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TablesController : ControllerBase
    {
        private readonly AppDBContext _context;

        public TablesController(AppDBContext context)
        {
            _context = context;
        }

        // GET: api/Tables
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TableBasicDTO>>> GetTables()
        {
            var tables = await _context.Tables
                .Select(t => new TableBasicDTO
                {
                    TableID = t.TableID,
                    RestaurantID = t.RestaurantID,
                    SeatingCapacity = t.SeatingCapacity,
                    IsAvailable = t.IsAvailable
                })
                .ToListAsync();

            return Ok(tables);
        }

        // GET: api/Tables/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TableDetailsDTO>> GetTable(int id)
        {
            var table = await _context.Tables
                .Include(t => t.Restaurant)
                .Include(t => t.TableReservations)
                .FirstOrDefaultAsync(t => t.TableID == id);

            if (table == null)
            {
                return NotFound();
            }

            var tableDetails = new TableDetailsDTO
            {
                TableID = table.TableID,
                SeatingCapacity = table.SeatingCapacity,
                IsAvailable = table.IsAvailable,
                TableReservations = table.TableReservations.Select(tr => new TableReservationDTO
                {
                    ReservationID = tr.TableReservationID,
                    ReservationDate = tr.ReservationDate,
                    Username = tr.Username // Assuming this field exists in `TableReservation`
                }).ToList()
            };

            return Ok(tableDetails);
        }

        // PUT: api/Tables/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTable(int id, TableUpdateDTO tableUpdateDTO)
        {
            var table = await _context.Tables.FindAsync(id);

            if (table == null)
            {
                return NotFound();
            }

            // Update only the allowed fields
            table.SeatingCapacity = tableUpdateDTO.SeatingCapacity;
            table.IsAvailable = tableUpdateDTO.IsAvailable;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TableExists(id))
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

        // POST: api/Tables
        [HttpPost]
        public async Task<ActionResult<TableBasicDTO>> PostTable(TableCreateDTO tableCreateDTO)
        {
            var table = new Table
            {
                RestaurantID = tableCreateDTO.RestaurantID,
                SeatingCapacity = tableCreateDTO.SeatingCapacity,
                IsAvailable = tableCreateDTO.IsAvailable
            };

            _context.Tables.Add(table);
            await _context.SaveChangesAsync();

            var createdTable = new TableBasicDTO
            {
                TableID = table.TableID,
                SeatingCapacity = table.SeatingCapacity,
                IsAvailable = table.IsAvailable
            };

            return CreatedAtAction(nameof(GetTable), new { id = table.TableID }, createdTable);
        }

        // DELETE: api/Tables/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTable(int id)
        {
            var table = await _context.Tables.FindAsync(id);
            if (table == null)
            {
                return NotFound();
            }

            _context.Tables.Remove(table);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        // GET: api/Tables/Restaurant/5
        [HttpGet("Restaurant/{restaurantId}")]
        public async Task<ActionResult<IEnumerable<RestaurantTablesDTO>>> GetTablesByRestaurant(int restaurantId)
        {
            var tables = await _context.Tables
                .Where(t => t.RestaurantID == restaurantId)
                .Select(t => new RestaurantTablesDTO
                {
                    TableID = t.TableID,
                    SeatingCapacity = t.SeatingCapacity,
                    IsAvailable = t.IsAvailable,
                    Waitlist = t.Waitlist // Include the original Waitlist collection directly
                })
                .ToListAsync();

            if (!tables.Any())
            {
                return NotFound(new { Message = "No tables found for the specified restaurant ID." });
            }

            return Ok(tables);
        }
        private bool TableExists(int id)
        {
            return _context.Tables.Any(e => e.TableID == id);
        }
    }
}