using System.ComponentModel.DataAnnotations;

namespace messenger_api.Models.DTOs
{
    public class Login
    {
        [Required]
        public string UserName { get; set; }
    }
}