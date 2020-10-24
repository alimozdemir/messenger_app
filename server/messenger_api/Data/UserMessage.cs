using System;

namespace messenger_api
{
    public class UserMessage
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public string FromUserId { get; set; }
        public string ToUserId { get; set; }
        public DateTime SendTime { get; set; }

        public ApplicationUser FromUser { get; set; }
        public ApplicationUser ToUser { get; set; }
    }
}