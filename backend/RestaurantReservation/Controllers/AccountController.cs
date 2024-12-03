using RestaurantReservation.DTOs.Account;
using RestaurantReservation.Interfaces;
using RestaurantReservation.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace RestaurantReservation.Controllers
{
    [Route("api/account")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly ITokenService _tokenService;
        private readonly SignInManager<AppUser> _signInManager;
        public AccountController(UserManager<AppUser> userManager, ITokenService tokenService, SignInManager<AppUser> signInManager)
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _signInManager = signInManager;
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDTO registerDTO)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var appUser = new AppUser
                {
                    UserName = registerDTO.Username,
                    Email = registerDTO.Email,
                    FirstName = registerDTO.FirstName,
                    LastName = registerDTO.LastName
                };

                var createdUser = await _userManager.CreateAsync(appUser, registerDTO.Password);

                if (createdUser.Succeeded)
                {
                    var roleResult = await _userManager.AddToRoleAsync(appUser, "User");

                    if (roleResult.Succeeded)
                        return Ok(
                            new NewUserDTO
                            {
                                FirstName = appUser.FirstName,
                                LastName = appUser.LastName,
                                Username = appUser.UserName,
                                Email = appUser.Email,
                                Token = _tokenService.CreateToken(appUser)
                            }
                        );
                    else
                        return StatusCode(500, roleResult.Errors);
                }
                else
                    return StatusCode(500, createdUser.Errors);
            }
            catch (Exception e)
            {
                return StatusCode(500, e);
            }
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDTO loginDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _userManager.Users.FirstOrDefaultAsync(x => x.UserName == loginDTO.Username.ToLower());

            if (user == null)
                return Unauthorized("Invalid username!");

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDTO.Password, false);

            if (!result.Succeeded)
                return Unauthorized("Username not found and/or password incorrect!");

            return Ok(
                new NewUserDTO
                {
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Username = user.UserName,
                    Email = user.Email,
                    Token = _tokenService.CreateToken(user)
                }
            );
        }
        [HttpGet("getUserIdByUsername/{username}")]
        public async Task<IActionResult> GetUserIdByUsername(string username)
        {
            try
            {
                if (string.IsNullOrEmpty(username))
                    return BadRequest("Username cannot be empty");

                // Find user by username (ignoring case)
                var user = await _userManager.Users.FirstOrDefaultAsync(x => x.UserName.ToLower() == username.ToLower());

                if (user == null)
                    return NotFound("User not found");

                // Return userId
                return Ok(new { userId = user.Id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        [HttpGet("getUserDetails/{userId}")]
        public async Task<IActionResult> GetUserDetails(string userId)
        {
            try
            {
                if (string.IsNullOrEmpty(userId))
                    return BadRequest("User ID cannot be empty");

                // Find user by userId
                var user = await _userManager.Users.FirstOrDefaultAsync(x => x.Id == userId);

                if (user == null)
                    return NotFound("User not found");

                // Return user details
                return Ok(new NewUserDTO
                {
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Username = user.UserName,
                    Email = user.Email,
                    Token = _tokenService.CreateToken(user) // Include token if required
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpDelete("deleteUser/{userId}")]
        public async Task<IActionResult> DeleteUser(string userId)
        {
            try
            {
                if (string.IsNullOrEmpty(userId))
                    return BadRequest("User ID cannot be empty");

                // Find user by userId
                var user = await _userManager.Users.FirstOrDefaultAsync(x => x.Id == userId);

                if (user == null)
                    return NotFound("User not found");

                // Delete the user
                var result = await _userManager.DeleteAsync(user);

                if (!result.Succeeded)
                    return StatusCode(500, result.Errors);

                return Ok($"User with ID {userId} deleted successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        [HttpPost("changePasswordByUserId")]
        public async Task<IActionResult> ChangePasswordByUserId([FromBody] ChangePasswordDTO changePasswordDTO)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                // Validate that the new password and confirm password match
                if (changePasswordDTO.NewPassword != changePasswordDTO.ConfirmPassword)
                {
                    return BadRequest("New password and confirm password do not match.");
                }

                // Find the user by their userId
                var user = await _userManager.FindByIdAsync(changePasswordDTO.UserID);

                if (user == null)
                    return NotFound("User not found!");

                // Check if the old password is correct
                var result = await _signInManager.CheckPasswordSignInAsync(user, changePasswordDTO.OldPassword, false);

                if (!result.Succeeded)
                    return Unauthorized("Old password is incorrect!");

                // Update the password
                var passwordChangeResult = await _userManager.ChangePasswordAsync(user, changePasswordDTO.OldPassword, changePasswordDTO.NewPassword);

                if (!passwordChangeResult.Succeeded)
                    return StatusCode(500, passwordChangeResult.Errors);

                return Ok("Password changed successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}