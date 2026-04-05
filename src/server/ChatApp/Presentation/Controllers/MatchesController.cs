using ChatApp.Core.Application.Features.Commands.Chats;
using ChatApp.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ChatApp.Presentation.Controllers
{
    [Authorize("BasicUser")]
    public class MatchesController : BaseController
    {
        [HttpDelete]
        public async Task<IActionResult> RemoveMatch([FromQuery] RemoveChatRequestCommand query)
        {
            return Ok(await Mediator.Send(query));
        }
    }
}
