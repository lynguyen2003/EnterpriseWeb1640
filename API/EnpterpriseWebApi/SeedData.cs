using Microsoft.AspNetCore.Identity;

namespace EnpterpriseWebApi
{
    public class SeedData
    {
        public static async Task InitializeAsync(UserManager<IdentityUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            string adminEmail = "admin@example.com";
            string adminPassword = "Admin@123";
            string adminUsername = "admin";

            // Ensure Admin role exists
            if (!await roleManager.RoleExistsAsync("Admin"))
            {
                await roleManager.CreateAsync(new IdentityRole("Admin"));
            }

            // Create Admin user if not exists
            if (userManager.FindByEmailAsync(adminEmail).Result == null)
            {
                var adminUser = new IdentityUser
                {
                    UserName = adminUsername,
                    Email = adminEmail
                };

                var result = await userManager.CreateAsync(adminUser, adminPassword);
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(adminUser, "Admin");
                }
            }

            // Create and assign users to other roles
            string[] roles = { "MarketingManager", "Guest", "Student", "MarketingCoordinator" };
            string[] emails = { "marketingmanager@example.com", "guest@example.com", "student@example.com", "marketingcoordinator@example.com" };
            string[] usernames = { "marketingmanager", "guest", "student", "marketingcoordinator" };
            string commonPassword = "Password@123";

            for (int i = 0; i < roles.Length; i++)
            {
                // Ensure role exists
                if (!await roleManager.RoleExistsAsync(roles[i]))
                {
                    await roleManager.CreateAsync(new IdentityRole(roles[i]));
                }

                // Create user if not exists
                if (userManager.FindByEmailAsync(emails[i]).Result == null)
                {
                    var user = new IdentityUser
                    {
                        UserName = usernames[i],
                        Email = emails[i]
                    };

                    var result = await userManager.CreateAsync(user, commonPassword);
                    if (result.Succeeded)
                    {
                        await userManager.AddToRoleAsync(user, roles[i]);
                    }
                }
            }
        }
    }


}
