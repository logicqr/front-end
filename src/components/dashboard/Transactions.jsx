import { useEffect, useState } from "react";
import axiosInstance from "../auth/axios";
import { FaWallet, FaCheckCircle, FaTimesCircle, FaCalendarAlt, FaMoneyBillWave, FaIdCard, FaHistory } from "react-icons/fa";
import { TbTransactionRupee } from "react-icons/tb";
import { BsBookmarkCheck } from "react-icons/bs";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = sessionStorage.getItem("id");
  
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axiosInstance.get(`/user-transactions/${userId}`);
        const sortedTransactions = response.data.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setTransactions(sortedTransactions);
      } catch (err) {
        setError("Failed to fetch transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const formatToIST = (dateString) => {
    const options = {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    return new Date(dateString).toLocaleString('en-IN', options);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="text-gray-600 text-2xl animate-pulse flex items-center space-x-2">
          <FaWallet className="animate-bounce" />
          <span>Loading transactions...</span>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="text-red-500 text-2xl flex items-center space-x-2">
          <FaTimesCircle />
          <span>{error}</span>
        </div>
      </div>
    );

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-100">
      <div className="min-h-screen w-[90%] mx-auto py-12 lg:pt-24 mt-14 container">
        <div className="mx-auto md:px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <h1 className="lg:text-4xl text-xl text-gray-900 flex items-center space-x-3 mb-6 opacity-90">
              <span>Transaction History</span>
              <FaHistory className="text-[#032068]" />
            </h1>
            
            {transactions.map((transaction) => (
              <div
                key={transaction.transaction_id}
                className="relative bg-white lg:p-6 p-3 w-full rounded-2xl shadow-xl hover:shadow-2xl transition-transform transform hover:-translate-y-1 lg:border-l-8 border-t-8 lg:border-t-0 border-[#032068] overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-purple-100 opacity-10"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                  <div>
                    <p className="text-sm text-gray-500 flex items-center space-x-1">
                      <FaIdCard className="text-indigo-500" />
                      <span className="font-medium lg:text-lg">Transaction ID</span>
                    </p>
                    <p className="text-gray-400 mt-1">{transaction.transaction_id}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 flex items-center space-x-1">
                      <FaMoneyBillWave className="text-green-500 text-lg" />
                      <span className="font-medium lg:text-lg">Amount</span>
                    </p>
                    <p className="font-bold text-green-600 mt-1">₹{transaction.amount}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 flex items-center space-x-1">
                      {transaction.status === "paid" ? (
                        <FaCheckCircle className="text-green-500 lg:text-lg" />
                      ) : (
                        <FaTimesCircle className="text-red-500" />
                      )}
                      <span className="font-medium lg:text-lg">Status</span>
                    </p>
                    <p
                      className={`font-bold mt-1 lg:text-lg ${
                        transaction.status === "paid" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {transaction.status}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 relative z-10">
                  <div>
                    <p className="text-sm text-gray-500 flex items-center space-x-2">
                      <BsBookmarkCheck className="text-indigo-500 lg:text-lg" />
                      <span className="font-medium lg:text-lg">Order ID</span>
                    </p>
                    <p className="text-gray-400 mt-1">{transaction.orderId}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 flex items-center space-x-2">
                      <TbTransactionRupee className="text-indigo-500 text-lg" />
                      <span className="font-medium lg:text-lg">Payment Type</span>
                    </p>
                    <p className="text-gray-400 mt-1">{transaction.type}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 flex items-center space-x-2">
                      <FaCalendarAlt className="text-indigo-500 text-lg" />
                      <span className="font-medium lg:text-lg">Date</span>
                    </p>
                    <p className="text-gray-400 mt-1">
                      {formatToIST(transaction.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;