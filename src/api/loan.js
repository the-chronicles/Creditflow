import { api, apiFormData } from '../api';

export const applyForLoan = async (formData, idFile) => {
  try {
    const formDataPayload = new FormData();
    
    // Convert data types to match backend expectations
    const payload = {
      ...formData,
      amount: parseFloat(formData.amount),
      installments: parseInt(formData.installments),
      income: parseFloat(formData.income),
      nextPayDate: formData.nextPayDate.toISOString()
    };

    // Append all fields
    for (const key in payload) {
      formDataPayload.append(key, payload[key]);
    }

    // Append file if exists
    if (idFile) {
      formDataPayload.append('document', idFile);
    }

    const response = await apiFormData.post('/loan/apply', formDataPayload);
    return response.data;
  } catch (error) {
    console.error('Loan application error:', {
      message: error.message,
      url: error.config?.url,
      response: error.response?.data
    });
    throw error.response?.data || { 
      message: error.message || 'Failed to submit loan application' 
    };
  }
};

export const getMyLoans = async () => {
  try {
    // Fixed typo here: '/loas/my-loans' → '/loan/my-loans'
    const response = await api.get('/loan/my-loans');
    const allLoans = response.data;
    
    // Improved filtering with null checks
    const activeLoans = allLoans.filter(loan => 
      loan?.status && (loan.status === 'approved' || loan.status === 'paid')
    );
    
    const pastLoans = allLoans.filter(loan => 
      loan?.status && (loan.status === 'completed' || loan.status === 'rejected')
    );

    return { activeLoans, pastLoans };
  } catch (error) {
    console.error('Error fetching loans:', {
      message: error.message,
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data
    });
    throw error.response?.data || { 
      message: error.message || 'Failed to fetch loans' 
    };
    
  }
};

export const getLoanDetails = async (loanId) => {
  try {
    const response = await api.get(`/loan/${loanId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching loan details:', {
      message: error.message,
      url: error.config?.url,
      loanId
    });
    throw error.response?.data || { 
      message: error.message || 'Failed to fetch loan details' 
    };
  }
};