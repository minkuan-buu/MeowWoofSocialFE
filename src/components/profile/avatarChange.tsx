import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { Button } from "@nextui-org/react";
import { IoMdImages } from "react-icons/io";
import { FaCircleXmark } from "react-icons/fa6";
import { UPDATEAVATAR } from "@/api/User";

interface AvatarChangeProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

export const AvatarChange: React.FC<AvatarChangeProps> = ({
  isOpen,
  onOpenChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [onLoading, setOnLoading] = useState(false);
  const isReady = Boolean(imagePreview);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);

      // Create a preview
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImagePreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const onChooseFile = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
  };
  
  function CloseModal() {
    onOpenChange();
    removeImage();
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={CloseModal} size="xl">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex justify-center items-center">
              <div className="text-xl">Thay đổi ảnh đại diện</div>
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  // Add submit logic here
                  setOnLoading(true);
                  // Simulate an upload or API call
                  var avatarReq = new FormData();
                  avatarReq.append("Avartar", selectedFile ? selectedFile : "");
                  const result = await UPDATEAVATAR({ avatarReq, token: localStorage.token });
                  if (result.isSuccess) {
                    console.log(result.res);
                    setOnLoading(false);
                    localStorage.setItem("avatar", result.res ? result.res.data.avatar : "");
                    CloseModal();
                  } else {
                    console.error(result.res);
                  }
                }}>
                  {imagePreview ? (
                    <div>
                      <input
                        ref={inputRef}
                        accept="image/jpeg, image/png"
                        style={{ display: "none" }}
                        type="file"
                        onChange={handleFileChange}
                      />
                      <div className="flex justify-end mt-4">
                        <div
                          className="cursor-pointer"
                          onMouseDownCapture={onChooseFile}
                        >
                          Thay đổi hình ảnh
                        </div>
                      </div>
                      <div className="flex flex-wrap justify-center mt-2">
                        <div className="relative m-2">
                          <img
                            src={imagePreview}
                            alt="preview"
                            className="w-64 h-64 object-cover"
                          />
                          <div
                            className="absolute top-0 right-0 text-xl text-gray-600 rounded-full p-1 hover:text-red-600"
                            onClick={removeImage}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                removeImage();
                              }
                            }}
                          >
                            <FaCircleXmark />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-center mt-4">
                      <input
                        ref={inputRef}
                        accept="image/jpeg, image/png"
                        style={{ display: "none" }}
                        type="file"
                        onChange={handleFileChange}
                      />
                      <div
                        className="bg-[#27272a] min-w-full min-h-full py-20 border-0 rounded-md flex justify-center items-center hover:bg-[#3a3a3d]"
                        onMouseDownCapture={onChooseFile}
                      >
                        <div className="flex flex-col items-center text-center">
                          <div className="flex items-center mb-4">
                            <IoMdImages style={{ fontSize: "60px" }} />
                          </div>
                          <div className="text-md">
                            Chọn hình ảnh bạn muốn tải lên
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <Button
                    type="submit"
                    isLoading={onLoading}
                    disabled={!isReady}
                    className={`w-full ${isReady ? "bg-primary" : ""} mt-4`}
                  >
                    Cập nhật
                  </Button>
                </form>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
