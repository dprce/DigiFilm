using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using System.Data.SqlClient;
using Dapper;
using DigiFilmWebApi.Modeli;

namespace DigiFilmWebApi.DAL
{
    public class FilmRepository : DALBaseClass, FilmRepositoryInterface
    {
        public FilmRepository(IConfiguration config) : base(config)
        {
        }

        public async Task<Film> GetFilmByBarcodeAsync(string barcode)
        {
            using IDbConnection conn = CentralConnection;
            var result = await conn.QueryAsync<Film>("SELECT * FROM [Films] WHERE Barcode = @Barcode",
                new { Barcode = barcode });
            return result.FirstOrDefault();
        }
        
        public async Task<Film> GetScannedFilmByIdAsync(int id)
        {
            using IDbConnection conn = CentralConnection;
            var result = await conn.QueryAsync<Film>("SELECT * FROM [ScannedFilms] WHERE Id = @Id",
                new { Id = id });
            return result.FirstOrDefault();
        }

        public async Task<int> InsertScannedFilmAsync(Film film)
        {
            using IDbConnection conn = CentralConnection;

            var query = @"
        INSERT INTO ScannedFilms 
        (IDEmisije, OriginalniNaslov, RadniNaslov, JezikOriginala, Ton, Emisija, Porijeklo_ZemljaProizvodnje, 
         GodinaProizvodnje, MarkIn, MarkOut, Duration, BrojMedija, BarCode)
        VALUES 
        (@IDEmisije, @OriginalniNaslov, @RadniNaslov, @JezikOriginala, @Ton, @Emisija, @Porijeklo_ZemljaProizvodnje, 
         @GodinaProizvodnje, @MarkIn, @MarkOut, @Duration, @BrojMedija, @BarCode);
        SELECT CAST(SCOPE_IDENTITY() as int);";

            // Include "Status" as a parameter (default value can be "Pending" or any appropriate default)
            var parameters = new
            {
                film.IDEmisije,
                film.OriginalniNaslov,
                film.RadniNaslov,
                film.JezikOriginala,
                film.Ton,
                film.Emisija,
                film.Porijeklo_ZemljaProizvodnje,
                film.GodinaProizvodnje,
                film.MarkIn,
                film.MarkOut,
                film.Duration,
                film.BrojMedija,
                film.BarCode,
            };

            return await conn.ExecuteScalarAsync<int>(query, parameters);
        }

        public async Task<IEnumerable<Film>> GetAllFilmsAsync()
        {
            using IDbConnection conn = CentralConnection;

            var query = "SELECT * FROM [ScannedFilms]";

            var result = await conn.QueryAsync<Film>(query);

            return result;
        }

        public async Task<int> InsertBatchAsync(string createdBy, int userId,
            string status = "In progress")
        {
            using IDbConnection conn = CentralConnection;

            var query = @"
            INSERT INTO Batch (CreatedBy, UserID, Status, CreatedAt)
            VALUES (@CreatedBy, @UserID, @Status, GETDATE());
            SELECT CAST(SCOPE_IDENTITY() as int);";

            var parameters = new
            {
                CreatedBy = createdBy,
                UserID = userId,
                Status = status
            };

            return await conn.ExecuteScalarAsync<int>(query, parameters);
        }

        public async Task InsertBatchFilmsAsync(int batchId, IEnumerable<int> filmIds)
        {
            using IDbConnection conn = CentralConnection;

            var query = @"
            INSERT INTO BatchFilms (BatchID, FilmID)
            VALUES (@BatchID, @FilmID);";

            var tasks = filmIds.Select(filmId =>
                conn.ExecuteAsync(query, new { BatchID = batchId, FilmID = filmId }));

            await Task.WhenAll(tasks);
        }

        public async Task InsertDigitalizationLogAsync(int batchId, string action, string performedBy)
        {
            using IDbConnection conn = CentralConnection;

            var query = @"
            INSERT INTO DigitalizationLogs (BatchID, Action, PerformedBy, Timestamp)
            VALUES (@BatchID, @Action, @PerformedBy, GETDATE());";

            var parameters = new
            {
                BatchID = batchId,
                Action = action,
                PerformedBy = performedBy
            };

            await conn.ExecuteAsync(query, parameters);
        }

        public async Task<IEnumerable<BatchListDAO>> GetAllBatchesAsync()
        {
            using (IDbConnection conn = CentralConnection)
            {
                var procedureName = "GetAllBatches"; // Stored procedure name
                return await conn.QueryAsync<BatchListDAO>(procedureName, commandType: CommandType.StoredProcedure);
            }
        }

        public async Task UpdateBatchStatusAsync(int batchId, string status)
        {
            using IDbConnection conn = CentralConnection;

            var query = "UPDATE Batch SET Status = @Status WHERE BatchID = @BatchID";

            var parameters = new { BatchID = batchId, Status = status };

            await conn.ExecuteAsync(query, parameters);
        }

        public async Task UpdateMoviesStatusInBatchAsync(int batchId, string status)
        {
            using IDbConnection conn = CentralConnection;

            var query = @"
        UPDATE ScannedFilms
        SET Status = @Status
        WHERE Id IN (
            SELECT FilmID
            FROM BatchFilms
            WHERE BatchID = @BatchID
        )";

            var parameters = new { BatchID = batchId, Status = status };

            await conn.ExecuteAsync(query, parameters);
        }
        
        public async Task LogBatchCompletionAsync(int batchId, string performedBy)
        {
            using IDbConnection conn = CentralConnection;

            var query = @"
        INSERT INTO DigitalizationLogs (BatchID, Action, PerformedBy, Timestamp)
        VALUES (@BatchID, @Action, @PerformedBy, GETDATE())";

            var parameters = new
            {
                BatchID = batchId,
                Action = "Finished",
                PerformedBy = performedBy
            };

            await conn.ExecuteAsync(query, parameters);
        }

        public async Task EditScannedFilmAsync(Film film)
        {
            using IDbConnection conn = CentralConnection;

            var query = @"
        UPDATE ScannedFilms
        SET 
            IDEmisije = @IDEmisije,
            OriginalniNaslov = @OriginalniNaslov,
            RadniNaslov = @RadniNaslov,
            JezikOriginala = @JezikOriginala,
            Ton = @Ton,
            Emisija = @Emisija,
            Porijeklo_ZemljaProizvodnje = @Porijeklo_ZemljaProizvodnje,
            GodinaProizvodnje = @GodinaProizvodnje,
            MarkIn = @MarkIn,
            MarkOut = @MarkOut,
            Duration = @Duration,
            BrojMedija = @BrojMedija,
            BarCode = @BarCode
        WHERE Id = @Id";

            await conn.ExecuteAsync(query, film);
        }
        
    }
}