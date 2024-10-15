using System.ComponentModel.DataAnnotations;

namespace WorldCities.Server.Data
{
    public class ApiLoginRequest
    {
        [Required(ErrorMessage = "Email bắt buộc nhập")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Mật khẩu bắt buộc nhập")]
        public string Password { get; set; }
    }
}