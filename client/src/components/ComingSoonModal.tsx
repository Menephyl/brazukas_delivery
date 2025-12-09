
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Construction } from "lucide-react";
import { useState } from "react";

interface ComingSoonModalProps {
    trigger?: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    title?: string;
    description?: string;
}

export function ComingSoonModal({
    trigger,
    open,
    onOpenChange,
    title = "Em Desenvolvimento",
    description = "Esta funcionalidade estar\u00e1 dispon\u00edvel em breve. Estamos trabalhando para melhor atend\u00ea-lo!"
}: ComingSoonModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="mx-auto bg-muted p-4 rounded-full mb-4">
                        <Construction className="h-8 w-8 text-primary" />
                    </div>
                    <DialogTitle className="text-center text-xl">{title}</DialogTitle>
                    <DialogDescription className="text-center pt-2">
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-center pt-4">
                    <Button onClick={() => onOpenChange?.(false)} className="w-full sm:w-auto">
                        Entendi, obrigado!
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
