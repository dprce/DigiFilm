namespace DigiFilmWebApi.Modeli;

public class BatchDAO
{
    public int BatchId { get; set; }
    public DateTime BatchCreatedAt { get; set; }
    public string BatchStatus { get; set; }
    public List<FilmDAO> Films { get; set; } = new List<FilmDAO>();
    public List<ActionDAO> Actions { get; set; } = new List<ActionDAO>();
}