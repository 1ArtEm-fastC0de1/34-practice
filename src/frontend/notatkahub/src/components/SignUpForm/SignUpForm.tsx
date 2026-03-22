import css from "./SignUpForm.module.css";
import { register } from "#/lib/api/authApi";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { deviceType, osName, browserName } from "react-device-detect";

const SignUpForm = () => {
  const navigation = useNavigate();
  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: async () => {
      console.log("User was registered!");
      await navigation({ to: "/" });
    },
  });
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

    registerMutation.mutate(user);
  };
  return (
    <form action={handleSubmit} className="flex w-full flex-col gap-5">
      <input
        className={css.input}
        name="username"
        type="text"
        placeholder="username"
      />
      <input
        className={css.input}
        name="email"
        type="email"
        placeholder="email@gmail.com"
      />
      <input
        className={css.input}
        name="password"
        type="password"
        placeholder="password"
      />
      <button className={css.submit_button} type="submit">
        Continue
      </button>
    </form>
  );
};

export default SignUpForm;
