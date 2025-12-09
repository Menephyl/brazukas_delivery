
import { MapPin } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export function LocationSelector({ textColor = "text-foreground/80" }: { textColor?: string }) {
    return (
        <div className="flex items-center gap-2">
            <Select defaultValue="cde">
                <SelectTrigger className="w-[180px] border-none bg-transparent shadow-none focus:ring-0 text-sm font-medium h-9 px-2 hover:bg-accent/50 rounded-md transition-colors">
                    <div className={`flex items-center gap-2 ${textColor}`}>
                        <MapPin className="h-4 w-4 text-primary" />
                        <SelectValue placeholder="Selecione a região" />
                    </div>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="cde">Ciudad del Este</SelectItem>
                    <SelectItem value="foz">Foz do Iguaçu</SelectItem>
                    <SelectItem value="hernandarias">Hernandarias</SelectItem>
                    <SelectItem value="minga">Minga Guazú</SelectItem>
                    <SelectItem value="presidentefinco">Presidente Franco</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
