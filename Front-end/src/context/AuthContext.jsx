import React, { createContext } from 'react'


export const authDataContext = createContext();

const AuthContext = ({children}) => {
    const serverUrl = "https://linkedin-clone-backend-iogf.onrender.com"
    let value = {
        serverUrl
    }
    return (
    <div>
        <authDataContext.Provider value={value}>

        {children}
        </authDataContext.Provider>
    
    </div>
  )
}

export default AuthContext