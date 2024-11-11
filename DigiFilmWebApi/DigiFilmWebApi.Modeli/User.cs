namespace DigiFilmWebApi.Modeli;

public class User
{
    public int Id { get; set; }
    public int RoleId { get; set; }
    public int TenantId { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string PhoneNumber { get; set; }
    public string Email { get; set; }
    public string PasswordHash { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime? ModifiedDate { get; set; }
}