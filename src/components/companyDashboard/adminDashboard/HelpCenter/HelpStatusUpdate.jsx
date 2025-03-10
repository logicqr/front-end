import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Nav from "../../Nav";
import axiosInstance from "../../../auth/axios";

const statusOptions = ["OPEN", "IN_PROGRESS", "RESOLVED"];

const HelpStatusUpdate = () => {
    const navigate = useNavigate();

    const { id } = useParams();
    // console.log(id)
    const [ticket, setTicket] = useState({});
    // const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [loading,setLoading] = useState(false)
    //     const comment = ticket.comment
    //     console.log("cmt",comment)
    //   console.log(ticket.comment)
    useEffect(() => {
        getTicket();
    }, []);

    const getTicket = async () => {
        
        try {
            const response = await axiosInstance.get(`/users-help-center/${id}`);
            // console.log("dei amnga", response.data.particularTicket)
            const ticketData = response.data.particularTicket;
            
            setTicket(ticketData);
            // console.log(response)
            setStatus(ticketData.status);
            setSelectedStatus(ticketData.status);
        } catch (err) {
            setError(err.response?.data?.message);
        }
        finally {
            // setLoading(false);
        }
    };

    const handleStatusChange = (e) => {
        setSelectedStatus(e.target.value);
    };

    const updateStatus = async () => {
        setLoading(true)
        setTicket((prevTicket) => ({
            ...prevTicket,
            status: selectedStatus,
        }));
        setStatus(selectedStatus);
        try {
            await axiosInstance.put(`/users-help-center/${id}/status`, { status: selectedStatus });
          
        } catch (error) {
            console.error("Error updating status", error);
        }finally{
            setLoading(false);
        }
    };
   

    // if (loading) return <p className="text-center text-lg font-semibold mt-6">Loading ticket details...</p>;
    if (error) return <p className="text-red-500 text-center text-lg font-semibold mt-6">{error}</p>;
    // if (!ticket) return <p className="text-red-500 text-center text-lg font-semibold mt-6">Please wait....</p>;

    return (
        <div >
            {/* <Nav/> */}
            <div className=" pl-16 container mx-auto">
                <div className="lg:w-[80%] w-[90%] mx-auto pt-8 ">
                    <div className="bg-white  rounded-md lg:p-6 p-3 border border-gray-200">
                        <div className="flex flex-col sm:flex-row justify-between items-center border-b pb-4">
                            <h2 className="md:text-2xl text-base font-bold text-gray-900">Ticket #{ticket.helpdesk_id}</h2>
                            <div className="flex items-center space-x-3 mt-4 sm:mt-0 w-full md:w-fit">
                                <select
                                    className="border px-3 py-2 w-full rounded-md text-gray-700 focus:ring-2 focus:ring-blue-500"
                                    value={selectedStatus}
                                    onChange={handleStatusChange}
                                    disabled={status === "RESOLVED"}
                                >
                                    {statusOptions.map((option) => (
                                        <option key={option} value={option}
                                            disabled={
                                                (status === "OPEN" && option === "OPEN") ||
                                                (status === "IN_PROGRESS" && (option === "OPEN" || option === "IN_PROGRESS")) ||
                                                (status === "RESOLVED")
                                            }
                                        >
                                            {option}
                                        </option>
                                    ))}
                                </select>

                            </div>
                        </div>

                        <p className="text-gray-500 text-sm mt-4">Posted at {new Date(ticket.createdAt).toLocaleTimeString()}</p>

                        <div className="mt-6 p-4 bg-gray-100 border rounded-lg">
                            <h3 className="text-lg font-medium">Ticket Information</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                                <div>
                                    <p className="text-gray-600 text-sm">Customer Name</p>
                                    <input type="text" value={ticket.name} className="w-full px-3 py-2 border rounded-lg bg-white text-gray-800" disabled />
                                </div>
                                <div>
                                    <p className="text-gray-600 text-sm">Email</p>
                                    <input type="text" value={ticket.email} className="w-full px-3 py-2 border rounded-lg bg-white text-gray-800" disabled />
                                </div>
                                <div>
                                    <p className="text-gray-600 text-sm">Status</p>
                                    <div className="w-full px-3 py-2 border rounded-lg bg-white flex items-center">
                                        <span className={`h-3 w-3 rounded-full inline-block mr-2 ${status === "OPEN" ? "bg-red-500" :
                                            status === "IN_PROGRESS" ? "bg-yellow-500" :
                                                status === "RESOLVED" ? "bg-green-500" : "bg-gray-500"
                                            }`}></span>
                                        <span className="text-gray-800 font-semibold">{ticket.status || selectedStatus }</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4">
                                <p className="text-gray-600 text-sm">Ticket Description</p>
                                <textarea
                                    className="w-full p-3 border rounded-lg bg-white text-gray-800"
                                    rows="4"
                                    disabled
                                    value={ticket.comment}
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex flex-col sm:flex-row justify-between gap-2 lg:gap-4">
                            <button className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition w-full sm:w-auto" onClick={() => navigate(-1)}>
                                Go Back
                            </button>
                            <button
                                className="bg-gradient-to-r from-[#313860] to-[#151928] text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                                onClick={updateStatus}
                                disabled={selectedStatus === status || status === "RESOLVED"}
                            >
                                {loading?'Updating...':'Update'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpStatusUpdate;
