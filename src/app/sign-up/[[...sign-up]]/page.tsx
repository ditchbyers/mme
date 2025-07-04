import { SignUp } from '@clerk/nextjs'

/**
 * Sign-up page component
 * Renders the Clerk SignUp component with centered layout
 * 
 * @returns JSX element containing the sign-up interface
 */
export default function Page() {
  return (
  <div className="flex justify-center items-center min-h-screen">
    <SignUp />
    </div>
  );
}