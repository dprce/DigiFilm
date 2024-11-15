using DigiFilmWebApi.DAL;
using DigiFilmWebApi.Modeli;

namespace DigiFilmWebApi.BAL
{
    public class RoleService
    {
        private readonly RoleRepositoryInterface _roleRepositoryInterface;

        public RoleService(RoleRepositoryInterface roleRepositoryInterface)
        {
            _roleRepositoryInterface = roleRepositoryInterface;
        }

        public async Task<List<Role>> GetAllRolesAsync()
        {
            var roles = await _roleRepositoryInterface.GetAllRolesAsync();

            return roles;
        }
    }
}
