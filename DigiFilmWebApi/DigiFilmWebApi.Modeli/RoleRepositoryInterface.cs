namespace DigiFilmWebApi.Modeli
{
    public interface RoleRepositoryInterface
    {
        Task<Role> GetRoleByNameAsync(string roleName);
        Task<List<Role>> GetAllRolesAsync();
        Task<Role> GetRoleByIdAsync(int id);
    }
}
