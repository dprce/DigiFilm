using System.Data;
using Dapper;
using DigiFilmWebApi.Modeli;

namespace DigiFilmWebApi.DAL;

public class UserRepository : DALBaseClass, UserRepositoryInterface
{
    public UserRepository(IConfiguration config) : base(config)
    {
    }

    public async Task<User> GetUserByEmailAsync(string email)
    {
        using IDbConnection conn = CentralConnection;
        var result = await conn.QueryAsync<User>("SELECT * FROM [User] WHERE Email = @Email",
            new { Email = email });
        return result.FirstOrDefault();
    }

    public async Task<User> GetUserByIdAsync(int id)
    {
        using IDbConnection conn = CentralConnection;
        var result =
            await conn.QueryAsync<User>("SELECT * FROM [User] WHERE Id = @Id", new { Id = id });
        return result.FirstOrDefault();
    }
    
    public async Task<List<Role>> GetAllRolesAsync()
    {
        using IDbConnection conn = CentralConnection;
        var result = await conn.QueryAsync<Role>("SELECT * FROM [Role]");
        return result.ToList();
    }

    public async Task<int> CreateUserAsync(User user)
    {
        using IDbConnection conn = CentralConnection;
        var query =
            @"INSERT INTO [User] (RoleId, TenantId, FirstName, LastName, PhoneNumber, Email, PasswordHash, CreatedDate, ModifiedDate)
        VALUES (@RoleId, @TenantId, @FirstName, @LastName, @PhoneNumber, @Email, @PasswordHash, @CreatedDate, @ModifiedDate);
        SELECT CAST(SCOPE_IDENTITY() as int)";

        var userId = await conn.QuerySingleAsync<int>(query, new
        {
            user.RoleId,
            user.TenantId,
            user.FirstName,
            user.LastName,
            user.PhoneNumber,
            user.Email,
            user.PasswordHash,
            user.CreatedDate,
            user.ModifiedDate
        });
        return userId;
    }

    public async Task SaveRefreshTokenAsync(int userId, string refreshToken)
    {
        using IDbConnection conn = CentralConnection;
        var query = @"
                UPDATE [User] 
                SET RefreshToken = @RefreshToken, 
                    RefreshTokenExpiryTime = @RefreshTokenExpiryTime 
                WHERE Id = @UserId";

        await conn.ExecuteAsync(query, new
        {
            RefreshToken = refreshToken,
            RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7),
            UserId = userId
        });
    }

    public async Task<(string RefreshToken, DateTime ExpiryTime)> GetRefreshTokenWithExpiryAsync(int userId)
    {
        using IDbConnection conn = CentralConnection;
        var query = @"SELECT RefreshToken, RefreshTokenExpiryTime FROM [User] WHERE Id = @UserId";
        return await conn.QuerySingleOrDefaultAsync<(string, DateTime)>(query, new { UserId = userId });
    }

    public async Task UpdateUserAsync(User user)
    {
        using (IDbConnection conn = CentralConnection)
        {
            var query = @"
            UPDATE User
            SET 
                RoleId = @RoleId,
                TenantId = @TenantId,
                FirstName = @FirstName,
                LastName = @LastName,
                PhoneNumber = @PhoneNumber,
                Email = @Email,
                PasswordHash = @PasswordHash,
                CreatedDate = @CreatedDate,
                ModifiedDate = @ModifiedDate
            WHERE Id = @Id";

            await conn.ExecuteAsync(query, new
            {
                user.RoleId,
                user.TenantId,
                user.FirstName,
                user.LastName,
                user.PhoneNumber,
                user.Email,
                user.PasswordHash,
                user.CreatedDate,
                ModifiedDate = DateTime.UtcNow,
                user.Id
            });
        }
    }
}