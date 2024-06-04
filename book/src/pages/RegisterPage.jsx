import { useState } from "react"
import { Link } from "react-router-dom"
import axios from 'axios';
const RegisterPage =()=>{
    const [name,setName]=useState('');
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('')
    
    async function registerUser(ev){
        ev.preventDefault();
        try{
            await axios.post('http://localhost:8000/register',{
                name,
                email,
                password,
               })
               alert('Registration sucessful.Now you can log in');
        }catch(e){
            alert('Registration failed try again')
        }
      
    }
return(
    <><div className="h-screen flex justify-center items-center">
       <div className="mb-64">
       <h1 className="text-4xl text-center mb-4">Register</h1>
        <form className="max-w-md mx-auto" onSubmit={registerUser}>
             <input type="text" placeholder="Enter Name" value={name} onChange={ev=>setName(ev.target.value)}/>
            <input type="email" placeholder="your@email.com" value={email} onChange={ev=>setEmail(ev.target.value)}/>
            <input type="password" placeholder="password" value={password} onChange={ev=>setPassword(ev.target.value)}/>
            <button type="submit" className="primary">Register</button>
            <div className="text-center py-2 text-gray-500">Already a member? <Link className="underline text-black" to={'/login'}>Login</Link></div>
        </form>

       </div>
        
        </div></>
)
}
export default RegisterPage;