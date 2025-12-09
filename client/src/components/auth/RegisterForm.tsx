
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { Loader2, User, Bike, Store } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";

const formSchema = z.object({
    name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "A senha deve ter no minímo 6 caracteres"),
    role: z.enum(["customer", "merchant", "driver"]),
});

export function RegisterForm({ onSuccess }: { onSuccess?: () => void }) {
    const [, setLocation] = useLocation();
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            role: "customer",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        try {
            const { data, error } = await supabase.auth.signUp({
                email: values.email,
                password: values.password,
                options: {
                    data: {
                        full_name: values.name,
                        role: values.role,
                    },
                },
            });

            if (error) {
                throw error;
            }

            toast.success("Cadastro realizado com sucesso!");

            if (onSuccess) onSuccess();

            // For email confirmation flows, we might not have a session immediately
            // But assuming auto-confirm or session creation:
            if (data.session) {
                const role = values.role;
                if (role === 'merchant') {
                    setLocation('/dashboard/parceiro');
                } else if (role === 'driver') {
                    setLocation('/driver/app');
                }
            } else {
                toast.info("Verifique seu email para confirmar o cadastro.");
            }

        } catch (error: any) {
            toast.error(error.message || "Erro ao realizar cadastro");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Eu quero:</FormLabel>
                            <FormControl>
                                <Tabs
                                    defaultValue="customer"
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    className="w-full"
                                >
                                    <TabsList className="grid w-full grid-cols-3">
                                        <TabsTrigger value="customer" className="flex items-center gap-2">
                                            <User size={16} /> Comprar
                                        </TabsTrigger>
                                        <TabsTrigger value="merchant" className="flex items-center gap-2">
                                            <Store size={16} /> Vender
                                        </TabsTrigger>
                                        <TabsTrigger value="driver" className="flex items-center gap-2">
                                            <Bike size={16} /> Entregar
                                        </TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nome Completo</FormLabel>
                            <FormControl>
                                <Input placeholder="Seu nome" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="seu@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Senha</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="******" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Criando conta...
                        </>
                    ) : (
                        "Cadastrar"
                    )}
                </Button>
            </form>
        </Form>
    );
}
