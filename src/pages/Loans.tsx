
// import React from 'react';
// import { Layout } from '@/components/Layout';
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// const Loans = () => {
//   // Mock loan data - in a real app this would come from an API
//   const activeLoans = [
//     {
//       id: 'L1001',
//       type: 'Personal Loan',
//       amount: 5000,
//       remaining: 3200,
//       nextPayment: '2025-05-15',
//       rate: 8.5,
//       status: 'active',
//       term: 36
//     },
//     {
//       id: 'L1002',
//       type: 'Home Improvement',
//       amount: 10000,
//       remaining: 8500,
//       nextPayment: '2025-05-20',
//       rate: 7.2,
//       status: 'active',
//       term: 60
//     }
//   ];

//   const pastLoans = [
//     {
//       id: 'L1000',
//       type: 'Personal Loan',
//       amount: 3000,
//       remaining: 0,
//       completedDate: '2025-01-10',
//       rate: 9.0,
//       status: 'completed',
//       term: 24
//     }
//   ];

//   return (
//     <Layout>
//       <div className="space-y-6">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">My Loans</h1>
//           <p className="text-muted-foreground">
//             View and manage all your current and past loans.
//           </p>
//         </div>

//         <Tabs defaultValue="active" className="w-full">
//           <TabsList className="mb-4">
//             <TabsTrigger value="active">Active Loans ({activeLoans.length})</TabsTrigger>
//             <TabsTrigger value="past">Past Loans ({pastLoans.length})</TabsTrigger>
//           </TabsList>
          
//           <TabsContent value="active" className="space-y-4">
//             {activeLoans.length === 0 ? (
//               <Card>
//                 <CardContent className="py-8 text-center">
//                   <p className="text-muted-foreground">You have no active loans.</p>
//                   <Button className="mt-4" onClick={() => window.location.href = '/apply'}>Apply for a Loan</Button>
//                 </CardContent>
//               </Card>
//             ) : (
//               activeLoans.map(loan => (
//                 <Card key={loan.id}>
//                   <CardHeader className="pb-2">
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <CardTitle>{loan.type}</CardTitle>
//                         <CardDescription>ID: {loan.id}</CardDescription>
//                       </div>
//                       <Badge variant="outline" className="bg-primary/10 text-primary">Active</Badge>
//                     </div>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                       <div>
//                         <p className="text-sm text-muted-foreground">Loan Amount</p>
//                         <p className="font-medium">${loan.amount.toLocaleString()}</p>
//                       </div>
//                       <div>
//                         <p className="text-sm text-muted-foreground">Remaining</p>
//                         <p className="font-medium">${loan.remaining.toLocaleString()}</p>
//                       </div>
//                       <div>
//                         <p className="text-sm text-muted-foreground">Interest Rate</p>
//                         <p className="font-medium">{loan.rate}%</p>
//                       </div>
//                       <div>
//                         <p className="text-sm text-muted-foreground">Term</p>
//                         <p className="font-medium">{loan.term} months</p>
//                       </div>
//                     </div>
                    
//                     <div className="mt-4">
//                       <p className="text-sm text-muted-foreground">Next Payment Due</p>
//                       <p className="font-medium">{new Date(loan.nextPayment).toLocaleDateString()}</p>
//                     </div>
                    
//                     <div className="mt-4 bg-muted p-3 rounded-md">
//                       <div className="mb-1 flex justify-between text-sm">
//                         <span>Progress</span>
//                         <span>{Math.round((1 - loan.remaining / loan.amount) * 100)}%</span>
//                       </div>
//                       <div className="h-2 bg-background rounded-full overflow-hidden">
//                         <div 
//                           className="h-full bg-primary"
//                           style={{ width: `${Math.round((1 - loan.remaining / loan.amount) * 100)}%` }}
//                         ></div>
//                       </div>
//                     </div>
//                   </CardContent>
//                   <CardFooter>
//                     <div className="flex space-x-2">
//                       <Button variant="outline" size="sm">View Details</Button>
//                       <Button size="sm">Make Payment</Button>
//                     </div>
//                   </CardFooter>
//                 </Card>
//               ))
//             )}
//           </TabsContent>

//           <TabsContent value="past" className="space-y-4">
//             {pastLoans.length === 0 ? (
//               <Card>
//                 <CardContent className="py-8 text-center">
//                   <p className="text-muted-foreground">You have no past loans.</p>
//                 </CardContent>
//               </Card>
//             ) : (
//               pastLoans.map(loan => (
//                 <Card key={loan.id}>
//                   <CardHeader className="pb-2">
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <CardTitle>{loan.type}</CardTitle>
//                         <CardDescription>ID: {loan.id}</CardDescription>
//                       </div>
//                       <Badge variant="outline" className="bg-muted text-muted-foreground">Completed</Badge>
//                     </div>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                       <div>
//                         <p className="text-sm text-muted-foreground">Loan Amount</p>
//                         <p className="font-medium">${loan.amount.toLocaleString()}</p>
//                       </div>
//                       <div>
//                         <p className="text-sm text-muted-foreground">Interest Rate</p>
//                         <p className="font-medium">{loan.rate}%</p>
//                       </div>
//                       <div>
//                         <p className="text-sm text-muted-foreground">Term</p>
//                         <p className="font-medium">{loan.term} months</p>
//                       </div>
//                       <div>
//                         <p className="text-sm text-muted-foreground">Completed On</p>
//                         <p className="font-medium">{new Date(loan.completedDate).toLocaleDateString()}</p>
//                       </div>
//                     </div>
//                   </CardContent>
//                   <CardFooter>
//                     <Button variant="outline" size="sm">View Details</Button>
//                   </CardFooter>
//                 </Card>
//               ))
//             )}
//           </TabsContent>
//         </Tabs>
//       </div>
//     </Layout>
//   );
// };

// export default Loans;






import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getMyLoans } from '@/api/loan';
import { Loan } from '@/api/loan';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const Loans = () => {
  const [activeLoans, setActiveLoans] = useState<Loan[]>([]);
  const [pastLoans, setPastLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        setLoading(true);
        const { activeLoans, pastLoans } = await getMyLoans();
        setActiveLoans(activeLoans);
        setPastLoans(pastLoans);
      } catch (error) {
        toast({
          title: "Error loading loans",
          description: "Failed to fetch your loan information",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  // Helper function to calculate remaining amount
  const calculateRemaining = (loan: Loan) => {
    // In a real app, you'd calculate this based on payments made
    // For now, we'll just return 70% of the amount as remaining
    return loan.amount * 0.7;
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Loans</h1>
          <p className="text-muted-foreground">
            View and manage all your current and past loans.
          </p>
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="active">Active Loans ({activeLoans.length})</TabsTrigger>
            <TabsTrigger value="past">Past Loans ({pastLoans.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="space-y-4">
            {activeLoans.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">You have no active loans.</p>
                  <Button className="mt-4" onClick={() => navigate('/apply')}>
                    Apply for a Loan
                  </Button>
                </CardContent>
              </Card>
            ) : (
              activeLoans.map(loan => {
                const remaining = calculateRemaining(loan);
                return (
                  <Card key={loan._id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="capitalize">{loan.loanType.replace('_', ' ')} Loan</CardTitle>
                          <CardDescription>ID: {loan._id.slice(-6).toUpperCase()}</CardDescription>
                        </div>
                        <Badge variant="outline" className="bg-primary/10 text-primary">
                          {loan.status === 'paid' ? 'Active' : 'Pending'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Loan Amount</p>
                          <p className="font-medium">${loan.amount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Remaining</p>
                          <p className="font-medium">${remaining.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Interest Rate</p>
                          <p className="font-medium">{loan.interestRate}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Term</p>
                          <p className="font-medium">{loan.installments} months</p>
                        </div>
                      </div>
                      
                      {loan.status === 'approved' && (
                        <>
                          <div className="mt-4">
                            <p className="text-sm text-muted-foreground">Next Payment Due</p>
                            <p className="font-medium">
                              {new Date(loan.nextPayDate).toLocaleDateString()}
                            </p>
                          </div>
                          
                          <div className="mt-4 bg-muted p-3 rounded-md">
                            <div className="mb-1 flex justify-between text-sm">
                              <span>Progress</span>
                              <span>{Math.round((1 - remaining / loan.amount) * 100)}%</span>
                            </div>
                            <div className="h-2 bg-background rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary"
                                style={{ width: `${Math.round((1 - remaining / loan.amount) * 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        </>
                      )}
                    </CardContent>
                    <CardFooter>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">View Details</Button>
                        {loan.status === 'approved' && (
                          <Button size="sm">Make Payment</Button>
                        )}
                      </div>
                    </CardFooter>
                  </Card>
                );
              })
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {pastLoans.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">You have no past loans.</p>
                </CardContent>
              </Card>
            ) : (
              pastLoans.map(loan => (
                <Card key={loan._id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="capitalize">{loan.loanType.replace('_', ' ')} Loan</CardTitle>
                        <CardDescription>ID: {loan._id.slice(-6).toUpperCase()}</CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-muted text-muted-foreground">
                        {loan.status === 'completed' ? 'Completed' : 'Rejected'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Loan Amount</p>
                        <p className="font-medium">${loan.amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Interest Rate</p>
                        <p className="font-medium">{loan.interestRate}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Term</p>
                        <p className="font-medium">{loan.installments} months</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {loan.status === 'completed' ? 'Completed On' : 'Rejected On'}
                        </p>
                        <p className="font-medium">
                          {new Date(loan.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm">View Details</Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Loans;