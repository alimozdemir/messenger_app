
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace messenger_api
{
    public class ApplicationUser : IdentityUser
    {
        public List<UserMessage> SendMessages { get; set; }
        public List<UserMessage> ReceivedMessages { get; set; }
    }
}