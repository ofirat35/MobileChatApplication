using ChatApp.Core.Application.Features.Commands.Memberships;
using ChatApp.Core.Application.Features.Queries.Users;
using ChatApp.Shared;
using Microsoft.AspNetCore.Mvc;

namespace ChatApp.Controllers
{
    public class MembershipsController : BaseController
    {
        [HttpGet]
        public async Task<IActionResult> GetMemberships([FromBody] GetMembershipRequestQuery query)
        {
            return HandleResponse(await Mediator.Send(query));
        }

        [HttpPost]
        public async Task<IActionResult> CreateMembership([FromBody] CreateMembershipRequestCommand command)
        {
            return HandleResponse(await Mediator.Send(command));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveMembership([FromRoute] RemoveMembershipRequestCommand command)
        {
            return HandleResponse(await Mediator.Send(command));
        }

        [HttpPost]
        public async Task<IActionResult> BuyMembership([FromBody] BuyMembershipRequestCommand command)
        {
            return HandleResponse(await Mediator.Send(command));
        }
    }
}
