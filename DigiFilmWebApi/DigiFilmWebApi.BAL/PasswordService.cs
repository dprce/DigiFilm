using System.Security.Cryptography;
using System.Text;

namespace DigiFilmWebApi.BAL;

public class PasswordService
{
    public string HashPassword(string password)
    {
        using (var hmac = new HMACSHA512())
        {
            var key = hmac.Key;
            var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            return $"{Convert.ToBase64String(key)}:{Convert.ToBase64String(hash)}";
        }
    }

    public bool VerifyPassword(string password, string storedHash)
    {
        var parts = storedHash.Split(':');
        if (parts.Length != 2)
            return false;

        var key = Convert.FromBase64String(parts[0]);
        var hash = Convert.FromBase64String(parts[1]);

        using (var hmac = new HMACSHA512(key))
        {
            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            return computedHash.SequenceEqual(hash);
        }
    }
}