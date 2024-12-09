export { default } from 'next-auth/middleware'

export const config = {
  matcher: [
    '/escolas/:path*',
    '/alunos/:path*',
    '/professores/:path*',
    '/turmas/:path*',
    '/perfil/:path*',
    '/'
  ]
}
