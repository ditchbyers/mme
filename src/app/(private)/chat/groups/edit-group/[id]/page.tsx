import React from 'react'

import Link from 'next/link'
import GroupForm from '../../group-components/group-form'
import { GetChatDataById } from '@/server-actions/chats'


async function EditGroup
  ({ params }: { params: Promise<{ id: string }> }) {
  const {id} =  await params

  const chat = await GetChatDataById(id)
  

  return (
    <div className='p-5'>
      <Link className='text-primary border border-primary px-5 py-2 no-underline border-solid text-sm' href="/chat">
        Back to Chats
      </Link>
      <h1 className="text-primary text-xl font-bold py-2 uppercase mt-5">
        Create Group Chat
      </h1>

      <GroupForm
        initialData={JSON.parse(JSON.stringify(chat))}
      />


    </div>
  )
}

export default EditGroup