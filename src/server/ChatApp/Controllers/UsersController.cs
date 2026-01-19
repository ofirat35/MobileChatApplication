using ChatApp.Core.Application.Features.Commands.Users;
using ChatApp.Core.Application.Features.Queries.Users;
using ChatApp.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ChatApp.Controllers
{
    public class UsersController : BaseController
    {
        [HttpGet("{id}")]
        [Authorize("BasicUser")]
        public async Task<IActionResult> GetById([FromRoute] GetUserByIdQuery query)
        {
            return HandleResponse(await Mediator.Send(query));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete([FromRoute] DeleteUserCommand query)
        {
            return HandleResponse(await Mediator.Send(query));
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] UpdateUserCommand query)
        {
            return HandleResponse(await Mediator.Send(query));
        }
    }
}
