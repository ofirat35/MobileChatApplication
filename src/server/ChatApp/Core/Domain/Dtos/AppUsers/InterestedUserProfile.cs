using ChatApp.Core.Application.Enums;

namespace ChatApp.Core.Domain.Dtos.AppUsers
{
    public class InterestedUserProfile
    {
        public UserProfile User { get; set; }
        public SwipeStatus? Status { get; set; }
    }
}
