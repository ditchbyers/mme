import Link from 'next/link'
import React from 'react'
import GroupForm from '../group-components/group-form'
import { GetAllUsers } from '@/server-actions/users'


async function CreateGroupPage
  () {
  const {users} = await GetAllUsers()

  return (
    <div className='p-5'>
      <Link className='text-primary border border-primary px-5 py-2 no-underline border-solid text-sm' href="/chat">
        Back to Chats
      </Link>
      <h1 className="text-primary text-xl font-bold py-2 uppercase mt-5">
        Create Group Chat
      </h1>

      <GroupForm initialData={null} />


    </div>
  )
}

export default CreateGroupPage