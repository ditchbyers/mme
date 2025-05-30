import { UserButton } from "@clerk/nextjs"

export const MobileNavigation = () => {
  return (
    <div className="fixed right-0 bottom-0 left-0 z-50 h-20 bg-slate-900 lg:hidden">
      <div className="container mx-auto flex justify-between px-4 py-6 font-bold text-gray-200 uppercase">
        <div>Startseite</div>
        <div>Durchsuchen</div>
        <div>Aktivität</div>
        <UserButton />
      </div>
    </div>
  )
}
