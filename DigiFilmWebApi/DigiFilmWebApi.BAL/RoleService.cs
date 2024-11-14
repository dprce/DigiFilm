using DigiFilmWebApi.Modeli;

namespace DigiFilmWebApi.BAL
{
    public class RoleService
    {
        private readonly RoleRepositoryInterface _roleRepositoryInterface;

        public async Task<List<Role>> GetAllRolesAsync()
        {
            var roles = await _roleRepositoryInterface.GetAllRolesAsync();

            return roles;
        }
    }
}
