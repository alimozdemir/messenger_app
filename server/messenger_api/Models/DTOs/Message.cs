using System.ComponentModel.DataAnnotations;

namespace messenger_api.Models.DTOs
{
    public class Message
    {
        [Required]
        public string FromUserId { get; set; }
        [Required]
        public string ToUserId { get; set; }
        [Required]
        public string Text { get; set; }
    }
}