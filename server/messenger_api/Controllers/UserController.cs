using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using messenger_api.Models.DTOs;
using messenger_api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace messenger_api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ILogger<UserController> _logger;
        private readonly IUserService _userService;

        public UserController(ILogger<UserController> logger, IUserService userService)
        {
            _logger = logger;
            _userService = userService;
        }

        [HttpGet]
        public async Task<IEnumerable<User>> Get()
        {
            var users = await _userService.UsersAsync();

            var result = users.Select(i => new User() { UserName = i.UserName, Id = i.Id });

            return result;
        }

        [HttpPost]
        public async Task<ActionResult<IEnumerable<User>>> Post([FromBody] Login model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(await _userService.LoginAsync(model.UserName));
        }


    }
}
