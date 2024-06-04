import { useContext, useState } from "react"
import { Link, Navigate } from "react-router-dom"
import axios from 'axios';
import { UserContext } from "../UserContext";

const LoginPage =()=>{
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('')
    const [redirect,setRedirect]=useState(false)
   const {setUser}=useContext(UserContext)
    async function handleLoginSubmit(ev){
       ev.preventDefault();
       try{
       const {data}= await axios.post('http://localhost:8000/login',{email,password})
       localStorage.setItem("user", JSON.stringify(data));
       setUser(data)
        alert('Login Successful')

        setRedirect(true)
       }catch(e){
        alert('Login Failed')
       }
    }
    if(redirect)
    {
        return <Navigate to={'/'}/>
    }

return(
    <><div className="h-screen flex justify-center items-center">
       <div className="mb-64">
       <h1 className="text-4xl text-center mb-4">Login</h1>
        <form className="max-w-md mx-auto" onSubmit={handleLoginSubmit}>
           
            <input type="email" placeholder="your@email.com" value={email} onChange={ev=>setEmail(ev.target.value)}/>
            <input type="password" placeholder="password" value={password} onChange={ev=>setPassword(ev.target.value)}/>
            <button type="submit" className="primary">Login</button>
            <div className="text-center py-2 text-gray-500">Don't have an account yet? <Link className="underline text-black" to={'/register'}>Register now</Link></div>
        </form>

       </div>
        
        </div></>
)
}
export default LoginPage 