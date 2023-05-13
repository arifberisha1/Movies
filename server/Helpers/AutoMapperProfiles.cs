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
    }
}