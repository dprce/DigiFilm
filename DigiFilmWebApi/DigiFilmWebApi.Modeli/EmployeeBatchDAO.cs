namespace DigiFilmWebApi.Modeli;

public class EmployeeBatchDAO
{
    public int EmployeeId { get; set; }
    public string PerformedBy { get; set; }
    public List<BatchDAO> Batches { get; set; } = new List<BatchDAO>();
}