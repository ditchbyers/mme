import { SignIn } from '@clerk/nextjs'

/**
 * Sign-in page component
 * Renders the Clerk SignIn component with centered layout
 * 
 * @returns JSX element containing the sign-in interface
 */
export default function Page() {
  return (
  <div className="flex justify-center items-center min-h-screen">
    <SignIn />
  </div>
  );
}