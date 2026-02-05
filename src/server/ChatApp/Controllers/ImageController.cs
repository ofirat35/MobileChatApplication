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

        [HttpPost]
        public async Task<IActionResult> DownloadPicture(DownloadPictureRequestCommand request)
        {
            var response = await Mediator.Send(request);
            if (response.IsError)
            {
                return StatusCode(response.StatusCode, new
                {
                    Errors = response.ErrorMessages
                });
            }

            return File(
                response.Data.Stream,
                response.Data.ContentType,
                response.Data.FileName
            );
        }

        [HttpGet]
        public async Task<IActionResult> GetUserPictures()
        {
            return HandleResponse(await Mediator.Send(new GetUserPicturesRequestCommand()));
        }
    }
}
