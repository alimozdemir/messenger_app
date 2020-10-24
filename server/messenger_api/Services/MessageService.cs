using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace messenger_api.Services
{
    public interface IMessageService
    {
        Task<int> AddAsync(string fromUserId, string toUserId, string text);
        Task<IEnumerable<UserMessage>> GetAllMessages(string fromUserId, string toUserId);
    }

    public class MessageService : IMessageService
    {
        private readonly ApplicationDbContext _context;

        public MessageService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<int> AddAsync(string fromUserId, string toUserId, string text)
        {
            var message = new UserMessage();
            message.ToUserId = toUserId;
            message.FromUserId = fromUserId;
            message.Text = text;
            message.SendTime = DateTime.UtcNow;

            _context.UserMessages.Add(message);

            await _context.SaveChangesAsync();

            return message.Id;
        }

        public async Task<IEnumerable<UserMessage>> GetAllMessages(string fromUserId, string toUserId)
        {
            return await _context.UserMessages.Where(i => i.FromUserId == fromUserId && i.ToUserId == toUserId).OrderBy(i => i.SendTime).ToListAsync();
        }
    }

}