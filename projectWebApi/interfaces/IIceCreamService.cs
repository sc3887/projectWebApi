

namespace projectWebApi.Interface
{
    public interface IIceCreamService 
    {
         List<IceCream> GetAll();

    
         IceCream Get(int id);

    
         void Add(IceCream newIceCream );

    
         void Update(int id, IceCream newIceCream );

        
         void Delete(int id);
    }
}
