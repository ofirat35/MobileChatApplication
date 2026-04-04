using ChatApp.Core.Application.Features.Commands.Swipes;
using ChatApp.Core.Application.Features.Queries.Swipes;
using ChatApp.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ChatApp.Presentation.Controllers
{
    [Authorize("BasicUser")]
    public class SwipesController : BaseController
    {
        [HttpGet]
        public async Task<IActionResult> GetUsersToSwipe([FromQuery] GetUsersToSwipeRequestQuery query)
        {
            return HandleResponse(await Mediator.Send(query));
        }

        [HttpPost]
        public async Task<IActionResult> Like(LikeRequestCommand command)
        {
            return HandleResponse(await Mediator.Send(command));
        }

        [HttpPost]
        public async Task<IActionResult> Pass(PassRequestCommand command)
        {
            return HandleResponse(await Mediator.Send(command));
        }

        [HttpPost]
        public async Task<IActionResult> ViewProfile(ViewProfileRequestCommand command)
        {
            return HandleResponse(await Mediator.Send(command));
        }
    }
}
