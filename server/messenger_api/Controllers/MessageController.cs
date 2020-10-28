using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using messenger_api.Models.DTOs;
using messenger_api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace messenger_api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class MessageController : ControllerBase
    {
        private readonly ILogger<MessageController> _logger;
        private readonly IMessageService _messageService;

        public MessageController(ILogger<MessageController> logger, IMessageService messageService)
        {
            _logger = logger;
            _messageService = messageService;
        }

        [HttpGet]
        public async Task<IEnumerable<UserMessage>> Get([FromQuery]string fromId, [FromQuery]string toId)
        {
            var result = await _messageService.GetAllMessagesAsync(fromId, toId);
            // wrap it into a DTO object
            return result;
        }

        [HttpPost]
        public async Task<ActionResult<IEnumerable<User>>> Post([FromBody] Message model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return Ok(await _messageService.AddAsync(model.FromUserId, model.ToUserId, model.Text));
        }


    }
}
