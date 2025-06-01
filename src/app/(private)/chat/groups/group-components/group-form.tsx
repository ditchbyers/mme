'use client'
import React from 'react'
import { Button } from '@/components/ui/button'
import { UploadImageToFirebaseAndReturnUrl } from '@/helpers/image-upload'
import { UserType } from '@/interfaces'
import { UserState } from '@/redux/userSlice'
import { CreateNewChat, UpdateChat } from '@/server-actions/chats'
import { Form, Input, Upload } from 'antd'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'

export default function GroupForm({ users, initialData = null }: { users: UserType[], initialData: any }) {
    const router = useRouter()
    const { currentUserData }: UserState = useSelector((state: any) => state.user)
    const [selectedUserIds = [], setSelectedUserIds] = React.useState<string[]>(
        initialData?.users.filter((userId: string) => userId !== currentUserData?.id!) || []
    )

    const [selectedProfilePicture, setSelectedProfilePicture] = React.useState<File>()
    const [loading = false, setLoading] = React.useState<boolean>(false)

    const onFinish = async (values: any) => {
        try {
            setLoading(true)

            const payload = {
                groupName: values.groupName,
                groupBio: values.groupDescription,
                users: [...selectedUserIds, currentUserData?.id!],
                createdBy: currentUserData.name!,
                isGroupChat: true,
                groupProfilePicture: initialData?.groupProfilePicture || '',
            }

            if (selectedProfilePicture) {
                payload.groupProfilePicture = await UploadImageToFirebaseAndReturnUrl(selectedProfilePicture)
            }

            let response: any = null

            if (initialData) {

                response = await UpdateChat({
                    chatId: initialData.id,
                    payload: payload,
                })
            } else {

                response = await CreateNewChat(payload, { userId: currentUserData?.id! })
            }

            if (response?.error) throw new Error('Fehler beim Speichern des Gruppenchats')
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
                    if (user.id === currentUserData?.id) return null
                    return <div
                        key={user.id} className='flex gap-5 items-center'>
                        <input type="checkbox"
                            checked={selectedUserIds.includes(user.id)}
                            onChange={() => {
                                if (selectedUserIds.includes(user.id)) {
                                    setSelectedUserIds(selectedUserIds.filter((id) => id !== user.id))
                                } else {
                                    setSelectedUserIds([...selectedUserIds, user.id])
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
                    layout='vertical'
                    initialValues={initialData}
                >
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
                        <Button
                            type="button"
                            onClick={() => router.push('/chat')}
                        >
                            Cancel
                        </Button>
                        <Button type='submit' loading={loading}>
                            {initialData ? 'Update Group' : 'Create Group'}
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    )
}
