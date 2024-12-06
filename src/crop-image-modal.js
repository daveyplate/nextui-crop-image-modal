import React, { useEffect, useRef, useState } from "react"
import Compressor from "compressorjs"
import AvatarEditor from "react-avatar-editor"

import {
    Button,
    Slider,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalProps
} from "@nextui-org/react"

/**
 * @typedef {Object} CropModalLocalization
 * @property {string} [header="Crop Image"] - The header text of the modal
 * @property {string} [cancel="Cancel"] - The text of the cancel button
 * @property {string} [confirm="Confirm"] - The text of the confirm button
 */

export const defaultLocalization = {
    header: "Crop Image",
    cancel: "Cancel",
    confirm: "Confirm"
}

/**
 * Displays a modal to crop an image
 * 
 * @typedef {object} CropImageModalProps
 * @property {File} imageFile - The image file to crop
 * @property {(file: File) => void} setImageFile - Set the image file
 * @property {object} imageSize - The desired size of the image to crop, with width and height
 * @property {number} imageSize.width - The width of the image
 * @property {number} imageSize.height - The height of the image
 * @property {("sm"| "md" | "lg" | "xl" | "full" | "none")} [imageRadius="sm"] - The border radius of the image
 * @property {(croppedImage: File) => void} onConfirm - Callback with the cropped image file
 * @property {(error: Error) => void} onError - Callback when an error occurs
 * @property {CropModalLocalization} [localization] - The localization of the modal
 * 
 * @param {CropImageModalProps & ModalProps} props
 * @returns {JSX.Element}
 */
export function CropImageModal({
    imageFile,
    setImageFile,
    imageSize,
    imageRadius = "md",
    onConfirm,
    onError,
    localization = {},
    ...props
}) {
    localization = { ...defaultLocalization, ...localization }

    const [imageScale, setImageScale] = useState(1)
    const editor = useRef(null)

    const maxImageWidth = 256
    const calculatedHeight = maxImageWidth / imageSize?.width * imageSize?.height

    const calculatedRadius = {
        sm: maxImageWidth / 32,
        md: maxImageWidth / 16,
        lg: maxImageWidth / 8,
        xl: maxImageWidth / 4,
        full: maxImageWidth / 2,
        none: 0
    }[imageRadius]

    useEffect(() => setImageScale(1), [imageFile])

    const handleConfirm = async () => {
        const canvas = editor.current.getImage()

        // Convert the canvas blob to a file, then compress it
        canvas.toBlob(blob => {
            const blobFile = new File([blob], "blob.jpg", { type: "image/jpeg" })

            new Compressor(blobFile, {
                maxWidth: imageSize.width,
                maxHeight: imageSize.height,
                resize: "cover",
                mimeType: "image/jpeg",
                success: async (compressedFile) => {
                    onConfirm && onConfirm(compressedFile)
                    setImageFile(null)
                },
                error(error) {
                    console.error(error)
                    onError && onError(error)
                    setImageFile(null)
                }
            })
        }, 'image/jpeg')
    }

    return (
        <Modal
            isOpen={!!imageFile}
            onOpenChange={() => setImageFile(null)}
            placement="center"
            {...props}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader>
                            {defaultLocalization.header}
                        </ModalHeader>

                        <ModalBody className="items-center gap-4">
                            <AvatarEditor
                                className="rounded-xl"
                                borderRadius={calculatedRadius}
                                ref={editor}
                                image={imageFile}
                                width={maxImageWidth}
                                height={calculatedHeight}
                                scale={imageScale}
                            />

                            <Slider
                                color="foreground"
                                aria-label="Image Scale"
                                className="w-[306px]"
                                value={imageScale}
                                maxValue={3}
                                minValue={1}
                                step={0.01}
                                onChange={(value) => setImageScale(value)}
                            />
                        </ModalBody>

                        <ModalFooter>
                            <Button variant="light" onPress={onClose}>
                                {defaultLocalization.cancel}
                            </Button>

                            <Button
                                onPress={handleConfirm}
                                color="primary"
                            >
                                {defaultLocalization.confirm}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}