namespace DigiFilmWebApi.Modeli;

public interface UserRepositoryInterface
{
    Task<User> GetUserByEmailAsync(string email);
    Task<User> GetUserByIdAsync(int id);
    Task<int> CreateUserAsync(User user);
    Task SaveRefreshTokenAsync(int userId, string refreshToken);  
    Task<(string RefreshToken, DateTime ExpiryTime)> GetRefreshTokenWithExpiryAsync(int userId);
    Task UpdateUserAsync(User user); 
}