import { useState } from "react";
import { Card, Input, Button, Typography } from "antd";
import { FiUser, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { usePopup } from "../../context/PopupContext";

const { Title, Text } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const { handleLogin } = useAuth();
  const { showPopup } = usePopup();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setError((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const validateForm = () => {
    const newError = {
      username: "",
      password: "",
    };

    let isValid = true;

    if (!form.username.trim()) {
      newError.username = "Tên đăng nhập không được để trống";
      isValid = false;
    }

    if (!form.password.trim()) {
      newError.password = "Mật khẩu không được để trống";
      isValid = false;
    }

    setError(newError);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);

    const res = await handleLogin({
      username: form.username.trim(),
      password: form.password,
    });

    setLoading(false);
    console.log("res", res);
    if (res?.EC === 0) {
      showPopup(res?.EM || "Đăng nhập thành công");
      navigate("/admin/dashboard");
    } else {
      showPopup(res?.EM || "Đăng nhập thất bại", false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-cyan-100 flex items-center justify-center px-4">
      <Card className="w-full max-w-md rounded-2xl shadow-xl border-0">
        <div className="text-center mb-8">
          <Title level={2} className="!mb-2">
            Đăng nhập
          </Title>
          <Text type="secondary">
            Đăng nhập vào hệ thống quản lý bảo trì thiết bị
          </Text>
        </div>

        <div className="space-y-5">
          <div>
            <label className="font-semibold mb-2 block">Tên đăng nhập</label>
            <Input
              size="large"
              prefix={<FiUser className="text-gray-400 mr-2" />}
              placeholder="Nhập tên đăng nhập"
              value={form.username}
              onChange={(e) => handleChange("username", e.target.value)}
            />
            {error.username && (
              <p className="text-red-500 text-sm mt-1">{error.username}</p>
            )}
          </div>

          <div>
            <label className="font-semibold mb-2 block">Mật khẩu</label>
            <Input
              size="large"
              prefix={<FiLock className="text-gray-400 mr-2" />}
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              suffix={
                <button
                  type="button"
                  className="border-none bg-transparent cursor-pointer p-0"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              }
              onPressEnter={handleSubmit}
            />
            {error.password && (
              <p className="text-red-500 text-sm mt-1">{error.password}</p>
            )}
          </div>

          <Button
            type="primary"
            size="large"
            className="w-full"
            loading={loading}
            onClick={handleSubmit}
          >
            Đăng nhập
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
