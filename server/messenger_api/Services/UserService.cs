using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace messenger_api.Services
{
    public class UserService
    {
        private readonly JwtTokenCreator _jwtCreator;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;

        public UserService(JwtTokenCreator jwtCreator, UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager)
        {
            _jwtCreator = jwtCreator;
            _userManager = userManager;
            _signInManager = signInManager;
        }
        public async Task<ApplicationUser> CreateUser(string userName)
        {
            var result = await _userManager.CreateAsync(new ApplicationUser() { Email = userName, UserName = userName }, userName);
            
            if (result.Succeeded)
            {
                return await _userManager.FindByEmailAsync(userName);
            }

            return null;
        }

        public async Task<string> Login(string userName)
        {
            var user = await _userManager.FindByEmailAsync(userName);

            if (user == null)
            {
                user = await CreateUser(userName);

                if (user == null)
                    throw new System.Exception("User can't be created.");
            }


            return _jwtCreator.Generate(userName, user.Id);
        }
    }

}