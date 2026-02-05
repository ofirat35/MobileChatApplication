using AutoMapper;
using ChatApp.Core.Application.Features.Commands.Auth;
using ChatApp.Core.Application.Features.Commands.Users;
using ChatApp.Core.Domain.Dtos.AppUsers;
using ChatApp.Core.Domain.Dtos.Auth;
using ChatApp.Core.Domain.Dtos.Preferences;
using ChatApp.Core.Domain.Dtos.UserImages;
using ChatApp.Core.Domain.Entities;

namespace ChatApp.Core.Application.Mappings
{
    public class MappingConfigs : Profile
    {
        public MappingConfigs()
        {
            CreateMap<RegisterUserRequestCommand, KeycloakUserCreateRequestDto>();
            CreateMap<RegisterUserRequestCommand, AppUserCreateDto>();
            CreateMap<AppUserCreateDto, AppUser>();

            CreateMap<UserUpdateRequestCommand, AppUserUpdateDto>();
            CreateMap<UserUpdateRequestCommand, KeyCloakUserUpdateDto>();
            CreateMap<AppUserUpdateDto, AppUser>();

            CreateMap<AppUser, AppUserListDto>();

            CreateMap<UserImage, UserImageListDto>();

            CreateMap<Preference, PreferenceUpdateDto>().ReverseMap();
            CreateMap<Preference, PreferenceListDto>();
        }
    }
}
