using Microsoft.AspNetCore.Mvc;
using projectWebApi.Interface;
using projectWebApi.Models;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using projectWebApi.Services;

namespace projectWebApi.Services
{
    public class UserService: IUserService
    {
        private static List<User>? listUsers;
        private static string? fileName;
        private readonly IIceCreamService _iceCreamService;

        public UserService(IIceCreamService iceCreamService)
        {
            _iceCreamService = iceCreamService;
            fileName = Path.Combine("Data", "Users.json");
            listUsers = JsonSerializer.Deserialize<List<User>>(File.ReadAllText(fileName),
            new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            })?? new List<User>();

        }
    
    private void SaveToFile()
    {
        File.WriteAllText(fileName, JsonSerializer.Serialize(listUsers));
    }

    public List<User> GetAll() => 
        listUsers ?? new List<User>();

    public User Get(int? id) =>
        listUsers?.FirstOrDefault(u => u.UserId == id)?? new User();

    public void Add(User newUser)
    {
        newUser.UserId = (listUsers != null && listUsers.Any()) ? listUsers.Max(user => user.UserId)+1 : 1; 
        listUsers?.Add(newUser);
        SaveToFile();
    }

    public bool Update(int userId, User newUser)
    {
        var oldUser = Get(userId);
        if(oldUser == null || newUser == null || oldUser.UserId != userId)
            return false;

        var index = listUsers.IndexOf(oldUser);
        if(index == -1)
            return false;
        
        listUsers[index] = newUser;        
        SaveToFile();
        return true;
    }

    public bool Delete(int userId)
    {
        var user = Get(userId);
        if (user == null)
           return false;
        listUsers?.Remove(Get(userId));
        _iceCreamService.DeleteIceCreamOfUser(userId);
        SaveToFile();
        return true;
    }

    public int Count
    {
        get => listUsers?.Count ?? 0;
    } 

    public int? ExsistUser(string password, string userName)
    {
        if(listUsers == null)
            return null;
        return listUsers.FirstOrDefault(u => u.Username == userName && u.Password == password)?.UserId;
           
    }
    }

}