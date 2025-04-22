using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt; 
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using projectWebApi.Interface;
using projectWebApi.Services;
using projectWebApi.Controllers;
using projectWebApi.Models;
using System.IO;

namespace projectWebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class IceCreamController : ControllerBase
    {
        private readonly IIceCreamService iceCreamService;
        private readonly IUserService userService;

        
        public IceCreamController(IIceCreamService iceCreamService, IUserService userService)
        {
            this.iceCreamService = iceCreamService;
            this.userService = userService;
        }

        [HttpGet(Name = "GetIceCream")]
        public ActionResult<List<IceCream>> GetAll()
        {    
            List<IceCream> list;
            var _userId = (int)HttpContext.Items["UserId"];
            var user = userService.Get(_userId);
            if(user == null)
                return Unauthorized();
            if(user.Type == "Admin")  
                list = iceCreamService.GetAll();
            else       
                list = iceCreamService.GetAll(_userId);
            if (list != null)
                return list;
            return NoContent();
        }

        [HttpGet("{id}")]
        public ActionResult<IceCream> Get(int id)
        {
            var _userId = (int)HttpContext.Items["UserId"]; 
            var iceCream = iceCreamService.Get(id);
            if (iceCream == null)
                return BadRequest("invalid id");
            if (iceCream.UserId != _userId && _userId != 100)    
                return Forbid(); 
            return Ok(iceCream); 
        }

        [HttpPost]
        public ActionResult<IceCream> Add(IceCream newIceCream)
        {
            var userId = (int)HttpContext.Items["UserId"];
            if (newIceCream == null)
            return BadRequest("invalid IceCream");
            iceCreamService.Add(newIceCream, userId);
            return CreatedAtAction(nameof(Add), new { id = newIceCream.Id }, newIceCream);
        }

        [HttpPut("{id}")]
        // public ActionResult Update(int id, IceCream newIceCream)
        public ActionResult Update(IceCream newIceCream)
        {  
            var _userId = (int)HttpContext.Items["UserId"]; 
            var user = userService.Get(_userId);
            var oldIceCream = iceCreamService.Get(newIceCream.Id);
            if (oldIceCream == null)
                return BadRequest("invalid id");
            if (oldIceCream.Id != newIceCream.Id)
                return BadRequest("id mismatch");
            if(oldIceCream.UserId !=  _userId && user.Type != "Admin")
                return Forbid();    
            iceCreamService.Update(_userId, newIceCream);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            var _userId = (int)HttpContext.Items["UserId"];
            var user = userService.Get(_userId);
            var iceCream = iceCreamService.Get(id);
            if (iceCream == null)
                return BadRequest("not existing id");
            if(iceCream.UserId != _userId && user.Type != "Admin")
                return Forbid();
            iceCreamService.Delete(id);
            return NoContent();
        }

    }
}