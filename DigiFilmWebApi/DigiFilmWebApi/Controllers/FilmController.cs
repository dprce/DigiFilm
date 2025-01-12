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
            if (!User.Identity.IsAuthenticated)
            {
                // Return JSON response for unauthorized access
                return Unauthorized(new
                {
                    Error = "User is not authenticated."
                });
            }
            
            if (film == null)
            {
                return BadRequest(new { message = "Invalid film data provided." });
            }

            var filmId = await _filmService.SubmitScannedFilmAsync(film);

            return Ok(new { filmId = filmId, message = "Film successfully submitted to ScannedFilms." });
        }
        
        [HttpGet("get-all-films")]
        public async Task<IActionResult> GetAllFilms()
        {
            if (!User.Identity.IsAuthenticated)
            {
                // Return JSON response for unauthorized access
                return Unauthorized(new
                {
                    Error = "User is not authenticated."
                });
            }

            var films = await _filmService.GetAllFilmsAsync();

            return Ok(new { films = films, message = "All films successfully retrieved." });
        }
        
        [HttpPost("confirm-batches")]
        public async Task<IActionResult> ConfirmBatches([FromBody] ConfirmBatchesRequest request)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Unauthorized(new { Error = "User is not authenticated." });
            }

            if (request == null || request.Batches == null || !request.Batches.Any())
            {
                return BadRequest(new { message = "Invalid batch data provided." });
            }

            try
            {
                var userId = 1;

                await _filmService.CreateBatchesAsync(request.CreatedBy, userId, request.Batches);

                return Ok(new { message = "Batches created successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = "An error occurred while confirming batches.", Details = ex.Message });
            }
        }
        
        [HttpPost("log-batch-action")]
        public async Task<IActionResult> LogBatchAction([FromBody] LogBatchActionRequest request)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Unauthorized(new { Error = "User is not authenticated." });
            }

            if (request == null || string.IsNullOrEmpty(request.Action) || string.IsNullOrEmpty(request.PerformedBy))
            {
                return BadRequest(new { message = "Invalid log action data provided." });
            }

            try
            {
                await _filmService.LogBatchActionAsync(request.BatchId, request.Action, request.PerformedBy);

                return Ok(new { message = "Batch action logged successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = "An error occurred while logging batch action.", Details = ex.Message });
            }
        }
    }
}