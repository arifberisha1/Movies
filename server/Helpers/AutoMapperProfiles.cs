using AutoMapper;
using server.DTOs;
using server.Entities;



namespace server.Helpers;

public class AutoMapperProfiles : Profile
{
    public AutoMapperProfiles()
    {
        CreateMap<GenreDTO, Genre>().ReverseMap();
        CreateMap<GenreCreationDTO, Genre>();
        
        CreateMap<ActorDTO, Actor>().ReverseMap();
        CreateMap<ActorCreationDTO, Actor>()
            .ForMember(x => x.Picture,
                options => options.Ignore());
    }
}