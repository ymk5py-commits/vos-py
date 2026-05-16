/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Mail, Lock, User as UserIcon } from 'lucide-react';

export const LoginModal = ({ 
    isOpen, 
    onClose, 
    onLogin 
}: { 
    isOpen: boolean; 
    onClose: () => void; 
    onLogin: (user: any) => void 
}) => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock login
        const mockUser = {
            id: 'user_123',
            email,
            name: name || email.split('@')[0],
        };
        onLogin(mockUser);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center">
                        {isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión'}
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        {isSignUp 
                            ? 'Únete a Vos PY y disfruta de beneficios exclusivos.' 
                            : 'Bienvenido de nuevo a la mejor tienda de Paraguay.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    {isSignUp && (
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre Completo</Label>
                            <div className="relative">
                                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    id="name" 
                                    className="pl-10" 
                                    placeholder="Juan Pérez" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required={isSignUp}
                                />
                            </div>
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                                id="email" 
                                type="email" 
                                className="pl-10" 
                                placeholder="tu@email.com" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required 
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Contraseña</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                                id="password" 
                                type="password" 
                                className="pl-10" 
                                placeholder="••••••••" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required 
                            />
                        </div>
                    </div>
                    {isSignUp && (
                        <div className="flex items-center space-x-2">
                            <input type="checkbox" id="terms" className="rounded" required />
                            <Label htmlFor="terms" className="text-xs text-muted-foreground">
                                Acepto los términos y condiciones de servicio.
                            </Label>
                        </div>
                    )}
                    <Button type="submit" className="w-full bg-[#0038A8] hover:bg-[#002b80] text-white py-6 text-lg font-bold">
                        {isSignUp ? 'Registrarse' : 'Entrar'}
                    </Button>
                </form>
                <div className="text-center text-sm">
                    <span className="text-muted-foreground">
                        {isSignUp ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
                    </span>
                    <Button 
                        variant="link" 
                        className="text-[#0038A8] font-bold p-1" 
                        onClick={() => setIsSignUp(!isSignUp)}
                    >
                        {isSignUp ? 'Inicia Sesión' : 'Crea una ahora'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
