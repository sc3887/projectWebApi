using Microsoft.AspNetCore.Mvc;
// using projectWebApi.Service;
using projectWebApi.Interface;

namespace projectWebApi.Controllers;

[ApiController]
[Route("[controller]")]
public class IceCreamController : ControllerBase
{
    private IIceCreamService iceCreamService;
    
    public IceCreamController(IIceCreamService iceCreamService)
    {
       this.iceCreamService = iceCreamService;
    }


    [HttpGet(Name = "GetIceCream")]
    public ActionResult<List<IceCream>> GetAll() {
        List<IceCream> list = iceCreamService.GetAll();
        if(list != null)
         return list;
        return NoContent(); 
    }
            

     [HttpGet("{id}")]
    public ActionResult<IceCream> Get(int id)
    {
        var iceCream = iceCreamService.Get(id);
        if(iceCream == null)
            return BadRequest("invalid id");
        return iceCream;
    }

    [HttpPost]
    public ActionResult<IceCream> Add(IceCream newIceCream )
    {
        iceCreamService.Add(newIceCream);
        return CreatedAtAction(nameof(Add), new{id = newIceCream.Id}, newIceCream);
    }

    [HttpPut("{id}")]
    public ActionResult Update(int id, IceCream newIceCream )
    {
        var oldIceCream = iceCreamService.Get(id);
        if(oldIceCream == null)
            return BadRequest("invalid id");
        if(oldIceCream.Id != newIceCream.Id)
            return BadRequest("id mismatch");
        iceCreamService.Update(id, newIceCream);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public ActionResult Delete(int id)
    {
        var oldIceCream = iceCreamService.Get(id);
        if(oldIceCream == null)
            return BadRequest("not existing id");
        iceCreamService.Delete(id);
        return NoContent();
    }



}
