"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function LoginPage() {
  const [emailorPhone, setEmailorPhone] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // In a real app, we would authenticate with Supabase here
    const response = fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        emailorPhone,
        password,
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
      })
    
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <Card className="w-[400px]">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-bold">P</span>
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Periskope</CardTitle>
          <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form onSubmit={handleLogin}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Input
                  id="text"
                  type="text"
                  placeholder="EmailorPhone"
                  value={emailorPhone}
                  onChange={(e) => setEmailorPhone(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                {isLoading ? "Loading..." : "Login"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="text-sm text-gray-500 text-center">
            Don't have an account?{" "}
            <Link href="/signup" className="text-green-600 hover:text-green-700">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
