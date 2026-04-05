using ChatApp.Core.Application.Features.Commands.Users;
using ChatApp.Core.Application.Features.Queries.Users;
using ChatApp.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ChatApp.Presentation.Controllers
{
    [Authorize]
    public class UsersController : BaseController
    {
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById([FromRoute] GetUserByIdRequestQuery query)
        {
            return HandleResponse(await Mediator.Send(query));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete([FromRoute] UserDeleteRequestCommand command)
        {
            return HandleResponse(await Mediator.Send(command));
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] UserUpdateRequestCommand command)
        {
            return HandleResponse(await Mediator.Send(command));
        }

        [HttpGet]
        public async Task<IActionResult> GetPreferences()
        {
            return HandleResponse(await Mediator.Send(new GetPreferenceRequestQuery()));
        }

        [HttpPut]
        public async Task<IActionResult> SetPreferences([FromBody] PreferenceUpdateRequestCommand command)
        {
            return HandleResponse(await Mediator.Send(command));
        }

        [HttpGet]
        public async Task<IActionResult> GetInterestedUserProfiles([FromQuery] GetInterestedUserProfilesRequestQuery query)
        {
            return Ok(await Mediator.Send(query));
        }
    }
}
