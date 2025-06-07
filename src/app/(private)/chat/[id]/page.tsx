export default async function GameDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const chatInfo = await fetch(`https://revenant.lyrica.systems/chat/${id}`, {
    method: "GET",
    headers: {
      "X-Session-Token": "_dev_skip_auth_roy",
    },
  })

  return (

    <>
    <div className="mx-auto mb-36 max-w-[96rem] space-y-5 p-6"> // /chat/[id]
        <div className="hidden lg:flex"></div> // chatliste 
        <div className="flex"></div> // chat
    </div>

    <div className="mx-auto mb-36 max-w-[96rem] space-y-5 p-6"> // /chat
        <div className="flex"></div> // chatliste
        <div className="hidden lg:flex"></div> // chat
    </div>
    </>
  )
}
