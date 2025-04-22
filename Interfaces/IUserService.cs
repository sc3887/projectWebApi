using projectWebApi.Models;
using System.Collections.Generic;
using System.Linq;

namespace projectWebApi.Interface
{
    public interface IUserService
    {
        List<User> GetAll();

        User Get(int? id);

        void Add(User newUser);
        
        bool Update( int id ,User newUser);

        bool Delete(int id);

        int Count{ get; }
        
        int? ExsistUser(string passWord, string userName );
    }
}