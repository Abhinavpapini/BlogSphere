"use client"

import { createContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
export const userAuthorContextObj = createContext()

function UserAuthorContext({ children }) {
  const [currentUser, setCurrentUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    profileImageUrl: "",
    role: "",
  })

  const navigate = useNavigate()

  useEffect(() => {
    const userInStorage = localStorage.getItem("currentuser")
    if (userInStorage) {
      const user = JSON.parse(userInStorage)
      if (user.blocked) {
        alert("Your account is blocked. Please contact admin.")
        localStorage.clear()
        navigate("/signin")
      } else {
        setCurrentUser(user)
      }
    }
  }, [])

  return (
    <userAuthorContextObj.Provider value={{ currentUser, setCurrentUser }}>{children}</userAuthorContextObj.Provider>
  )
}

export default UserAuthorContext

