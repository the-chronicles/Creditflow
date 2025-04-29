
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Phone, MessageSquare } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Schedule = () => {
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  
  // Mock data for upcoming payments
  const upcomingPayments = [
    {
      id: '1',
      loanId: 'L10001',
      amount: 250,
      dueDate: '2025-05-15',
      status: 'upcoming',
    },
    {
      id: '2',
      loanId: 'L10002',
      amount: 500,
      dueDate: '2025-05-20',
      status: 'upcoming',
    },
  ];

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payment Schedule</h1>
          <p className="text-muted-foreground">View your upcoming loan payments</p>
        </div>

        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold tracking-tight">Upcoming Payments</h2>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setPaymentDialogOpen(true)}
          >
            Make a Payment
          </Button>
        </div>

        {/* Payment schedule list */}
        <div className="space-y-4">
          {upcomingPayments.map((payment) => (
            <Card key={payment.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Loan #{payment.loanId}</h3>
                    <p className="text-muted-foreground">Due on {new Date(payment.dueDate).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">${payment.amount.toLocaleString()}</p>
                    <Button 
                      className="mt-2"
                      size="sm" 
                      onClick={() => setPaymentDialogOpen(true)}
                    >
                      Pay Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Payment Dialog - Same as in Dashboard */}
        <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Make a Payment</DialogTitle>
              <DialogDescription>
                Contact us to make a payment on your loan.
              </DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="call" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="call">Call Us</TabsTrigger>
                <TabsTrigger value="text">Text Us</TabsTrigger>
              </TabsList>
              <TabsContent value="call" className="space-y-4">
                <div className="text-center py-4">
                  <Phone className="mx-auto h-12 w-12 text-primary mb-3" />
                  <p className="mb-2">Call us at:</p>
                  <a 
                    href="tel:+18005551234" 
                    className="text-xl font-bold text-primary block mb-3"
                  >
                    1-800-555-1234
                  </a>
                  <p className="text-sm text-muted-foreground">
                    Our representatives are available Monday-Friday, 8am-8pm ET
                  </p>
                </div>
                <p className="text-sm text-center border-t border-border pt-4">
                  Please have your loan number and payment amount ready
                </p>
              </TabsContent>
              <TabsContent value="text" className="space-y-4">
                <div className="text-center py-4">
                  <MessageSquare className="mx-auto h-12 w-12 text-primary mb-3" />
                  <p className="mb-2">Text us at:</p>
                  <a 
                    href="sms:+18005551234" 
                    className="text-xl font-bold text-primary block mb-3"
                  >
                    1-800-555-1234
                  </a>
                  <p className="text-sm text-muted-foreground">
                    Please include your full name, loan number, and payment amount
                  </p>
                </div>
                <p className="text-sm text-center border-t border-border pt-4">
                  Standard message and data rates may apply
                </p>
              </TabsContent>
            </Tabs>
            <DialogFooter className="sm:justify-start">
              <Button variant="ghost" onClick={() => setPaymentDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Schedule;
