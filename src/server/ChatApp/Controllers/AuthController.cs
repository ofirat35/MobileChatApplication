using ChatApp.Core.Application.Features.Commands.Auth;
using ChatApp.Shared;
using Microsoft.AspNetCore.Mvc;

namespace ChatApp.Controllers
{
    public class AuthController : BaseController
    {
        [HttpPost]
        public async Task<IActionResult> Register([FromBody] RegisterUserRequestCommand command)
        {
            return HandleResponse(await Mediator.Send(command));
        }
    }
}
