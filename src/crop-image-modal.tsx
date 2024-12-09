import { useEffect, useRef, useState } from "react"
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

interface CropModalLocalization {
    header?: string
    cancel?: string
    confirm?: string
}

export const defaultLocalization: CropModalLocalization = {
    header: "Crop Image",
    cancel: "Cancel",
    confirm: "Confirm"
}

interface CropImageModalProps {
    imageFile: File | null
    setImageFile: (file: File | null) => void
    imageSize: {
        width: number
        height: number
    }
    imageRadius?: "sm" | "md" | "lg" | "xl" | "full" | "none"
    onConfirm?: (croppedImage: File) => void
    onError?: (error: Error) => void
    localization?: CropModalLocalization
}

/**
 * Displays a modal to crop an image
 * 
 * @param {CropImageModalProps} props
 * @param {File} props.imageFile - The image file to crop
 * @param {(file: File) => void} props.setImageFile - Set the image file
 * @param {object} props.imageSize - The desired size of the image to crop, with width and height
 * @param {number} props.imageSize.width - The width of the image
 * @param {number} props.imageSize.height - The height of the image
 * @param {("sm"| "md" | "lg" | "xl" | "full" | "none")} [props.imageRadius="md"] - The border radius of the image
 * @param {(croppedImage: File) => void} [props.onConfirm] - Callback with the cropped image file
 * @param {(error: Error) => void} [props.onError] - Callback when an error occurs
 * @param {CropModalLocalization} [props.localization] - The localization of the modal
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
}: CropImageModalProps & ModalProps) {
    localization = { ...defaultLocalization, ...localization }

    const [imageScale, setImageScale] = useState(1)
    const editor = useRef<AvatarEditor>(null)

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
        const canvas = editor.current?.getImage()

        // Convert the canvas blob to a file, then compress it
        canvas?.toBlob((blob) => {
            if (!blob) return
            const blobFile = new File([blob], "blob.jpg", { type: "image/jpeg" })

            new Compressor(blobFile, {
                maxWidth: imageSize.width,
                maxHeight: imageSize.height,
                resize: "cover",
                mimeType: "image/jpeg",
                success: async (compressedFile) => {
                    if (onConfirm) onConfirm((compressedFile as File))
                    setImageFile(null)
                },
                error(error) {
                    console.error(error)
                    if (onError) onError(error)
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
                            {localization.header}
                        </ModalHeader>

                        <ModalBody className="items-center gap-4">
                            <AvatarEditor
                                className="rounded-xl"
                                borderRadius={calculatedRadius}
                                ref={editor}
                                image={imageFile || ""}
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
                                onChange={(value) => setImageScale((value as number))}
                            />
                        </ModalBody>

                        <ModalFooter>
                            <Button variant="light" onPress={onClose}>
                                {localization.cancel}
                            </Button>

                            <Button
                                onPress={handleConfirm}
                                color="primary"
                            >
                                {localization.confirm}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}