import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/auth';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, Lock, LogIn } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const { token, user } = await login({ email, password });
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('user', JSON.stringify(user));
      setMessage({ type: 'success', text: 'Login successful!' });
      if (user.role === 'superadmin') {
        navigate('/superadmin/dashboard');
      } else if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Invalid email or password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-8">
      <div className="flex justify-center mb-6">
        <img
          src="data:image/png;base64,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"
          alt="USIU Logo"
          className="h-32 w-auto"
        />
      </div>
      <Card className="w-full max-w-2xl shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="space-y-6 pb-8">

          <div className="text-center space-y-2">
            <CardTitle className="text-3xl font-bold text-usiu-black">Welcome back</CardTitle>
            <p className="text-gray-600 text-lg">Sign in to your account</p>
          </div>
        </CardHeader>

        <CardContent className="px-8 pb-8">
          {message && (
            <Alert variant={message.type === 'error' ? 'destructive' : 'default'} className="mb-6">
              <AlertDescription className="text-base">{message.text}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="email" className="text-base font-medium text-usiu-black">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-12 text-base border-2 border-gray-200 focus:border-usiu-blue transition-colors"
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="password" className="text-base font-medium text-usiu-black">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 h-12 text-base border-2 border-gray-200 focus:border-usiu-blue transition-colors"
                  required
                />
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold bg-usiu-blue hover:bg-usiu-blue/90 text-white transition-all duration-200 transform hover:scale-[1.02]"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5 mr-3" />
                    Sign in
                  </>
                )}
              </Button>
            </div>
          </form>


        </CardContent>
      </Card>
    </div>
  );
};

export default Login;