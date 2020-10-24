using System.Threading.Tasks;
using messenger_api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

[Authorize]
public class ChatHub : Hub
{
    private readonly IMessageService _messageService;

    public ChatHub(IMessageService messageService)
    {
        _messageService = messageService;    
    }

    public async Task SendMessage(string fromUserId, string toUserId, string text)
    {
        var message = await _messageService.AddAsync(fromUserId, toUserId, text);
        await Clients.User(toUserId).SendAsync("ReceiveMessage", fromUserId, text, message);
    }
}