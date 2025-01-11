using Microsoft.AspNetCore.Mvc;
using projectWebApi.Interface;


namespace projectWebApi.Service
{
    public class IceCreamService : IIceCreamService
    {
        
        private static List<IceCream> ListIceCream;

        public IceCreamService()
        {
            ListIceCream = new List<IceCream>
            {
                new IceCream {Id = 1, Name = "Frozen", Price = 20, Extras = false, Milky = true},
                new IceCream {Id = 2, Name = "American iceCream", Price = 35, Extras = true, Milky = true},
                new IceCream {Id = 3, Name = "Ice coffee", Price = 15, Extras = true, Milky = true}
            };
        }

        public List<IceCream> GetAll() => ListIceCream;

        public IceCream Get(int id) => ListIceCream.FirstOrDefault(ice => ice.Id == id);
    
        public void Add(IceCream newIceCream )
        {
            int maxId = ListIceCream.Max(ice => ice.Id);
            newIceCream.Id = maxId+1;
            ListIceCream.Add(newIceCream);
        }
    
        public void Update(int id, IceCream newIceCream )
        {
            var oldIceCream = Get(id);
            oldIceCream.Name = newIceCream.Name;
            oldIceCream.Price = newIceCream.Price;
            oldIceCream.Extras = newIceCream.Extras;
            oldIceCream.Milky = newIceCream.Milky;
            
        }
        
        public void Delete(int id)
        {
            ListIceCream.Remove(Get(id));
        }

    }

    public static class IceCreamServiceHelper
    {
        public static void AddIceCreamService(this IServiceCollection Services)
        {
            Services.AddSingleton<IIceCreamService, IceCreamService>();

        }
    }
}
