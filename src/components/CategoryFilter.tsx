/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { categories } from '../data/products';
import { 
  Smartphone, 
  Laptop, 
  Headphones, 
  Camera, 
  Home, 
  Gamepad2, 
  Tv, 
  Briefcase 
} from 'lucide-react';
import { Button } from './ui/button';

const iconMap: Record<string, any> = {
    Smartphone,
    Laptop,
    Headphones,
    Camera,
    Home,
    Gamepad2,
    Tv,
    Briefcase
};

export const CategoryFilter = ({ 
    activeCategory, 
    onSelect 
}: { 
    activeCategory: string, 
    onSelect: (cat: string) => void 
}) => {
    return (
        <section className="py-12 bg-[#F8F9FA]">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold tracking-tight">Sectores más visitados</h2>
                    <Button variant="link" className="text-[#0038A8]">Ver todas</Button>
                </div>
                <div className="flex overflow-x-auto pb-4 gap-4 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-4 lg:grid-cols-8 sm:overflow-visible sm:pb-0">
                    {categories.map((cat) => {
                        const Icon = iconMap[cat.icon];
                        const isActive = activeCategory === cat.name;
                        return (
                            <button
                                key={cat.name}
                                onClick={() => onSelect(cat.name === activeCategory ? 'all' : cat.name)}
                                className={`flex flex-col items-center justify-center p-6 rounded-2xl transition-all duration-300 group shrink-0 w-[140px] sm:w-auto ${
                                    isActive 
                                    ? 'bg-[#0038A8] text-white shadow-lg' 
                                    : 'bg-white hover:bg-[#0038A8]/5 shadow-sm'
                                }`}
                            >
                                <div className={`mb-3 p-3 rounded-full transition-colors ${
                                    isActive ? 'bg-white/20' : 'bg-muted group-hover:bg-[#0038A8]/10'
                                }`}>
                                    <Icon className={`h-6 w-6 ${isActive ? 'text-white' : 'text-[#0038A8]'}`} />
                                </div>
                                <span className={`text-xs font-bold uppercase tracking-wider text-center`}>
                                    {cat.name}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
