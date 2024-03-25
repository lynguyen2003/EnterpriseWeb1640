using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DataServices.Service
{
    public interface IManageImage
    {
        Task<string> UploadFile(IFormFile _IFormFile);
        Task<(byte[], string, string)> DownloadFile(string FileName);
    }
}
