using ChatApp.Core.Application.Features.Commands.Users;
using ChatApp.Core.Application.Features.Queries.Users;
using ChatApp.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ChatApp.Controllers
{

    public class UsersController(IServiceProvider serviceProvider) : BaseController
    {
        [HttpGet("{id}")]
        //[Authorize("BasicUser")]
        public async Task<IActionResult> GetById([FromRoute] GetUserByIdQuery query)
        {
            return HandleResponse(await Mediator.Send(query));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete([FromRoute] UserDeleteRequestCommand query)
        {
            return HandleResponse(await Mediator.Send(query));
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] UserUpdateRequestCommand query)
        {
            return HandleResponse(await Mediator.Send(query));
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetPreferences()
        {
            return HandleResponse(await Mediator.Send(new GetPreferenceRequestQuery()));
        }

        [HttpPut]
        [Authorize]
        public async Task<IActionResult> SetPreferences([FromBody] PreferenceUpdateRequestCommand command)
        {
            return HandleResponse(await Mediator.Send(command));
        }
    }
}
