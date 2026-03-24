import css from "./SignUpForm.module.css";
import { register } from "#/lib/api/authApi";
import { useUserStore } from "#/lib/store/userStore";
import { useNavigate } from "@tanstack/react-router";
import { deviceType, osName, browserName } from "react-device-detect";
import { useEffect } from "react";
import Cookies from "js-cookie";

const SignUpForm = () => {
  const setUserStore = useUserStore((state) => state.setUserStore);

  const navigation = useNavigate();

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      navigation({ to: "/" });
    }
  }, []);

  const handleSubmit = async (formData: FormData) => {
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const userDeviceType = deviceType;
    const userOsName = osName;
    const userBrowserName = browserName;
    const user = {
      email,
      username,
      password,
      device: `${userDeviceType} ${userOsName} ${userBrowserName}`,
    };
    try {
      const responce = await register(user);
      setUserStore({
        username: responce.user.username,
        email: responce.user.email,
      });
      console.log(responce);
      Cookies.set("accessToken", responce.accesToken, { expires: 1 });
      await navigation({ to: "/" });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <form action={handleSubmit} className="flex w-full flex-col gap-5">
      <input
        className={css.input}
        name="username"
        type="text"
        placeholder="username"
        minLength={5}
        maxLength={10}
      />
      <input
        className={css.input}
        name="email"
        type="email"
        placeholder="email@gmail.com"
        maxLength={20}
      />
      <input
        className={css.input}
        name="password"
        type="password"
        placeholder="password"
        maxLength={20}
      />
      <button className={css.submit_button} type="submit">
        Continue
      </button>
    </form>
  );
};

export default SignUpForm;
