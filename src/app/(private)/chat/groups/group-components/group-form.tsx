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
import { GetAllUsers } from '@/server-actions/users'

export default function GroupForm({ initialData = null }: { initialData: any }) {
    const router = useRouter()
    const [users, setUsers] = React.useState<UserType[]>([])
    const { currentUserData }: UserState = useSelector((state: any) => state.user)
    const [selectedUserIds = [], setSelectedUserIds] = React.useState<string[]>(
        (initialData?.users || [])
            .map((user: any) => typeof user === 'string' ? user : user.id)
            .filter((userId: string) => userId !== currentUserData?.id!)
    )

    const [selectedProfilePicture, setSelectedProfilePicture] = React.useState<File>()
    const [loading = false, setLoading] = React.useState<boolean>(false)
    console.log(users, 'users')

    const getUsers = async () => {
        try {
            setLoading(true)
            const response = await GetAllUsers()
            if (response.error) throw new Error("No user found")
            console.log(response, 'response')
            setUsers(response)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const onFinish = async (values: any) => {
        try {
            setLoading(true)
            const payload = {
                groupName: values.groupName,
                groupBio: values.groupDescription,
                users: [...selectedUserIds, currentUserData?.id!],
                createdBy: currentUserData.id!,
                isGroupChat: true,
                groupProfilePicture: initialData?.groupProfilePicture || '',
            }
            const payloadUpdated = {
                groupName: values.groupName,
                groupBio: values.groupDescription,
                users: [...selectedUserIds, currentUserData?.id!],
                groupProfilePicture: initialData?.groupProfilePicture || '',
            }

            if (selectedProfilePicture) {
                payload.groupProfilePicture = await UploadImageToFirebaseAndReturnUrl(selectedProfilePicture)
            }

            let response: any = null

            if (initialData) {
                console.log("payload", payloadUpdated)
                response = await UpdateChat({
                    chatId: initialData.id,
                    payload: payloadUpdated,
                    currentUserId: { userId: currentUserData?.id! },
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

    React.useEffect(() => {
        getUsers()
    }, [])

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
