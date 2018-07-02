using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace SignalRChat.Hubs
{
    public class ChatHub : Hub
    {
        private const string ARGUMENTMESSAGE = "Cannot be empty.";
        public async Task SendMessage(string user, string message)
        {
            if(string.IsNullOrWhiteSpace(user)) { throw new ArgumentException(ARGUMENTMESSAGE, nameof(user)); }
            if(string.IsNullOrWhiteSpace(message)) { throw new ArgumentException(ARGUMENTMESSAGE, nameof(message)); }

            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }
    }
}
