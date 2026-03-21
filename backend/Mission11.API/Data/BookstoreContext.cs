using Microsoft.EntityFrameworkCore;
using Mission11.API.Models;

namespace Mission11.API.Data;

public class BookstoreContext(DbContextOptions<BookstoreContext> options) : DbContext(options)
{
    public DbSet<Book> Books => Set<Book>();
}
