using System.Data;
using System.Data.SqlClient;

namespace DigiFilmWebApi.DAL;

public abstract class DALBaseClass
{
    private readonly IConfiguration _config;

    public DALBaseClass(IConfiguration config)
    {
        _config = config;
    }
    
    public IDbConnection CentralConnection =>
        new SqlConnection(_config.GetConnectionString("DigiFilmDatabase"));
}