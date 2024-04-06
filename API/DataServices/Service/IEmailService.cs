using Models.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataServices.Service
{
    public interface IEmailService
    {
        void SendEmail(Message message);
    }
}
