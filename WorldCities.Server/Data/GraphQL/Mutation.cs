using HotChocolate.Authorization;
using Microsoft.EntityFrameworkCore;
using WorldCities.Server.Data.Models;

namespace WorldCities.Server.Data.GraphQL
{
    public class Mutation
    {
        [Serial]
        [Authorize(Roles = ["RegisteredUser"])]
        public async Task<City> AddCity([Service] ApplicationDbContext context, CityDTO cityDto)
        {
            var city = new City()
            {
                Name = cityDto.Name,
                Lat = cityDto.Lat,
                Lon = cityDto.Lon,
                CountryId = cityDto.CountryId,
            };
            context.Cities.Add(city);
            await context.SaveChangesAsync();
            return city;
        }

        [Serial]
        [Authorize(Roles = ["RegisteredUser"])]
        public async Task<City> UpdateCity([Service] ApplicationDbContext context, CityDTO cityDto)
        {
            var city = await context.Cities.Where(c => c.Id == cityDto.Id).FirstOrDefaultAsync();
            if (city == null)
            {
                throw new NotSupportedException();
            }

            city.Name = cityDto.Name;
            city.Lat = cityDto.Lat;
            city.Lon = cityDto.Lon;
            city.CountryId = cityDto.CountryId;
            context.Cities.Update(city);

            await context.SaveChangesAsync();
            return city;
        }

        [Serial]
        [Authorize(Roles = ["RegisteredUser"])]
        public async Task<Country> AddCountry([Service] ApplicationDbContext context, CountryDTO countryDTO)
        {
            var country = new Country()
            {
                Name = countryDTO.Name,
                ISO2 = countryDTO.ISO2,
                ISO3 = countryDTO.ISO3
            };

            context.Countries.Add(country);
            await context.SaveChangesAsync();
            return country;
        }

        [Serial]
        [Authorize(Roles = ["RegisteredUser"])]
        public async Task<Country> UpdateCountry([Service] ApplicationDbContext context, CountryDTO countryDTO)
        {
            var country = await context.Countries.Where(x => x.Id == countryDTO.Id).FirstOrDefaultAsync();

            if (country == null)
            {
                throw new NotSupportedException();
            }
            country.Name = countryDTO.Name;
            country.ISO2 = countryDTO.ISO2;
            country.ISO3 = countryDTO.ISO3;

            context.Countries.Update(country);

            await context.SaveChangesAsync();

            return country;
        }

        [Serial]
        [Authorize(Roles = ["Administrator"])]
        public async Task DeleteCountry([Service] ApplicationDbContext context, int id)
        {
            var country = await context.Countries.Where(x => x.Id == id).FirstOrDefaultAsync();

            if (country != null)
            {
                context.Countries.Remove(country);
                await context.SaveChangesAsync();
            }
        }
    }
}