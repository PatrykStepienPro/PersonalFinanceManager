import { z } from "zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../context/AuthContext";
import { login } from "../api/auth.api";

const loginSchma = z.object({
    email: z.email("Nieprawidłowy adress email"),
    password: z.string().min(6, "Minimum 5 znaków")
});
type LoginFormData = z.infer<typeof loginSchma>;

function LoginPage() {
    const navigate = useNavigate();
    const auth = useAuth();

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchma)
    });

  const onSubmit = async (data: LoginFormData) => {
      const { accessToken } = await login(data)
      auth.login(accessToken)
      navigate('/')
  }

    return <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("email")} placeholder="Email" />
        {errors.email && <p>{errors.email.message}</p>}

        <input {...register("password")} type="password" placeholder="Hasło" />
        {errors.password && <p>{errors.password.message}</p>}

        <button type="submit">Zaloguj</button>
    </form>
}

export default LoginPage