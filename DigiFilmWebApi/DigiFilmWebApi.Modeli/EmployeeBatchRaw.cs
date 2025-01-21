namespace DigiFilmWebApi.Modeli;

public class EmployeeBatchRaw
{
    public int EmployeeId { get; set; }
    public string PerformedBy { get; set; }
    public int BatchID { get; set; }
    public DateTime BatchCreatedAt { get; set; }
    public string BatchStatus { get; set; }
    public string Action { get; set; }
    public DateTime ActionTimestamp { get; set; }
    public int FilmId { get; set; } // Nullable since some batches may not have films
    public string FilmTitle { get; set; }
}