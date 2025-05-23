import UserModel from '@/models/user-model'
import { Group } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import GroupForm from '../group-components/group-form'
import { UserType } from '@/interfaces'

export async function CreateGroupPage
  () {
  const users: UserType[] = await UserModel.find({})

  return (
    <div className='p-5'>
      <Link className='text-primary border border-primary px-5 py-2 no-underline border-solid text-sm' href="../">
        Back to Chats
      </Link>
      <h1 className="text-primary text-xl font-bold py-2 uppercase">
        Create Group Chat
      </h1>

      <GroupForm users={JSON.parse(JSON.stringify(users))} />


    </div>
  )
}
