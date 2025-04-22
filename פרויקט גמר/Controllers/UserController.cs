using System;
using System.IdentityModel.Tokens.Jwt;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using projectWebApi.Models;
using projectWebApi.Services;
using projectWebApi.Interface;
using System.IO;

namespace projectWebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IIceCreamService _iceCreamService;

        public UserController(IUserService userService, IIceCreamService iceCreamService) 
        {
            _userService = userService;
            _iceCreamService = iceCreamService;
         }
        
        [HttpGet]
        [Route("[action]")]
        [Authorize(Policy = "Admin")]
        public ActionResult<List<User>> GetAll() =>
             _userService.GetAll();

        [HttpGet]
        [Route("[action]")]
        [Authorize(Policy = "User")]
        public ActionResult<User> Get()
        {
            var _userId = (int)HttpContext.Items["UserId"];
            // if(id != _userId && _userId != 100)
            //    return Forbid();
            var user = _userService.Get(_userId);
            if (user == null)
              return NotFound();
            return Ok(user);
        }

        [HttpPost]
        [Authorize(Policy = "Admin")]
        
        public ActionResult Create(User newUser)
        {
            if (newUser == null)
               return BadRequest("invalid user");
            _userService.Add(newUser);
            return CreatedAtAction(nameof(Create), new {id = newUser.UserId}, newUser);   
        }

        [HttpPut("{id}")]
        [Authorize(Policy = "User")]
        
        public ActionResult Update(int id, User newUser)
        {
            int idToUpdate = id;
            var _userId = (int)HttpContext.Items["UserId"];
            var _type = HttpContext.Items["link"];
            if( _userId != idToUpdate && _type == "false" )
               return Forbid();
            if(newUser == null)
                return BadRequest("invalid content");
            var oldUser = _userService.Get(idToUpdate);   
            var user = new User {
            Username = newUser.Username,
            Password = newUser.Password,
            UserId = newUser.UserId,
            Email = newUser.Email,
            Type = newUser.Type
            };
            var result = _userService.Update(idToUpdate, user);
            if (!result)
                return BadRequest("invalid request");
            
            return NoContent();
        }
        
        [HttpDelete("{id}")]
        [Authorize(Policy = "Admin")]
        
        public ActionResult Delete(int id)
        {
            var user = _userService.Delete(id);
            if(user == null)
               return NotFound();
            return Content(_userService.Count.ToString());
        }
        
        [HttpPost]
        [Route("/login")]
        public ActionResult<myToken> Login([FromBody] User User)
        {  
            if(User == null)
               return Forbid();
            var userId =  _userService.ExsistUser(User.Password, User.Username);
            var user = _userService.Get(userId);
            if(userId  == null)
                return Unauthorized("לא תקין");
            var claims = new List<Claim>
            {
                new Claim("id", userId.ToString()),
                new Claim("name", User.Username),
                new Claim("type", "User")
                
            };
            if(user.Type == "Admin")
               claims.Add(new Claim("type", "Admin"));           
            var token = UserTokenService.GetToken(claims);
            return new OkObjectResult(new {Id = userId, Token = UserTokenService.WriteToken(token), Type = user.Type});
                
        }    
    }
    public class myToken
    {
        public int Id { get; set;}
        public string? Token { get; set;}
        public string? Type { get; set;}

    }

}

