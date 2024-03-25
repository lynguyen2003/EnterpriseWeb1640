namespace DataServices.Helper
{
    public static class Common
    {
        public static string GetFileNameFromUploadsDirectory(string fileName)
        {
            var uploadsDirectory = GetStaticContentDirectory();
            var filePath = Path.Combine(uploadsDirectory, fileName);

            if (File.Exists(filePath))
            {
                return fileName;
            }
            else
            {
                // File not found in the Uploads directory
                return null;
            }
        }

        public static string GetCurrentDirectory()
        {
            var result = Directory.GetCurrentDirectory();
            return result;
        }
        public static string GetStaticContentDirectory()
        {
            var result = Path.Combine(Directory.GetCurrentDirectory(), "Uploads\\StaticContent\\");
            if (!Directory.Exists(result))
            {
                Directory.CreateDirectory(result);
            }
            return result;
        }
        public static string GetFilePath(string FileName)
        {
            var _GetStaticContentDirectory = GetStaticContentDirectory();
            var result = Path.Combine(_GetStaticContentDirectory, FileName);
            return result;
        }
    }
}
