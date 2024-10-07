import { Button } from "@nextui-org/button";
import { Modal, ModalBody, ModalContent, ModalHeader, Input } from "@nextui-org/react";
import toast from "react-hot-toast";
const DOMAIN: string = "http://localhost:5173"

interface ShareProps {
    isOpen: boolean;
    onOpenChange: () => void;
    postId: string
  }
export const ShareModal: React.FC<ShareProps> = ({
    isOpen,
    onOpenChange,
    postId,
}) =>{
    var url = `${DOMAIN}/posts/${postId}`;
    const handleCopy = () => {
    navigator.clipboard.writeText(url)
        .then(() => {
            toast.success("Đã sao chép liên kết")
        })
        .catch((err) => {
            console.error("Lỗi khi sao chép: ", err);
        });
    };
    return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
        <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex justify-center items-center">
              <div className="text-xl">Chia sẻ</div>
            </ModalHeader>
            <ModalBody>
                <div className="flex justify-between">
                    <Input className="max-w-full" value={`${url}`} contentEditable={false}/>
                    <div>
                        <Button className="px-4" onClick={handleCopy}>
                            Copy
                        </Button>
                    </div>
                </div>
            </ModalBody>
          </>
        )}
        </ModalContent>
    </Modal>
    );
}