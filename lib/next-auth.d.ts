import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: "ADMIN" | "TEACHER" | "DIRECTOR" | "USER"
    }

    backendTokens: {
      accessToken: string
      refreshToken: string
      expiresIn: number
    }
  }
}

import 'next-auth/jwt'

declare module 'next-auth/jwt' {
  interface JWT {
    user: {
      id: string
      email: string
      name: string
      role: "ADMIN" | "TEACHER" | "DIRECTOR" | "USER"
    }

    backendTokens: {
      accessToken: string
      refreshToken: string
      expiresIn: number
    }
  }
}
