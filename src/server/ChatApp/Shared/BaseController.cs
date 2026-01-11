using ChatApp.Core.Domain.Models;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace ChatApp.Shared
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class BaseController : ControllerBase
    {
        private IMediator _mediator;
        protected IMediator Mediator => _mediator ??= HttpContext.RequestServices.GetService<IMediator>();

        protected IActionResult HandleResponse<T>(ResponseModel<T> response)
        {
            if (response.IsError)
            {
                return StatusCode((int)response.StatusCode, new
                {
                    Errors = response.ErrorMessages
                });
            }
            return StatusCode((int)response.StatusCode, response.Data);
        }
    }
}
