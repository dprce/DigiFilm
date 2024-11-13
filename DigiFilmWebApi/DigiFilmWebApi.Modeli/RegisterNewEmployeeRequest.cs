namespace DigiFilmWebApi.Modeli
{
    public class RegisterNewEmployeeRequest
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string InitialPassword { get; set; }
        public string PhoneNumber { get; set; }
        public string RoleName { get; set; }
    }
}
