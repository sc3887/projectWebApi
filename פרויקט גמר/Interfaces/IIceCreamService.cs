using projectWebApi.Models;
using System.Collections.Generic;
using System.Linq;

namespace projectWebApi.Interface
{
public interface IIceCreamService
{
    List<IceCream> GetAll();

    List<IceCream> GetAll(int userId);

    IceCream Get(int id);

    void Add(IceCream newIceCream, int userId);

    void Update(int id, IceCream newIceCream);

    // void Update(IceCream newIceCream);

    void Delete(int userId);

    public void DeleteIceCreamOfUser(int userId);

    int count { get; }

}
}