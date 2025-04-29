
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const loanSchema = z.object({
  loanType: z.string().min(1, { message: 'Please select a loan type' }),
  amount: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0 && num <= 100000;
  }, { message: 'Amount must be between $1 and $100,000' }),
  term: z.string(),
  purpose: z.string().min(3, { message: 'Please provide the purpose of the loan' }).max(500),
  employment: z.string().min(1, { message: 'Please select your employment status' }),
  income: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, { message: 'Please enter a valid income amount' }),
  payFrequency: z.string().min(1, { message: 'Please select your pay frequency' }),
  nextPayDate: z.date({
    required_error: "Please select your next pay date",
  }),
});

type LoanFormValues = z.infer<typeof loanSchema>;

const Apply = () => {
  const navigate = useNavigate();
  const [sliderValue, setSliderValue] = useState([5000]);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const form = useForm<LoanFormValues>({
    resolver: zodResolver(loanSchema),
    defaultValues: {
      loanType: '',
      amount: '5000',
      term: '36',
      purpose: '',
      employment: '',
      income: '',
      payFrequency: '',
    },
  });

  const handleSliderChange = (value: number[]) => {
    setSliderValue(value);
    form.setValue('amount', value[0].toString(), { shouldValidate: true });
  };

  const calculateMonthlyPayment = (amount: number, term: number, interestRate = 0.089) => {
    const r = interestRate / 12;
    const n = term;
    return (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  };

  const onSubmit = (data: LoanFormValues) => {
    // In a real app, this would submit to an API
    console.log('Loan application submitted:', data);
    
    // Show loader for 1 second to simulate API call
    setFormSubmitted(true);
    
    setTimeout(() => {
      toast({
        title: "Application submitted!",
        description: "We'll review your loan application and get back to you shortly."
      });
      navigate('/dashboard');
    }, 1500);
  };

  const amount = parseFloat(form.watch('amount') || '0');
  const term = parseInt(form.watch('term') || '36');
  const monthlyPayment = calculateMonthlyPayment(amount, term);
  
  if (formSubmitted) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle>Processing Your Application</CardTitle>
              <CardDescription>Please wait while we process your loan application...</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-6">
              <div className="h-8 w-8 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto animate-fade-in">
        <h1 className="text-3xl font-bold mb-2">Apply for a Loan</h1>
        <p className="text-muted-foreground mb-6">Fill out the form below to apply for a new loan</p>

        <Card>
          <CardHeader>
            <CardTitle>Loan Application</CardTitle>
            <CardDescription>Provide the details for your loan request</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Loan Details Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Loan Details</h3>

                  <FormField
                    control={form.control}
                    name="loanType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Loan Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a loan type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="personal">Personal Loan</SelectItem>
                            <SelectItem value="home">Home Loan</SelectItem>
                            <SelectItem value="auto">Auto Loan</SelectItem>
                            <SelectItem value="education">Education Loan</SelectItem>
                            <SelectItem value="business">Business Loan</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Loan Amount: ${parseInt(field.value || '0').toLocaleString()}</FormLabel>
                        <FormControl>
                          <div className="space-y-4">
                            <Slider 
                              value={sliderValue} 
                              onValueChange={handleSliderChange} 
                              min={1000}
                              max={100000}
                              step={500}
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>$1,000</span>
                              <span>$100,000</span>
                            </div>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value;
                                field.onChange(value);
                                setSliderValue([parseInt(value) || 0]);
                              }}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="term"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Loan Term (months)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a loan term" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="12">12 months (1 year)</SelectItem>
                            <SelectItem value="24">24 months (2 years)</SelectItem>
                            <SelectItem value="36">36 months (3 years)</SelectItem>
                            <SelectItem value="48">48 months (4 years)</SelectItem>
                            <SelectItem value="60">60 months (5 years)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="purpose"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Loan Purpose</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Briefly describe why you need this loan..." 
                            className="resize-none" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Explain how you plan to use the funds.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Separator />
                
                {/* Personal Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Financial Information</h3>
                  
                  <FormField
                    control={form.control}
                    name="employment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employment Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your employment status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="full_time">Full-time Employed</SelectItem>
                            <SelectItem value="part_time">Part-time Employed</SelectItem>
                            <SelectItem value="self_employed">Self-Employed</SelectItem>
                            <SelectItem value="unemployed">Unemployed</SelectItem>
                            <SelectItem value="retired">Retired</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="income"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Monthly Income</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                            <Input 
                              placeholder="0.00" 
                              className="pl-8" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="payFrequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Frequency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select how often you get paid" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="biweekly">Bi-weekly</SelectItem>
                            <SelectItem value="semimonthly">Semi-monthly (Twice a month)</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          How frequently you receive your paycheck
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nextPayDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Next Pay Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Select your next pay date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                              initialFocus
                              className={cn("p-3 pointer-events-auto")}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          When you expect to receive your next paycheck
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Separator />
                
                {/* Summary Section */}
                <div className="p-4 bg-muted rounded-md space-y-2">
                  <h3 className="font-medium mb-2">Loan Summary</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Amount:</div>
                    <div className="font-medium text-right">${amount.toLocaleString()}</div>
                    
                    <div className="text-muted-foreground">Term:</div>
                    <div className="font-medium text-right">{term} months</div>
                    
                    <div className="text-muted-foreground">Interest Rate:</div>
                    <div className="font-medium text-right">8.9%</div>
                    
                    <div className="text-muted-foreground">Monthly Payment:</div>
                    <div className="font-medium text-right">${isNaN(monthlyPayment) ? '0.00' : monthlyPayment.toFixed(2)}</div>
                    
                    <div className="text-muted-foreground">Total Repayment:</div>
                    <div className="font-medium text-right">
                      ${isNaN(monthlyPayment) ? '0.00' : (monthlyPayment * term).toFixed(2)}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" type="button" onClick={() => navigate('/dashboard')}>
                    Cancel
                  </Button>
                  <Button type="submit">Submit Application</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Apply;
