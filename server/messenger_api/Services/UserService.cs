using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace messenger_api.Services
{
    public interface IUserService
    {
        Task<string> LoginAsync(string userName);
        Task<IEnumerable<ApplicationUser>> UsersAsync();
    }

    public class UserService : IUserService
    {
        private readonly JwtTokenCreator _jwtCreator;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly ApplicationDbContext _context;

        public UserService(JwtTokenCreator jwtCreator, UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, ApplicationDbContext context)
        {
            _jwtCreator = jwtCreator;
            _userManager = userManager;
            _signInManager = signInManager;
            _context = context;
        }
        private async Task<ApplicationUser> CreateUserAsync(string userName)
        {
            var result = await _userManager.CreateAsync(new ApplicationUser() { Email = "1@1.com", UserName = userName }, userName);

            if (result.Succeeded)
            {
                return await _userManager.FindByNameAsync(userName);
            }

            throw new System.Exception(string.Join(",", result.Errors.Select(i => i.Description)));

        }

        public async Task<string> LoginAsync(string userName)
        {
            var user = await _userManager.FindByNameAsync(userName);

            if (user == null)
            {
                user = await CreateUserAsync(userName);

                if (user == null)
                    throw new System.Exception("User can't be created.");
            }


            return _jwtCreator.Generate(userName, user.Id);
        }

        public async Task<IEnumerable<ApplicationUser>> UsersAsync()
        {
            return await _context.Users.ToListAsync();
        }
    }

}