using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WorldCities.Server.Data;
using Moq;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using WorldCities.Server.Data.Models;
using WorldCities.Server.Controllers;

namespace WorldCities.Server.Tests
{
    public class SeedController_Tests
    {
        [Fact]
        public async Task CreateDefaultUsers()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>().UseInMemoryDatabase(databaseName: "WorldCities").Options;
            var mockEnv = Mock.Of<IWebHostEnvironment>();
            var mockConfiguration = new Mock<IConfiguration>();
            mockConfiguration.SetupGet(x => x[It.Is<string>(s => s == "DefaultPasswords:RegisteredUser")]).Returns("M0ckP$$word");
            mockConfiguration.SetupGet(x => x[It.Is<string>(s => s == "DefaultPasswords:Administrator")]).Returns("M0ckP$$word");

            using var context = new ApplicationDbContext(options);

            var roleManager = IdentityHelper.GetRoleManager(new RoleStore<IdentityRole>(context));
            var userManager = IdentityHelper.GetUserManager(new UserStore<ApplicationUser>(context));

            var controller = new SeedController(context, roleManager, userManager, mockEnv, mockConfiguration.Object);

            ApplicationUser user_Admin = null!;
            ApplicationUser user_User = null!;
            ApplicationUser user_NotExisting = null!;

            await controller.CreateDefaultUsers();

            user_Admin = await userManager.FindByEmailAsync("admin@email.com");
            user_User = await userManager.FindByEmailAsync("user@email.com");
            user_NotExisting = await userManager.FindByEmailAsync("notexisting@email.com");

            Assert.NotNull(user_Admin);
            Assert.NotNull(user_User);
            Assert.Null(user_NotExisting);
        }
    }
}