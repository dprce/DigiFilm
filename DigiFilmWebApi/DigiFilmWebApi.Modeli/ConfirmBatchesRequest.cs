namespace DigiFilmWebApi.Modeli;

public class ConfirmBatchesRequest
{
    public string CreatedBy { get; set; }         
    public IEnumerable<IEnumerable<int>> Batches { get; set; } 
}
