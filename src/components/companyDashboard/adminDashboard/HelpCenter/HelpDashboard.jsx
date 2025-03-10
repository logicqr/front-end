import React, { useEffect, useState } from 'react'
import { IoTicketSharp } from "react-icons/io5";
import { TbProgressAlert } from "react-icons/tb";
import { RiGitClosePullRequestLine } from "react-icons/ri";
import { TbProgressCheck } from "react-icons/tb";
import { FaEnvelope, FaCalendarAlt, FaTag, FaTrash } from "react-icons/fa";
import { jsPDF } from "jspdf";
import { toast, ToastContainer } from 'react-toastify';
import { FiUploadCloud } from "react-icons/fi";
import { useMemo } from 'react';
import { useNavigate } from "react-router-dom";
import { FaExclamationCircle, FaCheckCircle, FaSpinner, FaQuestionCircle } from "react-icons/fa";
import axiosInstance from '../../../auth/axios';



const HelpDashboard = () => {
  const [activeTab, setActiveTab] = useState("Open");
  const [currentPage, setCurrentPage] = useState(1);
  const [tickets, setTickets] = useState([]);
  const ticketsPerPage = 10;
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();


  const openTickets = tickets.filter(ticket => ticket.status === "OPEN").length;
  const inProgressTickets = tickets.filter(ticket => ticket.status === "IN_PROGRESS").length;
  const resolvedTickets = tickets.filter(ticket => ticket.status === "RESOLVED").length;

  useEffect(() => {
    setPageLoading(true)
    const fetchTickets = async () => {

      try {
        const response = await axiosInstance.get("/users-help-center");
        if (response.data && response.data.allTickets
        ) {
          setTickets(response.data.allTickets
          );
          // console.log(response.data.allTickets)
        } else {
          setError("No tickets found.");
          // console.log(response.data)

        }
      } catch (err) {
        setError("Error fetching tickets. Please try again.");
      } finally {
        setLoading(false);
        setPageLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("all tickets", 10, 10);
    doc.autoTable({
      head: [["Name", "Ticket Id", "Date"]],
      body: tickets.map((ticket) => [
        ticket.name,
        ticket.user_id,
        // new Date(review.createdAt).toLocaleDateString()

      ]),
    });
    doc.save("Help queries.pdf");
    toast.success("Queris data downlodedf successfully!");
  };

  const filteredTickets = useMemo(() => {
    const query = searchQuery.toLowerCase();

    return tickets.filter((ticket) => {
      // Search filter (name or user_id)
      const matchesSearch =
        ticket?.name?.toLowerCase().includes(query) ||
        ticket?.user_id?.toString().toLowerCase().includes(query);

      // Status filter based on active tab
      const matchesStatus =
        // activeTab === "All Tickets" ||
        (activeTab === "Open" && ticket.status === "OPEN") ||
        (activeTab === "In Progress" && ticket.status === "IN_PROGRESS") ||
        (activeTab === "Resolved" && ticket.status === "RESOLVED");

      return matchesSearch && matchesStatus;
    });
  }, [tickets, searchQuery, activeTab]);

  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = filteredTickets.slice(indexOfFirstTicket, indexOfLastTicket);

  if (pageLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white ml-14">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
  <div className=' bg-[#F5F5F5]'>
    
     <div className=' pl-16  min-h-screen container mx-auto'>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className='py-8 px-3'>
        <div className='w-full bg-white border rounded-lg flex flex-col gap-3 justify-between  lg:p-5 p-3   '>
          <h1 className='text-lg '>Ticket Metrics</h1>
          <div className=' flex items-center lg:flex-row flex-col justify-between w-full lg:gap-5 gap-3'>
            <div className='w-full flex items-center justify-between lg:gap-5 gap-2'>
              <div className=' flex items-center justify-between w-full border border-[#B353FF] bg-[#edd7ff] rounded-md lg:p-5 p-2 '>
                <div>
                  <h1 className='md:text-base text-xs' >Total tickets</h1>
                  <h1 className='md:text-lg lg:text-2xl text-base font-semibold'>{tickets.length}</h1>
                </div>
                <div className='bg-[#B353FF] md:w-10 md:h-10  w-7 h-7 rounded-full flex items-center justify-center'>
                  <IoTicketSharp className='md:text-xl text-base text-white' />
                </div>
              </div>

              <div className=' flex items-center justify-between w-full border border-red-500 bg-red-200 rounded-md lg:p-5 p-2'>
                <div className='md:text-base text-sm'>
                  <h1 className='md:text-base text-xs' >Open tickets</h1>
                  <h1 className='md:text-lg lg:text-2xl text-base font-semibold'>{openTickets}</h1>
                </div>
                <div className='bg-red-500 md:w-10 md:h-10  w-7 h-7 rounded-full flex items-center justify-center'>
                  < RiGitClosePullRequestLine className='md:text-xl text-base text-white' />

                </div>
              </div></div>
            <div className='w-full flex items-center justify-between lg:gap-5 gap-2'>
              <div className=' flex items-center justify-between w-full  border rounded-md border-yellow-500 bg-yellow-100 lg:p-5 p-2'>
                <div className='md:text-base text-sm'>
                  <h1 className='md:text-base text-xs' >In Progress</h1>
                  <h1 className='md:text-lg lg:text-2xl text-base font-semibold'>{inProgressTickets}</h1>
                </div>
                <div className='bg-yellow-500 md:w-10 md:h-10  w-7 h-7 rounded-full flex items-center justify-center'>
                  <TbProgressAlert className='md:text-xl text-base text-white' />
                </div>
              </div>
              <div className=' flex items-center justify-between w-full rounded-md lg:p-5 p-2 border border-green-500 bg-green-100 '>
                <div className='md:text-base text-sm'>
                  <h1 className='md:text-base text-xs'>Resolved</h1>
                  <h1 className=' md:text-lg lg:text-2xl text-base font-semibold'>{resolvedTickets}</h1>
                </div>
                <div className='bg-green-500 md:w-10 md:h-10  w-7 h-7 rounded-full flex items-center justify-center'>
                  <TbProgressCheck className='md:text-xl text-base text-white' />

                </div>
              </div>
            </div>
          </div>

        </div>



        <div className="flex space-x-4 border-b  pb-3 mt-5 w-full">
          <div className=' border flex lg:gap-5 gap-2 bg-white lg:px-4 px-2 lg:text-base text-sm py-2 rounded-full'>
            {["Open", "In Progress", "Resolved"].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-1 rounded-full  text-xs md:text-base   ${activeTab === tab ? "bg-[#032068] text-white" : "bg-gray-100 text-gray-700 border b"}`}
                onClick={() => {
                  setActiveTab(tab);
                  setCurrentPage(1);
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 lg:p-4 p-3 lg:bg-white border rounded-md">
          <div className="flex lg:justify-between flex-col lg:flex-row lg:items-center gap-4   pb-2 ">
            <div>
              <h2 className="text-lg font-semibold">Tickets Table <span className="text-blue-500  border border-[#0070FF] bg-sky-50 rounded-full px-2 text-xs">{currentTickets.length}
              </span></h2>
              <h2 className='text-sm'>Latest Reviews overviews</h2>
            </div>
            
            {(
              <div className="flex space-x-3 items-center">
              <input type="text" className='w-96 h-10 border focus:outline-none rounded-md border-gray-400 p-2 ' value={searchQuery} placeholder='Search Here ... '
                onChange={(e) => setSearchQuery(e.target.value)} />
                <button className="bg-gradient-to-r from-[#313860] to-[#151928] text-white lg:px-4 px-3 h-10 lg:py-1 flex items-center gap-2  rounded-md text-sm lg:text-base" onClick={exportPDF}><span className='md:block hidden' >Export</span> <span className='lg:text-xl text-base  '><FiUploadCloud /></span></button>
                </div>)}
              {/* <button className="bg-[#032068] text-white flex items-center gap-2 lg:px-4 px-3 py-2 lg:py-1 rounded-sm text-sm lg:text-base" onClick={searchQuery}><span className='lg:text-xl text-base  '></span><span className='md:block hidden'>Filter</span></button> */}
             
          </div>
          <div className="overflow-x-auto hidden lg:block mt-3">
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Customer Name</th>
                  <th className="border p-2">Customer ID</th>
                  {/* <th className="border p-2">Customer Email</th> */}
                  {/* <th className="border p-2">Comment</th> */}
                  <th className="border p-2">Number</th>
                  <th className="border p-2">Date</th>
                  <th className="border p-2">Status</th>
                  <th className="border p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan="8" className="p-4 text-center">Loading tickets...</td>
                  </tr>
                )}
                {error && (
                  <tr>
                    <td colSpan="8" className="p-4 text-center text-red-500">{error}</td>
                  </tr>
                )}
                {!loading && !error && currentTickets.length === 0 && (
                  <tr>
                    <td colSpan="8" className="p-4 text-center text-lg font-semibold text-blue-400">No Results found.</td>
                  </tr>
                )}
                {!loading && !error &&
                  currentTickets.map((ticket) => (
                    <tr key={ticket.helpdesk_id} className="border">
                      <td className=" border text-center">{ticket.name || "N/A"}</td>
                      <td className=" border text-center">{ticket.user_id || "N/A"}</td>
                      {/* <td className="p-2 border text-center">{ticket.email || "N/A"}</td> */}
                      {/* <td className="p-2 border ">{ticket.comment || "N/A"}</td> */}
                      <td className=" border text-center">{ticket.phoneNumber || "N/A"}</td>
                      <td className=" border text-center">{ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : "N/A"}</td>
                      <td
  className={`flex items-center gap-2 w-full pt-3  justify-center  p-2 px-3 py-1 rounded-full text-sm font-medium text-center ${
    ticket.status === "OPEN"
      ? "text-red-500"
      : ticket.status === "RESOLVED"
      ? " text-green-500"
      : ticket.status === "IN_PROGRESS"
      ? " text-yellow-500"
      : "text-gray-800"
  }`}
>
  {ticket.status === "OPEN" && <FaExclamationCircle className="text-red-500" />}
  {ticket.status === "RESOLVED" && <FaCheckCircle className=" text-green-500" />}
  {ticket.status === "IN_PROGRESS" && <FaSpinner className=" text-yellow-500 animate-spin" />}
  {!["OPEN", "RESOLVED", "IN_PROGRESS"].includes(ticket.status) && (
    <FaQuestionCircle className="text-gray-800" />
  )}
  
  {ticket.status}
</td>

                      <td className="p-2 border text-blue-600 cursor-pointer"> <button
                        className="w-full  duration-300"
                        onClick={() => navigate(`/help-dashboard/${ticket.helpdesk_id}`)}
                      > View Ticket
                      </button></td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          

          <div className="lg:hidden mt-4">
          {loading && (
            <div className=''>
              <h1 className='text-center'>Loading Please Wait</h1>
            </div>
          )}
          {error && (
            <div>
              <h1>{error}</h1>
            </div>
          )}

          {!loading && !error && currentTickets.length === 0 && (
            <div className='py-2 w-full bg-gray-100 border'>
              <h1 className='text-center text-semibold text-blue-500'>No Tickects available  .</h1>
            </div>
          )}
            {!loading && !error &&
            currentTickets.map((ticket) => (
              <div className='pb-5'>
                <div
                key={ticket.helpdesk_id}
                className="border rounded-lg p-5 bg-white  space-y-3   relative"
              >
                <button
                  onClick={() => handleDelete(ticket.helpdesk_id)}
                  className="absolute top-3 right-3 p-2 text-red-600 hover:text-red-800 transition duration-300"
                >
                  <FaTrash size={18} />
                </button>
      
                <p className="text-gray-700">
                  <strong>Name:</strong> {ticket.name || "N/A"}
                </p>
                <p className="text-gray-700">
                  <strong>ID:</strong> {ticket.user_id || "N/A"}
                </p>
                <p className="flex items-center text-gray-700">
                  <FaEnvelope className="mr-2 text-blue-600" />
                  <strong>Email:</strong> {ticket.email || "N/A"}
                </p>
                <p className="text-gray-700">
                  <strong>Subject:</strong> {ticket.comment || "N/A"}
                </p>
                <p className="text-gray-700">
                  <strong>Priority:</strong> {ticket.phoneNumber || "N/A"}
                </p>
                <p className="flex items-center text-gray-700">
                  <FaCalendarAlt className="mr-2 text-gray-500" />
                  <strong>Date:</strong>{" "}
                  {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : "N/A"}
                </p>
                <p className="flex items-center text-gray-700 ">
                  <FaTag className="mr-2" />
                  <strong>Status:</strong>
                  <span
                    className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${
                      ticket.status === "OPEN"
                        ? "bg-red-100 text-red-600"
                        : ticket.status === "RESOLVED"
                        ? "bg-green-100 text-green-600"
                        : ticket.status === "IN_PROGRESS"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {ticket.status || "N/A"}
                  </span>
                </p>
      
                <button
                  className="w-full mt-4 bg-blue-900 text-white py-2 rounded-md hover:bg-blue-800 transition duration-300"
                  onClick={() => navigate(`/help-dashboard/${ticket.helpdesk_id}`)}
                >
                  View Ticket
                </button>
              </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center lg:justify-end mt-4">
            <button
              disabled={currentPage === 1}
              className={`px-3 py-1 border rounded-l-md ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 text-white"}`}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Prev
            </button>
            <span className="px-4 py-1 border">{currentPage}</span>
            <button
              disabled={indexOfLastTicket >= filteredTickets.length}
              className={`px-3 py-1 border rounded-r-md ${indexOfLastTicket >= filteredTickets.length ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 text-white"}`}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
  )
}

export default HelpDashboard