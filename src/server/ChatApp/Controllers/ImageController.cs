using ChatApp.Core.Application.Features.Commands.UserImages;
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
        public async Task<IActionResult> GetUserPictures([FromQuery] GetUserPicturesRequestCommand request)
        {
            return HandleResponse(await Mediator.Send(request));
        }
    }
}
