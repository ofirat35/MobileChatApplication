using ChatApp.Core.Application.Features.Commands.Swipes;
using ChatApp.Shared;
using Microsoft.AspNetCore.Mvc;

namespace ChatApp.Controllers
{
    public class SwipesController : BaseController
    {
        [HttpGet]
        public async Task<IActionResult> SetUserIdsToSwipe()
        {
            return HandleResponse(await Mediator.Send(new SetUserIdsToSwipeRequestCommand()));
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
    }
}
