import css from "./LogInForm.module.css";

const LogInForm = () => {
  const handleSubmit = (formData: FormData) => {};
  return (
    <form action={handleSubmit} className="flex w-full flex-col gap-5">
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

export default LogInForm;
