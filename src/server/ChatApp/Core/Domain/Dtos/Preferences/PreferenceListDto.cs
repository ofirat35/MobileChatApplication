using ChatApp.Core.Application.Enums;

namespace ChatApp.Core.Domain.Dtos.Preferences
{
    public class PreferenceListDto
    {
        public string Id { get; set; }
        public short? MinAge { get; set; }
        public short? MaxAge { get; set; }
        public string? Country { get; set; }
        public GenderEnum? Gender { get; set; }
    }
}
