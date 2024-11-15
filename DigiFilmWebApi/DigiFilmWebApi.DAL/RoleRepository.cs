using Dapper;
using DigiFilmWebApi.Modeli;
using System.Data;

namespace DigiFilmWebApi.DAL
{
    public class RoleRepository : DALBaseClass, RoleRepositoryInterface
    { 
        public RoleRepository(IConfiguration config) : base(config)
        {

        }

        public async Task<Role> GetRoleByNameAsync(string roleName)
        {
            using IDbConnection conn = CentralConnection;
            var result = await conn.QueryAsync<Role>("SELECT * FROM [Role] WHERE RoleName = @RoleName",
                new { RoleName = roleName });
            return result.FirstOrDefault();
        }

        public async Task<Role> GetRoleByIdAsync(int id)
        {
            using IDbConnection conn = CentralConnection;
            var result = await conn.QueryAsync<Role>("SELECT * FROM [Role] WHERE ID = @Id",
                new { ID = id });
            return result.FirstOrDefault();
        }

        public async Task<List<Role>> GetAllRolesAsync()
        {
            using IDbConnection conn = CentralConnection;
            var result = await conn.QueryAsync<Role>("SELECT * FROM [Role]");
            return result.ToList();
        }
    }
}
