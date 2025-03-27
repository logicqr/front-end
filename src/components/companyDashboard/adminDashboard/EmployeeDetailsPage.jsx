import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { Link } from "react-router-dom";
import axiosInstance from "../../auth/axios";

const EmployeeDetailsPage = () => {
  const { employeeId } = useParams();
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const response = await axiosInstance(
          `/staff/${employeeId}/referrals`
        );
        const data = response.data
        if (data.success) {
          setReferrals(data.data);
        }
      } catch (error) {
        console.error("Error fetching referrals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReferrals();
  }, [employeeId]);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600 animate-pulse">
        Loading employee details...
      </div>
    );
  }

  return (
    <div>

        <div className=" pl-20 p-6 bg-gray-50 min-h-screen">
      <div className="">
        <Link
          to="/employees-details"
          className="mb-4 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <FiArrowLeft className="mr-2" /> Back to Dashboard
        </Link>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="mb-8 pb-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Employee Referral Details
            </h1>
            <div className="flex items-center space-x-4">
              <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                Employee ID: {employeeId}
              </span>
              
            </div>
          </div>

          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Referred User Members <span className="text-blue-600">({referrals.length})</span>
          </h2>
          
          {referrals.length > 0 ? (
            <div className="grid gap-4">
              {referrals.map((staff) => (
                <div key={staff.user_id} className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <DetailItem label="Name" value={staff.name} />
                    <DetailItem label="Business" value={staff.businessName} />
                    <DetailItem label="Join Date" 
                      value={new Date(staff.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })} 
                    />
                    <div className="flex items-center gap-3 md:gap-8">
                    <DetailItem label="subscriptionEndDate" 
                      value={new Date(staff.subscriptionEndDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })} 
                    />
                    <span className={`px-3 py-1 rounded-full text-sm ${
                        staff.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {staff.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2">
                    <DetailItem label="Email" value={staff.email} />
                    <DetailItem label="Phone" value={staff.phoneNumber} />
                    <DetailItem label="Business Type" value={staff.businessType} />
                    
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No User members found</p>
              <p className="text-sm text-gray-400 mt-1">
                This employee hasn't referred any User yet
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

const DetailItem = ({ label, value }) => (
  <div>
    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
      {label}
    </dt>
    <dd className="mt-1 text-sm text-gray-900 font-medium truncate">
      {value || <span className="text-gray-400">N/A</span>}
    </dd>
  </div>
);

export default EmployeeDetailsPage;