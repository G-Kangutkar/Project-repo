import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login (){
    const { login } = useAuth(); 
    const [inputData, setInputData] = useState({

        email:'',
        password:""
    });
    const navigate = useNavigate();
    const handleInputs = (e)=>{
        const {name,value} = e.target;

        setInputData(prev=>({
            ...prev, [name]:value
        }))
    }
    const handleSubmit = async(e)=>{
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:6800/api/auth/login',inputData);
            console.log('Full response:', response.data);
            console.log('Login successful!', response.data);
            alert('Login successfully!');
            const { accessToken, id } = response.data;
            login({ id, email: inputData.email }, accessToken);
            // const token = response?.data?.accessToken;
            // console.log('Extracted token:', token);
            // localStorage.setItem('token',token);
            navigate('/account')
        } catch (error) {
            console.log('error at handling login form submission',error.message)
        }
    }

    return (
         <div >
            <div >

            
        <form onSubmit={handleSubmit} >
            <h2 >Login Form</h2>
            
            <input type="email" name="email" value={inputData.email} placeholder="Enter emaiil" onChange={handleInputs} />
            <input type="password" name="password" value={inputData.password} placeholder="Enter password" onChange={handleInputs} /><br />
            <div >
                 <button  type="submit">Login</button>
            </div>
        </form>
        </div>
        </div>
    )
}
export default Login;
