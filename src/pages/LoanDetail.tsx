import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getMyLoanById } from "@/api/loan";
import { Loan } from "@/api/loan";

const LoanDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loan, setLoan] = useState<Loan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoan = async () => {
      try {
        if (!id) return;
        const data = await getMyLoanById(id);
        setLoan(data);
      } catch (error) {
        console.error("Error fetching loan:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLoan();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!loan) {
    return (
      <Layout>
        <div className="text-center mt-10">
          <h2 className="text-xl font-semibold">Loan not found</h2>
          <Button className="mt-4" onClick={() => navigate("/dashboard")}>Go Back</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Loan Details</h1>
        <Card>
          <CardHeader>
            <CardTitle>{loan.loanType} Loan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div><strong>Amount:</strong> ${loan.amount}</div>
            <div><strong>Installments:</strong> {loan.installments} months</div>
            <div><strong>Purpose:</strong> {loan.purpose}</div>
            <div><strong>Status:</strong> {loan.status}</div>
            <div><strong>Applied On:</strong> {new Date(loan.createdAt).toLocaleString()}</div>

            {loan.idDocumentPath && (
              <div className="pt-4">
                <p className="text-sm font-medium text-muted-foreground">Uploaded Document:</p>
                {/\.(pdf)$/i.test(loan.idDocumentPath) ? (
                  <iframe
                    src={loan.idDocumentPath}
                    title="Uploaded Document"
                    width="100%"
                    height="500px"
                    className="rounded-md border"
                  />
                ) : /\.(jpe?g|png|webp)$/i.test(loan.idDocumentPath) ? (
                  <img
                    src={loan.idDocumentPath}
                    alt="Uploaded Document"
                    className="w-full max-w-md rounded-md border shadow"
                  />
                ) : (
                  <a
                    href={loan.idDocumentPath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View Uploaded Document
                  </a>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default LoanDetail;
