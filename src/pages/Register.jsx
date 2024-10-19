import { useUserApi } from "../services/userService";
import { ImSpinner } from "react-icons/im";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { checkLogin } from "../utils/loginAction";


function Register() {
    const [loading,setLoading] = useState(false)
    const navigate = useNavigate();
    const dispatch=useDispatch();

    const { createUser } = useUserApi()

    const handleSubmit= async(e)=>{
        e.preventDefault();
        const username = e.target[0].value
        const password = e.target[1].value
        const name = e.target[2].value
        const birthdate = e.target[3].value
        const address = e.target[4].value
        const phone_number = e.target[5].value
        setLoading(true)
        const response = await createUser({username, password, name, birthdate, address, phone_number})
        setLoading(false)
        console.log(response)
        if(response?.id){
            dispatch(checkLogin(true))
            setTimeout(() => {
                toast.success("Đăng kí thành công")
            });
            navigate('/login')
        }
        else{
            toast.error(response.detail)
        }
    }
    return ( 
        <div className="w-full h-full flex justify-center items-center mt-12">
            <div>
            <ToastContainer />
            <form onSubmit={handleSubmit} className="w-[450px] h-[420px] shadow-md flex flex-col bg-slate-50 rounded overflow-hidden gap-3">
                <div className="w-full flex justify-center items-center text-2xl font-bold bg-cyan-900 text-slate-200 h-16">
                    Register
                </div>
                <div className="flex flex-col p-4 gap-3">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="text-base text-slate-700 font-semibold">Username</div>
                            <input className="w-full p-2 rounded focus:outline-slate-200 bg-slate-200" required placeholder="Username" />
                        </div>
                        <div>
                            <div className="text-base text-slate-700 font-semibold">Password</div>
                            <input className="w-full p-2 rounded focus:outline-slate-200 bg-slate-200" required placeholder="Password" type="password" />
                        </div>
                        <div>
                            <div className="text-base text-slate-700 font-semibold">Full Name</div>
                            <input className="w-full p-2 rounded focus:outline-slate-200 bg-slate-200" required placeholder="Full Name" />
                        </div>
                        <div>
                            <div className="text-base text-slate-700 font-semibold">Birthdate</div>
                            <input className="w-full p-2 rounded focus:outline-slate-200 bg-slate-200" required placeholder="Birthdate" type="date" />
                        </div>
                        <div>
                            <div className="text-base text-slate-700 font-semibold">Address</div>
                            <input className="w-full p-2 rounded focus:outline-slate-200 bg-slate-200" required placeholder="Address" />
                        </div>
                        <div>
                            <div className="text-base text-slate-700 font-semibold">Phone Number</div>
                            <input className="w-full p-2 rounded focus:outline-slate-200 bg-slate-200" required placeholder="Phone Number" />
                        </div>
                    </div>
                    <div className="w-full h-12">
                        <button 
                            type="submit" 
                            disabled={loading}
                            className={`w-full h-full flex justify-center items-center mt-4 p-3 bg-cyan-900
                                        text-slate-200 hover:bg-cyan-700 active:scale-[.98] ${loading && "disabled:bg-slate-500 cursor-not-allowed"}`}>
                            {loading && <ImSpinner className="animate-spin" />} &nbsp; Đăng ký 
                        </button>
                    </div>
                </div>
            </form>
            </div>
        </div>
     );
}

export default Register;