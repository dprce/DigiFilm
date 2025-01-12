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
        
        public async Task<IEnumerable<Film>> GetAllFilmsAsync()
        {
            return await _filmRepository.GetAllFilmsAsync();
        }
        
        public async Task CreateBatchesAsync(string createdBy, int userId, IEnumerable<IEnumerable<int>> batches)
        {
            foreach (var filmIds in batches)
            {
                // Step 1: Create a new batch
                var batchId = await _filmRepository.InsertBatchAsync(createdBy, userId);

                // Step 2: Associate films with the batch (sequentially)
                foreach (var filmId in filmIds)
                {
                    await _filmRepository.InsertBatchFilmsAsync(batchId, new List<int> { filmId });
                }

                // Step 3: Log the batch creation
                await _filmRepository.InsertDigitalizationLogAsync(batchId, "Created", createdBy);
            }
        }
        
        public async Task LogBatchActionAsync(int batchId, string action, string performedBy)
        {
            await _filmRepository.InsertDigitalizationLogAsync(batchId, action, performedBy);
        }
    }
}