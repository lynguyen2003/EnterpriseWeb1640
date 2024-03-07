import React, { useState } from "react";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      // Gửi thông tin đăng nhập đến máy chủ và xử lý phản hồi ở đây
      const response = await fetch("URL_XU_LY_DANG_NHAP", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        // Đăng nhập thành công, điều hướng hoặc hiển thị thông báo
        console.log("Đăng nhập thành công!");
      } else {
        // Xử lý lỗi khi đăng nhập thất bại
        const data = await response.json();
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.error("Lỗi khi xử lý đăng nhập:", error);
    }
  };

  return (
    <section class="vh-100 gradient-custom">
      <div class="container py-5 h-100">
        <div class="row d-flex justify-content-center align-items-center h-100">
          <div class="col-12 col-md-8 col-lg-6 col-xl-5">
            <div class="card text-black">
              <div class="card-body p-5">
                <div class="my-5 mt-1">
                  <h1 className="imgLogin mt-1 mb-5">
                    <img
                      src="https://cdn.haitrieu.com/wp-content/uploads/2022/12/Logo-Truong-Dai-hoc-Greenwich-Viet-Nam.png"
                      height="80"
                    />
                  </h1>
                  <h2 class="fw-bold mb-3 text-center fs-1">Login</h2>
                  <p class="mb-5 text-center">
                    Please enter your login and password!
                  </p>

                  <div class="form-outline form-white mb-5 txt_field">
                    
                    <input
                      type="text"
                      id="userName"
                      class=""
                      required
                    />
                    <label class="form-label" for="userName">
                      Username
                    </label>
                  </div>

                  <div class="form-outline form-white mb-5 txt_field">
                    <input
                      type="password"
                      id="password"
                      class=""
                      required
                    />
                    <label class="form-label" for="password">
                      Password
                    </label>
                  </div>

                  <p class="small mb-5 pb-lg-2 text-end pass ">
                    <a class="pass fs-5" href="#!">
                      Forgot password?
                    </a>
                  </p>
                  <div class="d-flex justify-content-center">
                    <button
                      class="btn btn-outline-light btn-lg px-5"
                      type="submit"
                    >
                      Login
                    </button>
                  </div>
                </div>

                <div>
                  <p class="mb-0">
                    Don't have an account?{" "}
                    <a href="#!" class="fw-bold">
                      Sign Up
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
