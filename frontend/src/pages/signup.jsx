import { useState } from "react";
import axios from "axios";
import { useNavigate,Link } from "react-router-dom";

function Signup (){

    const [inputData, setInputData] = useState({
        name:'',
        email:'',
        password:"",
        balance:''
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
            const response = await axios.post('http://localhost:6800/api/auth/signup',inputData);
            console.log('Signup successful!', response.data);
            alert('Account created successfully!');
            navigate('/login')
        } catch (error) {
            console.log('error at handling form submission',error.message)
        }
    }

    return (
        <div >
            <div >

           
        <form onSubmit={handleSubmit} >
            <h2>Signup Form</h2>
            <input type="text" name="name" value={inputData.name} placeholder="Enter name" onChange={handleInputs}/>  <br />
            <input type="email" name="email" value={inputData.email} placeholder="Enter emaiil" onChange={handleInputs} /><br />
            <input type="password" name="password" value={inputData.password} placeholder="Enter password" onChange={handleInputs} /><br />
            <input type="text" name="balance" value={inputData.balance} placeholder="Enter balance" onChange={handleInputs} /> <br />
            <Link to="/login" style={{color:"blue"}}>already have a account? Login</Link>
            <div >
                 <button  type="submit">Signup</button>
            </div>
           
        </form>

         </div>
        </div>
    )
}
export default Signup;
