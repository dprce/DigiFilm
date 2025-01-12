using System.Collections.Generic;
using System.Threading.Tasks;

using DigiFilmWebApi.Modeli;
using DigiFilmWebApi.DAL;

namespace DigiFilmWebApi.BAL
{
    public class FilmService
    {
        private readonly FilmRepositoryInterface _filmRepository;

        public FilmService(FilmRepositoryInterface filmRepository)
        {
            _filmRepository = filmRepository;
        }

        public async Task<Film> GetFilmByBarcodeNumberAsync(string barcode)
        {
            return await _filmRepository.GetFilmByBarcodeAsync(barcode);
        }
        
        public async Task<int> SubmitScannedFilmAsync(Film film)
        {
            return await _filmRepository.InsertScannedFilmAsync(film);
        }
    }
}