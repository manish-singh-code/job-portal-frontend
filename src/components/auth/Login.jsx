import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axiosInstance from "../../utils/axios/axiosInstance";
import {toast} from "sonner"
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "../../redux/authSlice";
import { Loader2 } from "lucide-react";




const Login = () => {
  const {loading} = useSelector(state=> state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [role, setRole] = useState("student");
  const [input,setInput] = useState({
    email: "",
    password: "",
    role: "student",
  });
  console.log(loading)

  const handleChange = (e) => { 
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
   try {
    dispatch(setLoading(true));
    if(!input.email && !input.password){
      console.log("alsfjaslfjasfljsaflkj;s")
      toast.warning("Please fill all the details")
      dispatch(setLoading(false));
      return;
    }
    if(!input.email){
      toast.warning("Please provide Email")
      dispatch(setLoading(false));
      return;
    }
    if(!input.password){
      toast.warning("Please provide Password")
      dispatch(setLoading(false));
      return; 
    }
    if(input.password.length < 6){
      toast.warning("Password should be atleast 6 characters")
      dispatch(setLoading(false));
      return;
    }

    const res = await axiosInstance.post("/api/user/login", input,{
      headers : 
      {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    console.log(res);
    if (res.status === 200) {
      console.log("Login Success");
      toast.success(`${res.data.message}`)
      dispatch(setUser(res.data.user));
      navigate("/");
    } else {
      toast.error(`${res.data.message}`);
    }
   } catch (error) {
     if(error.response.status === 400){
       toast.error("Sorry account not exist")
     }
      if(error.response.status === 401){
        toast.error("Invalid Password")
      }
      if(error.response.status === 402){
        toast.error("User Account does not exist with this role")
      }
    
   }
   finally{
    dispatch(setLoading(false));
   }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-blue-200 via-red-200 to-green-200 flex justify-center items-start pt-10 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-xl opacity-95 h-auto">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="relative w-7 h-6">
            {/* Blue circle on top */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-[#0000FF] opacity-80 z-30"></div>

            {/* Red circle on bottom left */}
            <div className="absolute bottom-0 left-0 w-4 h-4 rounded-full bg-[#FF0000] opacity-80 z-20"></div>

            {/* Green circle on bottom right */}
            <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-[#00FF00] opacity-80 z-10"></div>
          </div>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800">
            Find Talent or Dream Job at{" "}
            <span className="text-[#FF0000]">JobNest</span>
          </h1>
        </div>

        <div className="grid gap-4">
          <div>
            <Label className="text-gray-700">Email</Label>
            <Input
              onChange = {handleChange}
              name="email"
              type="email"
              placeholder="eg: john@gmail.com"
              className="mt-1 border-gray-200 focus:ring-2 focus:ring-green-100 focus:border-green-400"
            />
          </div>
          <div>
            <Label className="text-gray-700">Password</Label>
            <Input
              type="password"
              name="password"
              onChange={handleChange}
              placeholder="Enter your password"
              className="mt-1 border-gray-200 focus:ring-2 focus:ring-green-100 focus:border-green-400"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mt-6">
          <div className="flex-1">
            <Label className="text-gray-700">Login as:</Label>
            <RadioGroup
              value={role}
              onValueChange={setRole}
              direction="row"
              name="role"
              onChange={handleChange}
              className="flex space-x-4 mt-5"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="student" id="student" />
                <Label htmlFor="student" className="text-gray-600">
                  Job Seeker
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="recruiter" id="recruiter" />
                <Label htmlFor="recruiter" className="text-gray-600">
                  Recruiter
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <Button disabled={loading}
          type="submit"
          className="w-full mt-6 bg-[#22C55E] hover:bg-[#35b435] text-white font-medium py-2.5"
        >
        {loading ?   <>
          <Loader2 className=" animate-spin" />
          <span>Loading....</span>
        </> : "Login"}
      
        </Button>

        <div className="mt-6 text-center">
          <span className="text-gray-600">
            New here? Create an account and{" "}
            <Link
              to="/signup"
              className="text-[#0000FF] hover:underline font-medium"
            >
              join us!
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
};

export default Login;
