using DigiFilmWebApi.BAL;
using DigiFilmWebApi.Modeli;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DigiFilmWebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FilmController : ControllerBase
    {
        private readonly FilmService _filmService;
        private readonly IConfiguration _configuration;
        //private readonly UserRepositoryInterface _userRepositoryInterface;
        //private readonly PasswordService _passwordService;
        public FilmController(FilmService filmService, IConfiguration configuration)
        {
            _filmService = filmService;
            _configuration = configuration;
        }

        [HttpGet("get-film/{barcode}")]
        public async Task<IActionResult> GetFilmByBarcodeNumber(string barcode)
        {
            if (!User.Identity.IsAuthenticated)
            {
                // Return JSON response for unauthorized access
                return Unauthorized(new
                {
                    Error = "User is not authenticated."
                });
            }

            var film = await _filmService.GetFilmByBarcodeNumberAsync(barcode);

            return Ok(new {film = film, message = "Film uspješno dohvaćen." });
        }
        
        [HttpPost("submit-scanned-film")]
        public async Task<IActionResult> SubmitScannedFilm([FromBody] Film film)
        {
            if (film == null)
            {
                return BadRequest(new { message = "Invalid film data provided." });
            }

            var filmId = await _filmService.SubmitScannedFilmAsync(film);

            return Ok(new { filmId = filmId, message = "Film successfully submitted to ScannedFilms." });
        }
    }
}