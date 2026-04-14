using ChatApp.Core.Application.Features.Commands.Chats;
using ChatApp.Core.Application.Features.Queries.Chats;
using ChatApp.Core.Application.Features.Queries.Users;
using ChatApp.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ChatApp.Presentation.Controllers
{
    [Authorize(policy: "BasicUser")]
    public class ChatsController : BaseController
    {
        [HttpGet]
        public async Task<IActionResult> GetChats([FromQuery] GetChatsRequestQuery query)
        {
            return Ok(await Mediator.Send(query));
        }

        [HttpGet]
        public async Task<IActionResult> GetChatById([FromQuery] GetChatByIdRequestQuery query)
        {
            return Ok(await Mediator.Send(query));
        }

        [HttpGet]
        public async Task<IActionResult> ChatExists([FromQuery] ChatExistsRequestQuery query)
        {
            return HandleResponse(await Mediator.Send(query));
        }

        [HttpPost]
        public async Task<IActionResult> SetMessagesAsRead([FromQuery] SetMessagesAsReadRequestCommand command)
        {
            return HandleResponse(await Mediator.Send(command));
        }

        [HttpDelete]
        public async Task<IActionResult> RemoveChat([FromQuery] RemoveChatRequestCommand command)
        {
            return HandleResponse(await Mediator.Send(command));
        }
    }
}
