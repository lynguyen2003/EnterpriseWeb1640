using Microsoft.AspNetCore.Identity;

namespace EnpterpriseWebApi
{
    public class SeedData
    {
        public static async Task InitializeAsync(UserManager<IdentityUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            // Seed roles
            string[] roles = { "Admin", "MarketingManager", "MarketingCoordinator", "Student", "Guest", "AppUser" };

            foreach (var roleName in roles)
            {
                if (!await roleManager.RoleExistsAsync(roleName))
                {
                    var role = new IdentityRole { Name = roleName };
                    await roleManager.CreateAsync(role);
                }
            }

            // Seed default Admin account
            string adminEmail = "admin@example.com";
            string adminPassword = "Admin@123";

            if (userManager.FindByEmailAsync(adminEmail).Result == null)
            {
                var user = new IdentityUser
                {
                    UserName = adminEmail,
                    Email = adminEmail
                };

                var result = await userManager.CreateAsync(user, adminPassword);

                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(user, "Admin");
                }
            }
        }
    }
}
