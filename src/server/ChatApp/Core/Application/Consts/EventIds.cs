namespace ChatApp.Core.Application.Consts
{
    public static class EventIds
    {
        public static readonly EventId MembershipService = new(1010, nameof(MembershipService));
        public static readonly EventId AppUserService = new(1020, nameof(AppUserService));
        public static readonly EventId KeycloakService = new(1030, nameof(KeycloakService));
        public static readonly EventId SwiperService = new(1040, nameof(SwiperService));
        public static readonly EventId UserMembershipService = new(1050, nameof(UserMembershipService));
        public static readonly EventId UserProfileService = new(1060, nameof(UserProfileService));
        public static readonly EventId MatchService = new(1060, nameof(MatchService));
    }
}
