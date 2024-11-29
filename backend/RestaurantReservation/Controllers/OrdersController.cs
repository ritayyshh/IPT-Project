using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestaurantReservation.Data;
using RestaurantReservation.DTOs;
using RestaurantReservation.DTOs.Order;
using RestaurantReservation.DTOs.OrderItem;
using RestaurantReservation.Models;

namespace RestaurantReservation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly AppDBContext _context;

        public OrdersController(AppDBContext context)
        {
            _context = context;
        }

        // GET: api/Orders
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderDetailsDTO>>> GetOrders()
        {
            var orders = await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.MenuItem)
                .Include(o => o.Restaurant)
                .ToListAsync();

            var orderDetailsDTOs = orders.Select(order => new OrderDetailsDTO
            {
                OrderID = order.OrderID,
                UserID = order.UserID,
                RestaurantID = order.RestaurantID,
                RestaurantName = order.Restaurant.Name,
                OrderDate = order.OrderDate,
                TotalAmount = order.TotalAmount,
                OrderStatus = order.OrderStatus,
                OrderItems = order.OrderItems.Select(oi => new OrderItemDetailsDTO
                {
                    OrderItemID = oi.OrderItemID,
                    MenuItemID = oi.MenuItemID,
                    MenuItemName = oi.MenuItem.Name,
                    Quantity = oi.Quantity
                }).ToList()
            });

            return Ok(orderDetailsDTOs);
        }

        // GET: api/Orders/5
        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDetailsDTO>> GetOrder(int id)
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.MenuItem)
                .Include(o => o.Restaurant)
                .FirstOrDefaultAsync(o => o.OrderID == id);

            if (order == null)
            {
                return NotFound();
            }

            var orderDetailsDTO = new OrderDetailsDTO
            {
                OrderID = order.OrderID,
                UserID = order.UserID,
                RestaurantID = order.RestaurantID,
                RestaurantName = order.Restaurant.Name,
                OrderDate = order.OrderDate,
                TotalAmount = order.TotalAmount,
                OrderStatus = order.OrderStatus,
                OrderItems = order.OrderItems.Select(oi => new OrderItemDetailsDTO
                {
                    OrderItemID = oi.OrderItemID,
                    MenuItemID = oi.MenuItemID,
                    MenuItemName = oi.MenuItem.Name,
                    Quantity = oi.Quantity
                }).ToList()
            };

            return Ok(orderDetailsDTO);
        }

        // PUT: api/Orders/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrder(int id, OrderUpdateDTO orderUpdateDTO)
        {
            var order = await _context.Orders.Include(o => o.OrderItems).FirstOrDefaultAsync(o => o.OrderID == id);

            if (order == null)
            {
                return NotFound();
            }

            // Update order details
            order.OrderStatus = orderUpdateDTO.OrderStatus;

            _context.Entry(order).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrderExists(id))
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

        // POST: api/Orders
        [HttpPost]
        public async Task<ActionResult<Order>> PostOrder(OrderCreateDTO orderCreateDTO)
        {
            var order = new Order
            {
                UserID = orderCreateDTO.UserID,
                RestaurantID = orderCreateDTO.RestaurantID,
                OrderDate = orderCreateDTO.OrderDate,
                OrderStatus = "pending",
                TotalAmount = 0 // TotalAmount will be calculated later
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetOrder", new { id = order.OrderID }, new { order.OrderID });
        }

        // DELETE: api/Orders/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var order = await _context.Orders.Include(o => o.OrderItems).FirstOrDefaultAsync(o => o.OrderID == id);
            if (order == null)
            {
                return NotFound();
            }

            _context.OrderItems.RemoveRange(order.OrderItems);
            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool OrderExists(int id)
        {
            return _context.Orders.Any(e => e.OrderID == id);
        }
    }
}