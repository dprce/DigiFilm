using DigiFilmWebApi.Modeli;

namespace DigiFilmWebApi.BAL;

public class UserService
{
    private readonly UserRepositoryInterface _userRepositoryInterface;
    private readonly PasswordService _passwordService;

    public UserService(UserRepositoryInterface userRepositoryInterface, PasswordService passwordService)
    {
        _userRepositoryInterface = userRepositoryInterface;
        _passwordService = passwordService;
    }
    
    public async Task<User> AuthenticateUserAsync(string email, string password)
    {
        var user = await _userRepositoryInterface.GetUserByEmailAsync(email);

        if (!_passwordService.VerifyPassword(password, user.PasswordHash))
        {
            return null;  
        }
        return user;  
    }
    
    
}