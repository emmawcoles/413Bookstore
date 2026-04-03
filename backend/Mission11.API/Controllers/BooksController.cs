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
        [FromQuery] string sortOrder = "asc",
        [FromQuery] string? category = null)
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

        if (!string.IsNullOrWhiteSpace(category) &&
            !string.Equals(category, "All", StringComparison.OrdinalIgnoreCase))
        {
            query = query.Where(book => book.Category == category);
        }

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

    [HttpPost]
    public async Task<ActionResult<Book>> AddBook([FromBody] Book book)
    {
        context.Books.Add(book);
        await context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetBooks), new { id = book.BookID }, book);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateBook(int id, [FromBody] Book book)
    {
        if (id != book.BookID)
        {
            return BadRequest();
        }

        context.Entry(book).State = EntityState.Modified;

        try
        {
            await context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await context.Books.AnyAsync(b => b.BookID == id))
            {
                return NotFound();
            }

            throw;
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBook(int id)
    {
        var book = await context.Books.FindAsync(id);

        if (book == null)
        {
            return NotFound();
        }

        context.Books.Remove(book);
        await context.SaveChangesAsync();

        return NoContent();
    }
}
