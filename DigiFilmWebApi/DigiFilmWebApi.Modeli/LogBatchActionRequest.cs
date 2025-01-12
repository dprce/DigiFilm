namespace DigiFilmWebApi.Modeli;

public class LogBatchActionRequest
{
    public int BatchId { get; set; }            
    public string Action { get; set; }          
    public string PerformedBy { get; set; }    
}
