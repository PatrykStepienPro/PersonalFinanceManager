import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod"
import { useNavigate } from "react-router-dom";
import { registerApi } from "../api/auth.api";

const registerSchema = z.object({
    email: z.email("Nieprawidłowy adress email"),
    password: z.string().min(6, "Minimum 5 znaków")
});

type RegisterFormData = z.infer<typeof registerSchema>;

function RegisterPage() {
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>(
        {
            resolver: zodResolver(registerSchema)
        }
    );

    const onSubmit = async (data: RegisterFormData) => {
        await registerApi(data)
        navigate('/login')
    };

    return <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("email")} placeholder="Email" />
        {errors.email && <p>{errors.email.message}</p>}

        <input {...register("password")} type="password" placeholder="Hasło" />
        {errors.password && <p>{errors.password.message}</p>}

        <button type="submit">Zarejestruj</button>
    </form>
}

export default RegisterPage;