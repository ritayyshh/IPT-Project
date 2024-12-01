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
                TableID = order.TableID,
                ReservationID = order.ReservationID,
                RestaurantName = order.Restaurant.Name,
                OrderDate = order.OrderDate,
                TotalAmount = order.TotalAmount,
                OrderStatus = order.OrderStatus,
                OrderItems = order.OrderItems.Select(oi => new OrderItemDetailsDTO
                {
                    OrderItemID = oi.OrderItemID,
                    OrderID = oi.OrderID,
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
                TableID = order.TableID,
                ReservationID = order.ReservationID,
                RestaurantName = order.Restaurant.Name,
                OrderDate = order.OrderDate,
                TotalAmount = order.TotalAmount,
                OrderStatus = order.OrderStatus,
                OrderItems = order.OrderItems.Select(oi => new OrderItemDetailsDTO
                {
                    OrderItemID = oi.OrderItemID,
                    OrderID = oi.OrderID,
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
                TableID = orderCreateDTO.TableID,
                ReservationID = orderCreateDTO.ReservationID,
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

        // GET: api/Orders/table/{tableId}
        [HttpGet("table/{tableId}")]
        public async Task<ActionResult<IEnumerable<OrderDetailsDTO>>> GetOrdersByTableId(int tableId)
        {
            var orders = await _context.Orders
                .Where(o => o.TableID == tableId)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.MenuItem)
                .Include(o => o.Restaurant)
                .ToListAsync();

            if (orders == null || !orders.Any())
            {
                return NotFound();
            }

            var orderDetailsDTOs = orders.Select(order => new OrderDetailsDTO
            {
                OrderID = order.OrderID,
                UserID = order.UserID,
                RestaurantID = order.RestaurantID,
                TableID = order.TableID,
                ReservationID = order.ReservationID,
                RestaurantName = order.Restaurant.Name,
                OrderDate = order.OrderDate,
                TotalAmount = order.TotalAmount,
                OrderStatus = order.OrderStatus,
                OrderItems = order.OrderItems.Select(oi => new OrderItemDetailsDTO
                {
                    OrderItemID = oi.OrderItemID,
                    OrderID = oi.OrderID,
                    MenuItemID = oi.MenuItemID,
                    MenuItemName = oi.MenuItem.Name,
                    Quantity = oi.Quantity
                }).ToList()
            }).ToList();

            return Ok(orderDetailsDTOs);
        }

        // GET: api/Orders/byUser/{userId}
        [HttpGet("byUser/{userId}")]
        public async Task<ActionResult<IEnumerable<OrderDetailsDTO>>> GetOrdersByUserId(string userId)
        {
            var orders = await _context.Orders
                .Where(o => o.UserID == userId) // Filter by UserID (string)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.MenuItem)
                .Include(o => o.Restaurant)
                .ToListAsync();

            if (orders == null || !orders.Any())
            {
                return NotFound(); // If no orders found
            }

            var orderDetailsDTOs = orders.Select(order => new OrderDetailsDTO
            {
                OrderID = order.OrderID,
                UserID = order.UserID,
                RestaurantID = order.RestaurantID,
                TableID = order.TableID,
                ReservationID = order.ReservationID,
                RestaurantName = order.Restaurant.Name,
                OrderDate = order.OrderDate,
                TotalAmount = order.TotalAmount,
                OrderStatus = order.OrderStatus,
                OrderItems = order.OrderItems.Select(oi => new OrderItemDetailsDTO
                {
                    OrderItemID = oi.OrderItemID,
                    OrderID = oi.OrderID,
                    MenuItemID = oi.MenuItemID,
                    MenuItemName = oi.MenuItem.Name,
                    Quantity = oi.Quantity
                }).ToList()
            }).ToList();

            return Ok(orderDetailsDTOs);
        }

        private bool OrderExists(int id)
        {
            return _context.Orders.Any(e => e.OrderID == id);
        }
    }
}