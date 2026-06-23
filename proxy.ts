import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
const isProtectedRoute = createRouteMatcher([
  '/((?!$).*)',
])
//significa: cualquier path que empiece con / pero que NO sea solo / (el (?!$) 
// excluye el fin de string). Así / es público y /organizadores, /pedidos, etc. 
// requieren login.

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect()
  }
})
export const config = {
  matcher: [
    // Ignora archivos estáticos y Next internals
    '/((?!_next|[^?]\\.(?:html?|css|js(?!on)|png|jpg|svg|ico)).*)',
    // Ejecuta también en APIs
    '/(api|trpc)(.*)',
  ],
}