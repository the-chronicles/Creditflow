import React, { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  CreditCard,
  Calendar,
  ArrowRight,
  Wallet,
  Phone,
  MessageSquare,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getMyLoans } from "../api/loan";

interface Loan {
  id: string;
  name: string;
  amount: number;
  remainingAmount: number;
  nextPaymentAmount: number;
  nextPayment: string;
  // Add other properties as needed
}

interface LoanData {
  pendingLoans: Loan[];
  activeLoans: Loan[];
  pastLoans: Loan[];
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [loans, setLoans] = useState<LoanData>({
    pendingLoans: [],
    activeLoans: [],
    pastLoans: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLoans = async () => {
      setLoading(true);
      try {
        const loanData = await getMyLoans();
        setLoans(loanData);
      } catch (err) {
        setError("Error fetching loans");
        console.error("Error fetching loans:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, []);

  // Safe calculations with defaults
  const totalOutstanding =
    loans.activeLoans?.reduce(
      (total, loan) => total + (loan.remainingAmount || 0),
      0
    ) || 0;

  const nextPaymentTotal =
    loans.activeLoans?.reduce(
      (total, loan) => total + (loan.nextPaymentAmount || 0),
      0
    ) || 0;

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user?.name}
          </h1>
          <p className="text-muted-foreground">
            Here's an overview of your loans and upcoming payments
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Outstanding
              </CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalOutstanding.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Across {loans.activeLoans?.length || 0} active loans
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Next Payment
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${nextPaymentTotal.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {loans.activeLoans?.length > 0
                  ? `Due on ${new Date(
                      loans.activeLoans[0].nextPayment
                    ).toLocaleDateString()}`
                  : "No upcoming payments"}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-primary text-primary-foreground">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Quick Actions
              </CardTitle>
              <div className="h-4 w-4" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="secondary"
                size="sm"
                className="w-full"
                onClick={() => navigate("/apply")}
              >
                Apply for New Loan
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20"
                onClick={() => setPaymentDialogOpen(true)}
                disabled={loans.activeLoans?.length === 0}
              >
                Make a Payment
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Payment Dialog */}
        <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
          {" "}
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
                    href="tel:+18777284195"
                    className="text-xl font-bold text-primary block mb-3"
                  >
                    1-877-728-4195
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
                    href="sms:+18777284195"
                    className="text-xl font-bold text-primary block mb-3"
                  >
                    1-877-728-4195
                  </a>
                  <p className="text-sm text-muted-foreground">
                    Please include your full name, loan number, and payment
                    amount
                  </p>
                </div>
                <p className="text-sm text-center border-t border-border pt-4">
                  Standard message and data rates may apply
                </p>
              </TabsContent>
            </Tabs>
            <DialogFooter className="sm:justify-start">
              <Button
                variant="ghost"
                onClick={() => setPaymentDialogOpen(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Active Loans */}
        <div>
          <h2 className="text-xl font-semibold tracking-tight mb-4">
            Active Loans
          </h2>
          {loading ? (
            <p>Loading your loans...</p>
          ) : error ? (
            <p>{error}</p>
          ) : loans.activeLoans?.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">
                  You have no active loans
                </p>
                <Button className="mt-4" onClick={() => navigate("/apply")}>
                  Apply for a Loan
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {loans.activeLoans.map((loan) => (
                <Card key={loan.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h3 className="font-medium">{loan.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Loan #{loan.id}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => navigate(`/loans/${loan.id}`)}
                        >
                          Details <ArrowRight className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Original Amount
                          </p>
                          <p className="font-medium">
                            ${(loan.amount || 0).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Remaining
                          </p>
                          <p className="font-medium">
                            ${(loan.remainingAmount || 0).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Next Payment
                          </p>
                          <p className="font-medium">
                            ${(loan.nextPaymentAmount || 0).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Due Date
                          </p>
                          <p className="font-medium">
                            {loan.nextPayment
                              ? new Date(loan.nextPayment).toLocaleDateString()
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
