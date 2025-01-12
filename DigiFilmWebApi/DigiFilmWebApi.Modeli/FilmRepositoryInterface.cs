using System.Collections.Generic;
using System.Threading.Tasks;
using DigiFilmWebApi.Modeli;

namespace DigiFilmWebApi.DAL
{
    public interface FilmRepositoryInterface
    {
        Task<Film> GetFilmByBarcodeAsync(string barcodeNumber);
        Task<int> InsertScannedFilmAsync(Film film);
    }
}