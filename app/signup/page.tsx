"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FiUser, FiMail, FiLock, FiPhone } from "react-icons/fi"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [color, setColor] = useState("#4CAF50") // Default color
  const [isloading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    if (password !== confirmPassword) {
      alert("Passwords do not match")
      setIsLoading(false)
      return
    }
    const response = fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        password,
        color: color,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert(data.error)
          setIsLoading(false)
          return
        }
        if (data) {
          localStorage.setItem("token", data.token)
          localStorage.setItem("user", JSON.stringify(data.user))
        }
        router.push("/chats")
        setIsLoading(false)
      })
      .catch((error) => {
        console.error("Error:", error)
        alert("An error occurred. Please try again.")
        setIsLoading(false)
      })

    }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center text-white text-2xl font-bold">
              P
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Create an account</CardTitle>
          <CardDescription className="text-center">Enter your details to create your Periskope account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                    <FiUser />
                  </div>
                  <Input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                    <FiMail />
                  </div>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                    <FiPhone />
                  </div>
                  <Input
                    type="tel"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                    <FiLock />
                  </div>
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                    <FiLock />
                  </div>
                  <Input
                    type="password"
                    placeholder="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                  </div>
                  <select name="color" id="color" className="pl-10 w-full h-11 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600" value={color} onChange={(e) => setColor(e.target.value)}>
                    <option value="#4CAF50">Green</option>
                    <option value="#FF5733">Red</option>
                    <option value="#33A1FF">Blue</option>
                    <option value="#FFC300">Yellow</option>
                    <option value="#DAF7A6">Light Green</option>
                    <option value="#C70039">Dark Red</option>
                    <option value="#900C3F">Dark Pink</option>
                    <option value="#581845">Purple</option>
                  </select>
                </div>
              </div>
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                {isloading ? "Creating..." : "Create Account"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-green-600 hover:text-green-700 font-medium">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
