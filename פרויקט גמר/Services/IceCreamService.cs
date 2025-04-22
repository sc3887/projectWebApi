using Microsoft.AspNetCore.Mvc;
using projectWebApi.Interface;
using projectWebApi.Models;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using projectWebApi.Services;

namespace projectWebApi.Services
{
    public class IceCreamService : IIceCreamService
    {
        private static List<IceCream>? ListIceCream;

        private static string? fileName = "IceCreams.json";

        public IceCreamService()
        {
            fileName = Path.Combine("Data", "IceCreams.json");

            ListIceCream = JsonSerializer.Deserialize<List<IceCream>>(File.ReadAllText(fileName),
            new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            })?? new List<IceCream>();
        }

        private void SaveToFile()
        {
            File.WriteAllText(fileName, JsonSerializer.Serialize(ListIceCream));
        }
        
        //פונקציה למנהל שיקבל את כל הגלידות
        public List<IceCream> GetAll() =>
            ListIceCream ?? new List<IceCream>();

        public List<IceCream> GetAll(int userId) =>
            ListIceCream?.FindAll(ice => ice.UserId == userId)?? new List<IceCream>();
        

        public IceCream Get(int id) =>
            ListIceCream?.FirstOrDefault(ice => ice.Id == id)??new IceCream();

        public void Add(IceCream newIceCream, int userId)
        {
            newIceCream.UserId = userId;
            newIceCream.Id = (ListIceCream != null && ListIceCream.Any()) ? ListIceCream.Max(ice => ice.Id)+1 : 1;
            ListIceCream?.Add(newIceCream);
            SaveToFile();
        }

        public void Update(int id, IceCream newIceCream)
        // public void Update(IceCream newIceCream)
        {
            var oldIceCream = Get(newIceCream.Id);
            oldIceCream.Name = newIceCream.Name;
            oldIceCream.Price = newIceCream.Price;
            oldIceCream.Extras = newIceCream.Extras;
            oldIceCream.Milky = newIceCream.Milky;
            SaveToFile();
        }

        public void Delete(int id)
        {
            ListIceCream.Remove(Get(id));
            SaveToFile();
        }

        public void DeleteIceCreamOfUser(int userId)
        {
            ListIceCream = ListIceCream?.FindAll(ice => ice.UserId != userId);
            SaveToFile();  
        }
        
        public int count 
        {
            get =>  ListIceCream.Count();
        }

    }

    

    public static class IceCreamServiceHelper
    {
        public static void AddIceCreamServise(this IServiceCollection Services){
            Services.AddSingleton<IIceCreamService, IceCreamService>();
        }
    }

}