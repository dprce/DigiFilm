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

        
    }
}
