'use client'
import { Button } from '@/components/ui/button'
import { UploadImageToFirebaseAndReturnUrl } from '@/helpers/image-upload'
import { UserType } from '@/interfaces'
import { UserState } from '@/redux/userSlice'
import { CreateNewChat } from '@/server-actions/chats'
import { Form, Input, Upload } from 'antd'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useSelector } from 'react-redux'

export default function GroupForm({ users }: { users: UserType[] }) {
    const router = useRouter()
    const { currentUserData }: UserState = useSelector((state: any) => state.user)
    const [selectedUserIds = [], setSelectedUserIds] = React.useState<string[]>([])
    const [selectedProfilePicture, setSelectedProfilePicture] = React.useState<File>()
    const [loading = false, setLoading] = React.useState<boolean>(false)

    const onFinish = async (values: any) => {
        try {
            setLoading(true)
            const payload = {
                groupName: values.groupName,
                groupBio: values.groupDescription,
                users: [...selectedUserIds, currentUserData?._id!],
                createdBy: currentUserData?._id!,
                isGroupChat: true,
                groupProfilePicture: '',
            }

            if (selectedProfilePicture) {
                payload.groupProfilePicture = await UploadImageToFirebaseAndReturnUrl(selectedProfilePicture)
            }

            const response = await CreateNewChat(payload)
            if (response.error) throw new Error('Error creating group chat')
            console.log('Group chat created successfully', response)
            router.refresh()
            router.push('/chat')


        } catch (error) {
            console.log(error)
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='grid grid-cols-2'>
            <div className='flex flex-col gap-5'>
                <span className='text-gray-500 text-sm uppercase mt-3'>
                    Select users
                </span>
                {users.map((user) => {
                    if (user._id === currentUserData?._id) return null
                    return <div
                        key={user._id} className='flex gap-5 items-center'>
                        <input type="checkbox"
                            checked={selectedUserIds.includes(user._id)}
                            onChange={() => {
                                if (selectedUserIds.includes(user._id)) {
                                    setSelectedUserIds(selectedUserIds.filter((id) => id !== user._id))
                                } else {
                                    setSelectedUserIds([...selectedUserIds, user._id])
                                }
                            }}
                        />
                        <img src={user.profilePicture} alt="avatar" className='w-10 h-10 rounded-full' />
                        <span className='text-gray-500 text-sm'>
                            {user.name}
                        </span>
                    </div>
                })}
            </div>
            <div>
                <Form
                    onFinish={onFinish}
                    layout='vertical'>
                    <Form.Item
                        label="Group Name"
                        name="groupName"
                        rules={[{ required: true, message: 'Please input group name!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Group Description"
                        name="groupDescription">
                        <Input.TextArea />
                    </Form.Item>

                    <Upload
                        beforeUpload={(file) => {
                            setSelectedProfilePicture(file)
                            return false
                        }}
                        maxCount={1}
                        listType='picture-card'>
                        <span className='text-gray-500 text-xs p-3'>
                            Upload Group Picture
                        </span>
                    </Upload>

                    <div className='flex justify-end gap-2'>
                        <Button>
                            Cancel
                        </Button>
                        <Button>
                            Create Group
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    )
}
