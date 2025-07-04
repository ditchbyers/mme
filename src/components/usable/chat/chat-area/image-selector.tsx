import { Modal, Upload } from 'antd'
import React from 'react'

/**
 * Image selector modal component for chat messages
 * Allows users to select and upload images to include in chat messages
 * 
 * @param showImageSelector - Boolean state controlling modal visibility
 * @param setShowImageSelector - State setter function to control modal visibility
 * @returns JSX element containing the image selection modal
 */
export default function ImageSelector({
    showImageSelector, setShowImageSelector
}: {
    showImageSelector: boolean
    setShowImageSelector: React.Dispatch<React.SetStateAction<boolean>>
}) {
    return (
        <Modal
            open={showImageSelector}
            onCancel={() => setShowImageSelector(false)}
            title={<span className='text-xl font-semibold text-center text-primary'>Select an Image</span>}
            centered>
            <Upload> <span className="p-5 text-xs text-gray-500"> Click to select an image</span></Upload>
        </Modal>
    )
}
