using WorldCities.Server.Data.Models;

namespace WorldCities.Server.Data.GraphQL
{
    public class Query
    {
        [Serial]
        [UsePaging]
        [UseFiltering]
        [UseSorting]
        public IQueryable<City> GetCities([Service] ApplicationDbContext context) => context.Cities;

        [Serial]
        [UsePaging]
        [UseFiltering]
        [UseSorting]
        public IQueryable<Country> GetCountries([Service] ApplicationDbContext context) => context.Countries;
    }
}