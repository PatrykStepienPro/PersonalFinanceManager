import { z } from "zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../context/AuthContext";
import { login } from "../api/auth.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

    return <div className="min-h-screen flex items-center justify-center">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm">
            <Card className="w-full">
                <CardHeader className="justify-center">
                    <CardTitle>
                        Logowanie
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Field className="mb-3">
                        <FieldLabel>Email</FieldLabel>
                        <Input {...register("email")} placeholder="Email" />
                        {errors.email && <FieldDescription style={{ color: "red" }}>{errors.email.message}</FieldDescription>}
                    </Field>

                    <Field>
                        <FieldLabel>Hasło</FieldLabel>
                        <Input {...register("password")} type="password" placeholder="Hasło" />
                        {errors.password && <FieldDescription style={{ color: "red" }}>{errors.password.message}</FieldDescription>}
                    </Field>

                </CardContent>
                <CardAction className="flex-col gap-2 w-full p-4">
                    <Button type="submit" className="w-full">
                        Zaloguj
                    </Button>
                </CardAction>
            </Card>
        </form>
    </div >
}

export default LoginPage