using System.Collections.Generic;
using System.Threading.Tasks;
using DigiFilmWebApi.Modeli;

namespace DigiFilmWebApi.DAL
{
    public interface FilmRepositoryInterface
    {
        Task<Film> GetFilmByBarcodeAsync(string barcodeNumber);
        Task<int> InsertScannedFilmAsync(Film film);
        Task<IEnumerable<Film>> GetAllFilmsAsync();
        Task<int> InsertBatchAsync(string createdBy, int userId, string status = "U tijeku digitalizacije ");
        Task InsertBatchFilmsAsync(int batchId, IEnumerable<int> filmIds);
        Task InsertDigitalizationLogAsync(int batchId, string action, string performedBy);
        Task<IEnumerable<BatchListDAO>> GetAllBatchesAsync();
        Task UpdateBatchStatusAsync(int batchId, string status);
        Task UpdateMoviesStatusInBatchAsync(int batchId, string status);
        Task LogBatchCompletionAsync(int batchId, string performedBy);
    }
}