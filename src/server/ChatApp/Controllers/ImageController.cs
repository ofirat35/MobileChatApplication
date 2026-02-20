using ChatApp.Core.Application.Features.Commands.UserImages;
using ChatApp.Core.Application.Features.Queries.UserImages;
using ChatApp.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ChatApp.Controllers
{
    [Authorize]
    public class ImageController : BaseController
    {
        [HttpPost]
        public async Task<IActionResult> UploadPicture([FromForm] UploadPictureRequestCommand request)
        {
            return HandleResponse(await Mediator.Send(request));
        }

        [HttpGet]
        public async Task<IActionResult> GetUserPictures([FromQuery] GetUserPicturesRequestQuery request)
        {
            return HandleResponse(await Mediator.Send(request));
        }

        [HttpGet]
        public async Task<IActionResult> GetUserProfilePicture([FromQuery] GetUserProfilePictureRequestQuery request)
        {
            return HandleResponse(await Mediator.Send(request));
        }

        [HttpPost]
        public async Task<IActionResult> SetProfilePicture([FromQuery] SetProfilePictureRequestCommand command)
        {
            return HandleResponse(await Mediator.Send(command));
        }
    }
}
