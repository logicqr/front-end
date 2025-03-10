import React, { useEffect, useState } from "react";
import axiosInstance from "../../auth/axios";
import {
  FaTrash, FaClipboardList, FaUser, FaEnvelope, FaPhone, FaBuilding,
  FaBarcode, FaCalendar, 
  FaShoppingCart, FaCheckCircle
} from "react-icons/fa";
import { format } from "date-fns";

const TempOrderList = () => {
  const [tempOrders, setTempOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/temporders");
        setTempOrders(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setError(err.message);
        setTempOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async () => {
    setDeleteLoading(true)
    try {
      await axiosInstance.delete(`/temporders/${deleteId}`);
      setDeleteId(null);
      setTempOrders(tempOrders.filter(order => order.temporder_id !== deleteId));
    } catch (err) {
      setError("Failed to delete the order.");
    } finally{
      setDeleteLoading(false)
    }
  };



  if (loading) {
    return  <div className="flex justify-center items-center h-screen bg-white ml-14">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
  </div>
  }

  if (error) {
    return <div className="pl-16 md:pl-20 flex justify-center items-center h-screen text-red-600">Error: {error}</div>;
  }

  const today = format(new Date(), "yyyy-MM-dd"); // Get today's date in YYYY-MM-DD format

  const todayTempOrders = Array.isArray(tempOrders) 
  ? tempOrders.filter(order => format(new Date(order.createdAt), "yyyy-MM-dd") === today)
  : [];

  return (
    <div className="min-h-screen bg-gray-100 pl-20 pt-2 pb-6 pr-5">
      <div className="md:w-[80%] mx-auto">
        <div className="flex justify-between py-5 items-center">
          <h1 className=" text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
            <FaClipboardList className="mr-2 text-purple-600" /> Temp Orders
          </h1>
          <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm px-6 py-2 rounded-full">
            Total: {tempOrders.length}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-2 md:p-4 rounded-md shadow-md flex items-center justify-between">
            <div>
              <h3 className="text-md md:text-lg font-bold text-gray-800">Total TempOrders</h3>
              <p className="text-lg md:text-xl font-semibold text-purple-600">{tempOrders.length}</p>
            </div>
            <FaShoppingCart className="text-purple-600 text-xl md:text-3xl" />
          </div>

          <div className="bg-white p-2 md:p-4 rounded-md shadow-md flex items-center justify-between">
            <div>
              <h3 className="text-md md:text-lg font-bold text-gray-800">Today TempOrders</h3>
              <p className="text-lg md:text-xl font-semibold text-green-500">{todayTempOrders.length}</p>
            </div>
            <FaCheckCircle className="text-green-500 text-3xl" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {tempOrders.map((order) => (
            <div
              key={order.temporder_id}
              className="bg-white p-4 rounded-md shadow-md md:hover:shadow-lg transform md:hover:-translate-y-1 transition-transform"
            >
              <div className="flex justify-end">
                <button
                  onClick={() => setDeleteId(order.temporder_id)}
                  className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-2 rounded-md hover:from-red-600 hover:to-pink-600 transition-all flex items-center"
                >
                  <FaTrash />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center">
                  <FaUser className="text-purple-500 mr-2" />
                  <span className="text-gray-800 font-medium">{order.fullName}</span>
                </div>
                <div className="flex items-center">
                  <FaEnvelope className="text-blue-500 mr-2" />
                  <span className="text-gray-600">{order.email}</span>
                </div>
                <div className="flex items-center">
                  <FaPhone className="text-green-500 mr-2" />
                  <span className="text-gray-600">{order.phone}</span>
                </div>
                <div className="flex items-center">
                  <FaShoppingCart className="text-blue-500 mr-2" />
                  <span className="text-gray-600">{order.orderId}</span>
                </div>
          

 
                  <div className="flex items-center">
                    <FaBuilding className="text-orange-500 mr-2" />
                    <span className="text-gray-600">{order.businessName}</span>
                  </div>
                  <div className="flex items-center">
                    <FaClipboardList className="text-indigo-500 mr-2" />
                    <span className="text-gray-600">{order.businessType}</span>
                  </div>
                  <div className="flex items-center">
                    <FaClipboardList className="text-pink-500 mr-2" />
                    <span className="text-gray-600">Referral: {order.referralCode}</span>
                  </div>
                  <div className="flex items-center">
                    <FaBarcode className="text-blue-500 mr-2" />
                    <span className="text-gray-600">Place ID: {order.placeId}</span>
                  </div>
                  <div className="flex items-center">
                    <FaCalendar className="text-pink-500 mr-2" />
                    <span className="text-gray-500">{new Date(order.createdAt).toLocaleString()}</span>
                  </div>
                </div>
            
            </div>
          ))}
        </div>
      </div>

      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 pl-16 flex justify-center items-center">
          <div className="bg-white p-4 rounded-md shadow-lg text-center m-3">
            <h2 className="text-lg font-bold text-gray-800 mb-2">Confirm Deletion</h2>
            <p className="text-gray-600 mb-3">Are you sure you want to delete this order?</p>
            <button onClick={() => setDeleteId(null)} className="bg-gray-500 text-white px-3 py-1 rounded-md">Cancel</button>
            <button onClick={handleDelete} className="bg-red-500 text-white px-3 py-1 ml-5 rounded-md">{deleteLoading?'Deleting...':'Delete'}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TempOrderList;