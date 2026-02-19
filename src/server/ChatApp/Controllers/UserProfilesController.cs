using ChatApp.Core.Application.Features.Queries.Interests;
using ChatApp.Shared;
using Microsoft.AspNetCore.Mvc;

namespace ChatApp.Controllers
{
    public class UserProfilesController : BaseController
    {
        [HttpGet]
        public async Task<IActionResult> GetInterestedUserProfiles([FromQuery] GetInterestedUserProfilesQuery query)
        {
            return Ok(await Mediator.Send(query));
        }

        [HttpGet]
        public async Task<IActionResult> GetUserProfile([FromQuery] GetUserProfileByIdQuery query)
        {
            return HandleResponse(await Mediator.Send(query));
        }
    }
}
