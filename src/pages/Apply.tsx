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
import { CalendarIcon, Upload, IdCard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const loanSchema = z.object({
  loanType: z.string().min(1, { message: 'Please select a loan type' }),
  amount: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num >= 50 && num <= 500;
  }, { message: 'Amount must be between $50 and $500' }),
  paymentFrequency: z.string().min(1, { message: 'Please select payment frequency' }),
  installments: z.string().min(1, { message: 'Please select number of installments' }),
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
  // New personal information fields
  socialSecurityNumber: z.string()
    .min(9, { message: 'Social security number must be 9 digits' })
    .max(11, { message: 'Social security number cannot exceed 11 characters' })
    .optional(),
  idType: z.string().min(1, { message: 'Please select ID type' }).optional(),
});

type LoanFormValues = z.infer<typeof loanSchema>;

const Apply = () => {
  const navigate = useNavigate();
  const [sliderValue, setSliderValue] = useState([200]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [paymentFrequency, setPaymentFrequency] = useState('monthly');
  const [idFile, setIdFile] = useState<File | null>(null);
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);

  const getInstallmentOptions = () => {
    if (paymentFrequency === 'weekly') {
      return [
        { value: '4', label: '4 weeks (1 month)' },
        { value: '8', label: '8 weeks (2 months)' },
        { value: '12', label: '12 weeks (3 months)' },
      ];
    } else {
      return [
        { value: '1', label: '1 month' },
        { value: '2', label: '2 months' },
        { value: '3', label: '3 months' },
        { value: '6', label: '6 months' },
      ];
    }
  };

  const form = useForm<LoanFormValues>({
    resolver: zodResolver(loanSchema),
    defaultValues: {
      loanType: '',
      amount: '200',
      paymentFrequency: 'monthly',
      installments: '',
      purpose: '',
      employment: '',
      income: '',
      payFrequency: '',
      socialSecurityNumber: '',
      idType: '',
    },
  });

  const handleSliderChange = (value: number[]) => {
    setSliderValue(value);
    form.setValue('amount', value[0].toString(), { shouldValidate: true });
  };

  const handlePaymentFrequencyChange = (value: string) => {
    setPaymentFrequency(value);
    form.setValue('paymentFrequency', value, { shouldValidate: true });
    // Reset installments when payment frequency changes
    form.setValue('installments', '', { shouldValidate: true });
  };

  const calculateMonthlyPayment = (amount: number, installments: number, interestRate = 0.089) => {
    const r = interestRate / 12;
    const n = installments;
    return (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIdFile(e.target.files[0]);
      toast({
        title: "File uploaded",
        description: `File "${e.target.files[0].name}" has been uploaded successfully.`
      });
    }
  };

  const onSubmit = (data: LoanFormValues) => {
    // In a real app, this would submit to an API
    console.log('Loan application submitted:', data);
    console.log('ID file:', idFile);
    
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
  const installments = parseInt(form.watch('installments') || '1');
  const currentPaymentFrequency = form.watch('paymentFrequency');
  
  // Calculate payment amount based on frequency and installments
  const calculatePaymentAmount = () => {
    if (!installments || isNaN(installments)) return 0;
    
    const totalWithInterest = amount * 1.089; // Simple interest calculation
    const paymentAmount = totalWithInterest / installments;
    return paymentAmount;
  };

  const paymentAmount = calculatePaymentAmount();
  
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
                              min={50}
                              max={500}
                              step={10}
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>$50</span>
                              <span>$500</span>
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
                    name="paymentFrequency"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Payment Frequency</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) => {
                              field.onChange(value);
                              handlePaymentFrequencyChange(value);
                            }}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="weekly" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Weekly Payments
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="monthly" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Monthly Payments
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="installments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Installments</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select number of installments" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {getInstallmentOptions().map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose how many payments you want to make
                        </FormDescription>
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
                
                {/* Personal Information Button */}
                <div className="flex flex-col items-center justify-center">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full max-w-sm mb-2"
                    onClick={() => setShowPersonalInfo(!showPersonalInfo)}
                  >
                    <IdCard className="mr-2" />
                    {showPersonalInfo ? "Hide Personal Information" : "Input Personal Information"}
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    We need your personal information to verify your identity
                  </p>
                </div>

                {/* Personal Information Section */}
                {showPersonalInfo && (
                  <div className="space-y-4 bg-muted/30 p-4 rounded-md border">
                    <h3 className="text-lg font-medium">Personal Information</h3>

                    <FormField
                      control={form.control}
                      name="socialSecurityNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Social Security Number</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="XXX-XX-XXXX" 
                              {...field} 
                              maxLength={11}
                            />
                          </FormControl>
                          <FormDescription>
                            Your SSN is securely encrypted and stored
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="idType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ID Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select ID type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="drivers_license">Driver's License</SelectItem>
                              <SelectItem value="passport">Passport</SelectItem>
                              <SelectItem value="state_id">State ID</SelectItem>
                              <SelectItem value="military_id">Military ID</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-2">
                      <FormLabel>Upload ID Document</FormLabel>
                      <div className="border border-dashed border-input rounded-md p-6">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Upload className="h-10 w-10 text-muted-foreground" />
                          <p className="text-sm font-medium">
                            {idFile ? idFile.name : "Drag & drop or click to upload"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Supports JPG, PNG, PDF up to 5MB
                          </p>
                          <label htmlFor="id-upload" className="mt-2">
                            <Button size="sm" variant="secondary" asChild>
                              <span>Select File</span>
                            </Button>
                          </label>
                          <Input
                            id="id-upload"
                            type="file"
                            className="hidden"
                            accept="image/jpeg,image/png,application/pdf"
                            onChange={handleFileChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <Separator />
                
                {/* Financial Information Section */}
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
                    <div className="text-muted-foreground">Loan Amount:</div>
                    <div className="font-medium text-right">${amount.toLocaleString()}</div>
                    
                    <div className="text-muted-foreground">Payment Frequency:</div>
                    <div className="font-medium text-right">
                      {currentPaymentFrequency === 'weekly' ? 'Weekly' : 'Monthly'}
                    </div>
                    
                    <div className="text-muted-foreground">Number of Payments:</div>
                    <div className="font-medium text-right">{installments || '-'}</div>
                    
                    <div className="text-muted-foreground">Interest Rate:</div>
                    <div className="font-medium text-right">8.9%</div>
                    
                    <div className="text-muted-foreground">
                      {currentPaymentFrequency === 'weekly' ? 'Weekly' : 'Monthly'} Payment:
                    </div>
                    <div className="font-medium text-right">
                      ${paymentAmount ? paymentAmount.toFixed(2) : '0.00'}
                    </div>
                    
                    <div className="text-muted-foreground">Total Repayment:</div>
                    <div className="font-medium text-right">
                      ${paymentAmount && installments ? (paymentAmount * installments).toFixed(2) : '0.00'}
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
