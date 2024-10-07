import { connect, useFormik } from "formik";
import * as Yup from "yup";

import toast, { Toaster } from 'react-hot-toast';
import { Avatar, Input, Modal, ModalBody, ModalContent, ModalHeader, Textarea } from "@nextui-org/react";
import { title } from "./primitives";
import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import "../styles/input-file.css"
import { Button } from "@nextui-org/button";
import { IoMdImages } from "react-icons/io";
import { FiXCircle } from "react-icons/fi";
import { FaCircleXmark, FaX } from "react-icons/fa6";
import { CREATEPOST } from "@/api/Post";
import { Post } from "@/interface/post";

interface CreatePostProps {
    isOpen: boolean;
    onOpenChange: () => void;
    setPosts: Dispatch<SetStateAction<Post[]>>;
  }
  
export const CreatePost: React.FC<CreatePostProps> = ({
    isOpen,
    onOpenChange,
    setPosts,
}) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const [isReady, setIsReady] = useState<boolean>(false);
    const [onLoading, setOnLoading] = useState<boolean>(false);
  
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const uploadFiles = Array.from(event.target.files as FileList);
        let filesToSelect: File[] = [...selectedFiles];
        let previews: string[] = [...imagePreviews];
    
        uploadFiles.forEach((file) => {
        //   const isDuplicate = filesToSelect.some(selectedFile => selectedFile.name === file.name);
    
        //   if (isDuplicate) {
        //     toast("A file with this name already exists. It will be replaced.",{
        //         duration: 5000
        //     });;
            
        //     // Remove the existing duplicate file and its preview
        //     const duplicateIndex = filesToSelect.findIndex(selectedFile => selectedFile.name === file.name);
        //     if (duplicateIndex !== -1) {
        //       filesToSelect.splice(duplicateIndex, 1);
        //       previews.splice(duplicateIndex, 1); // Remove corresponding preview
        //     }
        //   }
    
          // Read file for preview
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) {
              previews.push(e.target.result as string);
              setImagePreviews(previews);
            }
          };
          reader.readAsDataURL(file);
    
          // Add the new file
          filesToSelect.push(file);
        });
    
        setSelectedFiles(filesToSelect);
      };
  
    const onChooseFile = () => {
      if (inputRef.current) {
        inputRef.current.click();
      }
    };
  
    const removeImage = (index: number) => {
      const newFiles = [...selectedFiles];
      const newPreviews = [...imagePreviews];
  
      // Remove the file and its preview
      newFiles.splice(index, 1);
      newPreviews.splice(index, 1);
  
      setSelectedFiles(newFiles);
      setImagePreviews(newPreviews);
    };

    const handleChangeContent = (content: string) =>{
        if (content.length > 0){
            setIsReady(true);
        } else {
            setIsReady(false);
        }
        formik.setFieldValue("Content", content);
    }

    const formik = useFormik({
        initialValues: {
          Content: "",
        },
        validationSchema: Yup.object({
        }),
        onSubmit: async (values: any) => {
          setOnLoading(true);
          var formData = new FormData();
          for (const param in values) {
            if (values[param]) {
                formData.append(param, values[param]);
            }
          }
          selectedFiles.forEach((file, index) => {
            formData.append(`Attachment`, file);
          });
          // Toast for login process
          toast.promise(callAPICreatePost(formData, localStorage.token), {
            loading: "Đang đăng bài viết...",
            success: <b>Đăng bài viết thành công!</b>,
            error: (err) => <b>{err.message || 'Có lỗi xảy ra khi đăng bài viết.'}</b>,
          });
          async function callAPICreatePost(createReq: FormData, token: string) {
            try {
              const response = await CREATEPOST({
                CreateReq: createReq,
                token: token,
              });
          
              if (response.isSuccess && 'data' in response.res!) {
                const successResponse = response.res.data;
                setOnLoading(false);
                setPosts(prevPosts => [successResponse, ...prevPosts]); // Add the new post to the state
                closeModal();
                return successResponse;
              } else if ('message' in response.res!) {
                const errorResponse = response.res as { message: string };
                setOnLoading(false);
                if(errorResponse.message == "You are banned from posting due to violate of terms!"){
                  errorResponse.message = "Bạn đã bị cấm đăng bài do vi phạm tiêu chuẩn cộng đồng";
                }
                throw new Error(errorResponse.message); // Ném lỗi để toast xử lý
              } else {
                setOnLoading(false);
                throw new Error("Không thể đăng nhập!"); // Lỗi chung
              }
            } catch (error: any) {
              setOnLoading(false);
              throw new Error(error.message || "Có lỗi xảy ra");
            }
          }
        },
    });

    function closeModal(){
      formik.resetForm();
      setSelectedFiles([]);
      setImagePreviews([])
      onOpenChange(); // Close the modal after submission
    }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex justify-center items-center">
              <div className="text-xl">Tạo bài viết</div>
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between">
                  <div className="flex items-start justify-start">
                    <Avatar
                      className="avatar-size"  // Thêm class cho Avatar
                      name={
                        localStorage.avatar
                          ? undefined
                          : localStorage.name || undefined
                      }
                      src={localStorage.avatar || undefined}
                    />
                    <div className="flex flex-col">
                      <span className="ml-2">{localStorage.name}</span>
                    </div>
                  </div>
                </div>
                <form onSubmit={formik.handleSubmit}>
                  <Textarea
                    name="Content"
                    placeholder={`${localStorage.getItem("name")} ơi, bạn đang nghĩ gì thế?`}
                    style={{
                      fontSize: "1.25rem",
                      lineHeight: "1.75rem",
                      padding: "0",
                    }}
                    value={formik.values.Content}
                    onChange={(event) => handleChangeContent(event.target.value)}
                  />
                  {selectedFiles.length > 0 ? (
                    <div>
                        <input
                        ref={inputRef}
                        multiple
                        accept="image/jpeg, image/png, image/gif, image/svg+xml" 
                        style={{ display: "none" }}
                        type="file"
                        onChange={handleFileChange}
                        />
                        <div className="flex justify-end mt-4">
                        <button
                            type="button"
                            onClick={onChooseFile}
                        >
                            Thêm Hình Ảnh
                        </button>
                        </div>
                        <div className="flex flex-wrap justify-center mt-2">
                        {imagePreviews.map((preview, index) => (
                            <div key={index} className="relative m-2">
                                <img src={preview} alt={`preview-${index}`} className="w-32 h-32 object-cover" />
                                <button
                                    className="absolute top-0 right-0 text-xl text-gray-600 rounded-full p-1 hover:text-red-600"
                                    onClick={() => removeImage(index)}
                                >
                                    <FaCircleXmark />
                                </button>
                            </div>
                        ))}
                        </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-center mt-4">
                        <input
                          ref={inputRef}
                          multiple
                          accept="image/jpeg, image/png, image/gif, image/svg+xml" 
                          style={{ display: "none" }}
                          type="file"
                          onChange={handleFileChange}
                        />
                        <div
                          className="bg-[#27272a] bg-transparent min-w-full min-h-full py-20 border-0 rounded-md flex justify-center items-center hover:bg-[#3a3a3d]"
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
                    </>
                  )}
                  <Button
                    type="submit"
                    isLoading={onLoading}
                    disabled={selectedFiles.length != 0 && !isReady}
                    className={`w-full ${(selectedFiles.length != 0 && isReady) || isReady ? "bg-primary": null } mt-4`}
                  >
                    Đăng
                  </Button>
                </form>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}