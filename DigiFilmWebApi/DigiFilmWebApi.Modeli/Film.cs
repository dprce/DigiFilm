namespace DigiFilmWebApi.Modeli;

public class Film
{
    public int FilmID { get; set; }
    public string IDEmisije { get; set; }
    public string OriginalniNaslov { get; set; }
    public string RadniNaslov { get; set; }
    public string JezikOriginala { get; set; }
    public string Ton { get; set; }
    public string Emisija { get; set; }
    public string Porijeklo_ZemljaProizvodnje { get; set; }
    public int GodinaProizvodnje { get; set; }
    public TimeSpan MarkIn { get; set; }
    public TimeSpan MarkOut { get; set; }
    public TimeSpan Duration { get; set; }
    public int BrojMedija { get; set; }
    public string BarCode { get; set; }
}
