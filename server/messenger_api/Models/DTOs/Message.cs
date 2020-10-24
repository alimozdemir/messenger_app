namespace messenger_api.Models.DTOs
{
    public class Message
    {
        public string FromUserId { get; set; }
        public string ToUserId { get; set; }
        public string Text { get; set; }
    }
}