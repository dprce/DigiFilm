using DigiFilmWebApi.Modeli;

namespace DigiFilmWebApi.BAL;

public class UserService
{
    private readonly UserRepositoryInterface _userRepositoryInterface;
    private readonly RoleRepositoryInterface _roleRepositoryInterface;
    private readonly PasswordService _passwordService;

    public UserService(UserRepositoryInterface userRepositoryInterface, PasswordService passwordService, RoleRepositoryInterface roleRepositoryInterface)
    {
        _userRepositoryInterface = userRepositoryInterface;
        _passwordService = passwordService;
        _roleRepositoryInterface = roleRepositoryInterface;
    }  
    
    public async Task<User> AuthenticateUserAsync(string email, string password)
    {
        var user = await _userRepositoryInterface.GetUserByEmailAsync(email);

        if(user == null)
        {
            return null;
        }

        if (!_passwordService.VerifyPassword(password, user.PasswordHash))
        {
            return null;  
        }
        return user;  
    }

    public async Task RegisterNewEmployeeAsync(RegisterNewEmployeeRequest request, int tenantId)
    {
        
        var role = await _roleRepositoryInterface.GetRoleByIdAsync(request.RoleId); 
        if (role == null)
        {
            throw new ArgumentException("Role ne postoji u bazi.");
        }

        var user = await _userRepositoryInterface.GetUserByEmailAsync(request.Email);

        if (user != null)
        {
            throw new ArgumentException("Korisnik s ovim mailom postoji u bazi.");
        }

        var hashedPassword = _passwordService.HashPassword(request.InitialPassword);

        var newUser = new User
        {
            RoleId = request.RoleId,
            TenantId = tenantId,
            FirstName = request.FirstName,
            LastName = request.LastName,
            PhoneNumber = request.PhoneNumber,
            Email = request.Email,
            PasswordHash = hashedPassword,
            CreatedDate = DateTime.UtcNow,
            ModifiedDate = null
        };

        await _userRepositoryInterface.CreateUserAsync(newUser);
    }

    public async Task<List<Role>> GetAllRolesAsync()
    {
        var roles = await _userRepositoryInterface.GetAllRolesAsync();

        return roles;
    }
}