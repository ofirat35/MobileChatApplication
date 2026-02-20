using ChatApp.Core.Application.Features.Commands.Swipes;
using ChatApp.Core.Application.Features.Queries.Users;
using ChatApp.Shared;
using Microsoft.AspNetCore.Mvc;

namespace ChatApp.Controllers
{
    public class ChatsController : BaseController
    {
        [HttpGet]
        public async Task<IActionResult> GetChats([FromQuery] GetMatchesRequestQuery query)
        {
            return Ok(await Mediator.Send(query));
        }
    }
}
