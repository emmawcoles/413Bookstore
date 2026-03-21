using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mission11.API.Data;
using Mission11.API.Models;

namespace Mission11.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BooksController(BookstoreContext context) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<BooksResponse>> GetBooks(
        [FromQuery] int pageSize = 5,
        [FromQuery] int pageNum = 1,
        [FromQuery] string sortOrder = "asc")
    {
        if (pageSize <= 0)
        {
            pageSize = 5;
        }

        if (pageNum <= 0)
        {
            pageNum = 1;
        }

        IQueryable<Book> query = context.Books.AsNoTracking();

        query = string.Equals(sortOrder, "desc", StringComparison.OrdinalIgnoreCase)
            ? query.OrderByDescending(book => book.Title)
            : query.OrderBy(book => book.Title);

        var totalBooks = await query.CountAsync();

        var books = await query
            .Skip((pageNum - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return Ok(new BooksResponse
        {
            Books = books,
            TotalBooks = totalBooks
        });
    }
}
