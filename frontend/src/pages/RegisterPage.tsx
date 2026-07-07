import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod"
import { useNavigate } from "react-router-dom";
import { registerApi } from "../api/auth.api";
import { Input } from "@/components/ui/input";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Card, CardAction, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

    return <div className="min-h-screen flex items-center justify-center">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm">
            <Card>
                <CardHeader className="justify-center text-base">
                    Rejestracja
                </CardHeader>

                <CardContent>
                    <Field className="mb-3">
                        <FieldLabel>
                            Email
                        </FieldLabel>
                        <Input {...register("email")} placeholder="Email" />
                        {errors.email && <FieldDescription style={{ color: "red" }}>{errors.email.message}</FieldDescription>}
                    </Field>

                    <Field>
                        <FieldLabel>
                            Hasło
                        </FieldLabel>
                        <Input {...register("password")} type="password" placeholder="Hasło" />
                        {errors.password && <FieldDescription style={{ color: "red" }}>{errors.password.message}</FieldDescription>}
                    </Field>
                </CardContent>

                <CardAction className="flex-col gap-2 w-full p-4">
                    <Button type="submit" className="w-full">
                        Zarejestruj
                    </Button>
                </CardAction>
            </Card>

        </form>
    </div>
}

export default RegisterPage;