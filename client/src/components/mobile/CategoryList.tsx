
import { Utensils, ShoppingCart, Pill, PartyPopper, Dog } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const CATEGORIES = [
    { id: 1, name: "Restaurantes", icon: Utensils, color: "bg-orange-100 text-orange-600" },
    { id: 3, name: "Farmácias", icon: Pill, color: "bg-red-100 text-red-600" },
    { id: 4, name: "Bebidas", icon: PartyPopper, color: "bg-yellow-100 text-yellow-600" },
    { id: 2, name: "Supermercados", icon: ShoppingCart, color: "bg-blue-100 text-blue-600" },
];

export function CategoryList() {
    return (
        <div className="w-full py-4 md:hidden">
            <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex w-max space-x-4 px-4 pb-2">
                    {CATEGORIES.map((category) => (
                        <div
                            key={category.id}
                            className="flex flex-col items-center gap-2 cursor-pointer transition-transform active:scale-95"
                        >
                            <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${category.color} shadow-sm`}>
                                <category.icon className="h-8 w-8" />
                            </div>
                            <span className="text-xs font-medium text-foreground">{category.name}</span>
                        </div>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" className="hidden" />
            </ScrollArea>
        </div>
    );
}
