using ChatApp.Core.Application.Features.Commands.Memberships;
using ChatApp.Core.Application.Features.Queries.Users;
using ChatApp.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ChatApp.Presentation.Controllers
{
    [Authorize]
    public class MembershipsController : BaseController
    {
        [HttpGet]
        [Authorize("BasicUser")]
        public async Task<IActionResult> GetMemberships([FromBody] GetMembershipRequestQuery query)
        {
            return HandleResponse(await Mediator.Send(query));
        }

        [HttpPost]
        [Authorize("Admin")]
        public async Task<IActionResult> CreateMembership([FromBody] CreateMembershipRequestCommand command)
        {
            return HandleResponse(await Mediator.Send(command));
        }

        [HttpDelete("{id}")]
        [Authorize("Admin")]
        public async Task<IActionResult> RemoveMembership([FromRoute] RemoveMembershipRequestCommand command)
        {
            return HandleResponse(await Mediator.Send(command));
        }

        [HttpPost]
        [Authorize("BasicUser")]
        public async Task<IActionResult> BuyMembership([FromBody] BuyMembershipRequestCommand command)
        {
            return HandleResponse(await Mediator.Send(command));
        }
    }
}
