namespace Mission11.API.Models;

public class BooksResponse
{
    public required List<Book> Books { get; set; }
    public int TotalBooks { get; set; }
}
