
// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '@/contexts/AuthContext';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useForm } from 'react-hook-form';
// import * as z from 'zod';
// import { Button } from '@/components/ui/button';
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui/form';
// import { Input } from '@/components/ui/input';
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// const loginSchema = z.object({
//   email: z.string().email({ message: 'Please enter a valid email address' }),
//   password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
// });

// type LoginFormValues = z.infer<typeof loginSchema>;

// const Login = () => {
//   const { login, isLoading } = useAuth();
//   const navigate = useNavigate();

//   const form = useForm<LoginFormValues>({
//     resolver: zodResolver(loginSchema),
//     defaultValues: {
//       email: '',
//       password: '',
//     },
//   });

//   const onSubmit = async (data: LoginFormValues) => {
//     await login(data.email, data.password);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
//       <div className="w-full max-w-md">
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold mb-2 text-primary">Fintaza Bank</h1>
//           <p className="text-muted-foreground">Your personal loan management solution</p>
//         </div>
        
//         <Card>
//           <CardHeader>
//             <CardTitle>Welcome back</CardTitle>
//             <CardDescription>Sign in to your account to continue</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <Form {...form}>
//               <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//                 <FormField
//                   control={form.control}
//                   name="email"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Email address</FormLabel>
//                       <FormControl>
//                         <Input placeholder="name@example.com" {...field} autoComplete="email" />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="password"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Password</FormLabel>
//                       <FormControl>
//                         <Input 
//                           type="password" 
//                           placeholder="••••••••" 
//                           {...field} 
//                           autoComplete="current-password" 
//                         />
//                       </FormControl>
//                       <FormDescription>
//                         <Link to="/forgot-password" className="text-sm text-primary hover:underline">
//                           Forgot password?
//                         </Link>
//                       </FormDescription>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <div className="pt-2">
//                   <Button 
//                     type="submit" 
//                     className="w-full" 
//                     disabled={isLoading}
//                   >
//                     {isLoading ? 'Signing in...' : 'Sign in'}
//                   </Button>
//                 </div>
//               </form>
//             </Form>
//           </CardContent>
//           <CardFooter className="flex justify-center border-t p-4">
//             <p className="text-sm text-center text-muted-foreground">
//               Don't have an account?{' '}
//               <Link to="/register" className="text-primary hover:underline">
//                 Create account
//               </Link>
//             </p>
//           </CardFooter>
//         </Card>
        
//         <div className="text-center mt-8 text-sm text-muted-foreground">
//           <p>Demo credentials: demo@example.com / password123</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;




import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    await login(data.email, data.password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-primary">Fintaza Bank</h1>
          <p className="text-muted-foreground">Your personal loan management solution</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Sign in to your account</CardTitle>
            <CardDescription>Enter your credentials to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email address</FormLabel>
                      <FormControl>
                        <Input placeholder="name@example.com" {...field} autoComplete="email" />
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
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          {...field} 
                          autoComplete="password" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="pt-2">
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Sign in'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center border-t p-4">
            <p className="text-sm text-center text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:underline">
                Create one
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
