using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestaurantReservation.Data;
using RestaurantReservation.DTOs.OrderItem;
using RestaurantReservation.Models;

[Route("api/[controller]")]
[ApiController]
public class OrderItemsController : ControllerBase
{
    private readonly AppDBContext _context;

    public OrderItemsController(AppDBContext context)
    {
        _context = context;
    }

    // GET: api/OrderItems
    [HttpGet]
    public async Task<ActionResult<IEnumerable<OrderItemDetailsDTO>>> GetOrderItems()
    {
        var orderItems = await _context.OrderItems
            .Include(oi => oi.MenuItem)
            .Select(oi => new OrderItemDetailsDTO
            {
                OrderItemID = oi.OrderItemID,
                OrderID = oi.OrderID,
                MenuItemID = oi.MenuItemID,
                MenuItemName = oi.MenuItem.Name,
                Quantity = oi.Quantity
            })
            .ToListAsync();

        return Ok(orderItems);
    }

    // GET: api/OrderItems/5
    [HttpGet("{id}")]
    public async Task<ActionResult<OrderItemDetailsDTO>> GetOrderItem(int id)
    {
        var orderItem = await _context.OrderItems
            .Include(oi => oi.MenuItem)
            .Where(oi => oi.OrderItemID == id)
            .Select(oi => new OrderItemDetailsDTO
            {
                OrderItemID = oi.OrderItemID,
                OrderID = oi.OrderID,
                MenuItemID = oi.MenuItemID,
                MenuItemName = oi.MenuItem.Name,
                Quantity = oi.Quantity
            })
            .FirstOrDefaultAsync();

        if (orderItem == null)
        {
            return NotFound();
        }

        return Ok(orderItem);
    }

    // PUT: api/OrderItems/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutOrderItem(int id, OrderItemCreateDTO orderItemDTO)
    {
        if (id != orderItemDTO.OrderID)
        {
            return BadRequest();
        }

        var orderItem = await _context.OrderItems.FindAsync(id);
        if (orderItem == null)
        {
            return NotFound();
        }

        orderItem.MenuItemID = orderItemDTO.MenuItemID;
        orderItem.Quantity = orderItemDTO.Quantity;

        _context.Entry(orderItem).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
            await UpdateOrderTotalAmount(orderItem.OrderID);
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!OrderItemExists(id))
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

    // POST: api/OrderItems
    [HttpPost]
    public async Task<ActionResult<OrderItemDetailsDTO>> PostOrderItem(OrderItemCreateDTO orderItemDTO)
    {
        // Validate the existence of MenuItem
        var menuItem = await _context.MenuItems.FindAsync(orderItemDTO.MenuItemID);
        if (menuItem == null)
        {
            return BadRequest($"MenuItem with ID {orderItemDTO.MenuItemID} does not exist.");
        }

        var orderItem = new OrderItem
        {
            OrderID = orderItemDTO.OrderID,
            MenuItemID = orderItemDTO.MenuItemID,
            Quantity = orderItemDTO.Quantity
        };

        _context.OrderItems.Add(orderItem);
        await _context.SaveChangesAsync();

        // Update the associated Order's TotalAmount
        await UpdateOrderTotalAmount(orderItem.OrderID);

        // Retrieve the saved entity to include all its properties
        var savedOrderItem = await _context.OrderItems
            .Include(oi => oi.MenuItem)
            .Where(oi => oi.OrderItemID == orderItem.OrderItemID)
            .Select(oi => new OrderItemDetailsDTO
            {
                OrderItemID = oi.OrderItemID,
                MenuItemID = oi.MenuItemID,
                MenuItemName = oi.MenuItem.Name,
                Quantity = oi.Quantity
            })
            .FirstOrDefaultAsync();

        return CreatedAtAction(nameof(GetOrderItem), new { id = savedOrderItem.OrderItemID }, savedOrderItem);
    }

    // DELETE: api/OrderItems/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteOrderItem(int id)
    {
        var orderItem = await _context.OrderItems.FindAsync(id);
        if (orderItem == null)
        {
            return NotFound();
        }

        int orderId = orderItem.OrderID;

        _context.OrderItems.Remove(orderItem);
        await _context.SaveChangesAsync();

        // Update the associated Order's TotalAmount
        await UpdateOrderTotalAmount(orderId);

        return NoContent();
    }

    private bool OrderItemExists(int id)
    {
        return _context.OrderItems.Any(e => e.OrderItemID == id);
    }
    private async Task UpdateOrderTotalAmount(int orderId)
    {
        var order = await _context.Orders
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.MenuItem) // Ensure MenuItem is included
            .FirstOrDefaultAsync(o => o.OrderID == orderId);

        if (order != null)
        {
            // Handle cases where MenuItem or its Price is null
            order.TotalAmount = order.OrderItems
                .Where(oi => oi.MenuItem != null && oi.MenuItem.Price != null)
                .Sum(oi => oi.MenuItem.Price * oi.Quantity);

            _context.Entry(order).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }
    }
}