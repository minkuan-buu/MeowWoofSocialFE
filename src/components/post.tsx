import { connect, useFormik } from "formik";
import * as Yup from "yup";

import toast, { Toaster } from 'react-hot-toast';
import { Avatar, Input, Modal, ModalBody, ModalContent, ModalHeader, Textarea, useDisclosure } from "@nextui-org/react";
import { title } from "./primitives";
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import "../styles/input-file.css"
import { Button } from "@nextui-org/button";
import { IoMdImages } from "react-icons/io";
import { FiXCircle } from "react-icons/fi";
import { FaCircleXmark, FaX } from "react-icons/fa6";
import { CREATEPOST, DELETEPOST, UPDATEPOST } from "@/api/Post";
import { DeletePostReq, Post } from "@/interface/post";
import { HiDotsHorizontal } from "react-icons/hi";
import { CommentForm } from "./comment";
import { FaRegCommentAlt, FaShareSquare } from "react-icons/fa";
import { AiOutlineLike } from "react-icons/ai";
import { LikeButton } from "./likeButton";
import { calculateTimeDifference } from "./func/postFunc";
import { ShareModal } from "./share";
import { FeelingGUI } from "@/interface/feeling";
import Logout from "./logout";
import { ThreeDot } from "react-loading-indicators";

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
          // var contentUnicodeEscape = convertToUnicodeEscape(values.Content);
          // console.log(contentUnicodeEscape);
          var hashtags = extractHashtags(values.Content);
          hashtags.forEach((hashtag) => {
            formData.append(`HashTag`, hashtag);  // Đổi thành HashTag thay vì Hashtags
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
                if(response.statusCode === 401) {
                  Logout();
                  throw new Error("Phiên đăng nhập đã hết hạn!");
                } else {
                  const errorResponse = response.res as { message: string };
                  setOnLoading(false);
                  if(errorResponse.message == "You are banned from posting due to violate of terms!"){
                    errorResponse.message = "Bạn đã bị cấm đăng bài do vi phạm tiêu chuẩn cộng đồng";
                  }
                  throw new Error(errorResponse.message); // Ném lỗi để toast xử lý
                }
              } else {
                setOnLoading(false);
                throw new Error("Không thể đăng bài viết!"); // Lỗi chung
              }
            } catch (error: any) {
              setOnLoading(false);
              throw new Error(error.message || "Có lỗi xảy ra");
            }
          }
        },
    });

    function extractHashtags(content: string | null): string[] {
      if (!content) return [];
      // Biểu thức chính quy để nhận diện hashtag
      const hashtags = content.match(/#[^\s!@#$%^&*()=+.\/,\[{\]};:'"?><]+/g);
      return hashtags || []; // Trả về mảng hashtag hoặc mảng rỗng nếu không có hashtag nào
    }
    
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
                        <div
                          className="cursor-pointer"
                          onMouseDownCapture={onChooseFile}
                        >
                            Thêm Hình Ảnh
                        </div>
                        </div>
                        <div className="flex flex-wrap justify-center mt-2">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative m-2">
                            <img src={preview} alt={`preview-${index}`} className="w-32 h-32 object-cover" />
                            <div
                                className="absolute top-0 right-0 text-xl text-gray-600 rounded-full p-1 hover:text-red-600"
                                onMouseDownCapture={() => removeImage(index)}
                            >
                                <FaCircleXmark />
                            </div>
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

interface PostDetailPopupProps {
  isOpen: boolean;
  onOpenChange: () => void;
  post: Post;
  emojiPost: {[key: string]: FeelingGUI | null};
  setEmojiPost: Dispatch<SetStateAction<{
    [key: string]: FeelingGUI | null;
  }>>
}

export const PostDetailPopup: React.FC<PostDetailPopupProps> = ({
  isOpen,
  onOpenChange,
  post,
  emojiPost,
  setEmojiPost
}) => {
  const {
    isOpen: isOpenShare,
    onOpen: onOpenShare,
    onOpenChange: onOpenChangeShare,
  } = useDisclosure();
  const [sharePostId, setSharePostId] = useState<string>("");
  const Share = (postId: string) => {
    setSharePostId(postId);
    onOpenShare();
  }
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex justify-center">
              <span>Bài viết của {post.author.name}</span>
            </ModalHeader>
            <ModalBody className="overflow-y-auto max-h-[80vh]"> {/* Thêm max-height để đảm bảo modal không chiếm hết không gian */}
              <div className="flex flex-col gap-4">
                <div className="flex justify-between">
                  <div className="flex items-start justify-start">
                    <Avatar
                      className="avatar-size"
                      name={post.author.avatar ? undefined : post.author.name || undefined}
                      src={post.author.avatar || undefined}
                    />
                    <div className="flex flex-col">
                      <span className="ml-2">{post.author.name}</span>
                      <span className="ml-2 text-xs text-gray-400">
                        {calculateTimeDifference(post.createAt)}
                      </span>
                    </div>
                  </div>
                  <HiDotsHorizontal />
                </div>
                <div>{post.content}</div>
                {post.attachments.length > 0 && (
                  <div className="flex flex-col">
                    <img src={post.attachments[0].attachment} alt="" className="w-full h-auto" />
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {post.attachments.slice(1).map((attachment, index) => (
                        <div key={index} className="relative">
                          <img src={attachment.attachment} alt="" className="w-full h-40 object-cover rounded" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <div>Lượt thích</div>
                  <div>{post.comment.length} bình luận</div>
                </div>
                <div className="flex flex-col gap-1">
                  <hr className="border-gray-500" />
                  <div className="flex flex-row w-full items-center">
                    <LikeButton postId={post.id} emojiPost={emojiPost} setEmojiPost={setEmojiPost}/>
                    <hr className="vertical-hr bg-gray-500" />
                    <div className="flex flex-row items-center py-1 px-12 hover:bg-[#e5dfca] hover:text-[#102530] hover:rounded-md transition-all">
                      <FaRegCommentAlt />
                      <span className="ml-2 select-none">Bình luận</span>
                    </div>
                    <hr className="vertical-hr bg-gray-500" />
                    <div className="flex flex-row items-center py-1 px-12 hover:bg-[#e5dfca] hover:text-[#102530] hover:rounded-md transition-all" onMouseDownCapture={() => Share(post.id)}>
                      <ShareModal isOpen={isOpenShare} onOpenChange={onOpenChangeShare} postId={post.id}/>
                      <FaShareSquare />
                      <span className="ml-2 select-none">Chia sẻ</span>
                    </div>
                  </div>
                  <hr className="border-gray-500" />
                  <div className="flex flex-row justify-start mt-2">
                    <Avatar
                      className="avatar-size select-none w-[40px] h-[40px]"
                      name={localStorage.getItem("avatar") ? undefined : localStorage.getItem("name") || undefined}
                      src={localStorage.getItem("avatar") || undefined}
                    />
                    <div className="flex flex-col w-11/12">
                      <CommentForm postId={post.id} />
                    </div>
                  </div>
                  {post.comment && (
                    <>
                      {post.comment.map((comment) => (
                        <div className="relative grid grid-cols-10 mt-2" key={comment.id}>
                          <div className="col-span-1">
                            <Avatar
                              className="avatar-size select-none w-[40px] h-[40px]"
                              name={comment.author.avatar ? undefined : comment.author.name || undefined}
                              src={comment.author.avatar || undefined}
                            />
                          </div>
                          <div className="col-span-9 h-fit">
                            {comment.content ? (
                              <div className="flex flex-row justify-start items-center max-w-full">
                                <div 
                                  className="px-4 py-2 rounded-3xl" 
                                  style={{
                                    backgroundColor: "#3a3b3c",
                                    maxWidth: "85%",
                                    whiteSpace: "normal",
                                    overflowWrap: "break-word",
                                    wordWrap: "break-word",
                                  }}
                                >
                                  <span className="text-sm">{comment.author.name}</span>
                                  <p className="text-sm">{comment.content}</p>
                                </div>
                                <HiDotsHorizontal className="ml-2" />
                              </div>
                            ) : (
                              <div className="flex flex-row justify-start items-center">
                                <span className="text-sm">{comment.author.name}</span>
                                <HiDotsHorizontal className="ml-2" />
                              </div>
                            )}
                            {comment.attachment && (
                              <img
                                src={comment.attachment}
                                alt={`CommentAttachment-${comment.id}`}
                                className="mt-1 max-w-full h-auto rounded-3xl"
                                style={{
                                  maxHeight: "65%",
                                  maxWidth: "65%"
                                }}
                              />
                            )}
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

interface UpdatePostProps {
  isOpen: boolean;
  onOpenChange: () => void;
  setPosts: Dispatch<SetStateAction<Post[]>>;
  currentPost: Post;
}
  
export const UpdatePost: React.FC<UpdatePostProps> = ({
    isOpen,
    onOpenChange,
    setPosts,
    currentPost,
}) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const inputRef = useRef<HTMLInputElement>(null);
    const [isReady, setIsReady] = useState<boolean>(false);
    const [onLoading, setOnLoading] = useState<boolean>(false);
    
    const formik = useFormik({
      initialValues: {
        Content: "",
      },
      validationSchema: Yup.object({
      }),
      onSubmit: async (values: any) => {
        setOnLoading(true);
        var formData = new FormData();
        formData.append("Id", currentPost.id);
        for (const param in values) {
          if (values[param]) {
              formData.append(param, values[param]);
          }
        }
        selectedFiles.forEach((file, index) => {
          formData.append(`Attachments`, file);
        });
        // var contentUnicodeEscape = convertToUnicodeEscape(values.Content);
        // console.log(contentUnicodeEscape);
        var hashtags = extractHashtags(values.Content);
        hashtags.forEach((hashtag) => {
          formData.append(`HashTag`, hashtag);  // Đổi thành HashTag thay vì Hashtags
        });
        // Toast for login process
        toast.promise(callAPICreatePost(formData, localStorage.token), {
          loading: "Đang chỉnh sửa bài viết...",
          success: <b>Chỉnh sửa bài viết thành công!</b>,
          error: (err) => <b>{err.message || 'Có lỗi xảy ra khi chỉnh sửa bài viết.'}</b>,
        });
        async function callAPICreatePost(createReq: FormData, token: string) {
          try {
            const response = await UPDATEPOST({
              CreateReq: createReq,
              token: token,
            });
        
            if (response.isSuccess && 'data' in response.res!) {
              const successResponse = response.res.data;
              setOnLoading(false);
              setPosts((prevPosts) => 
                prevPosts.map(post => 
                  post.id === currentPost.id ? { ...post, ...successResponse } : post
                )
              );

              //setPosts(prevPosts => [successResponse, ...prevPosts]); // Add the new post to the state
              closeModal();
              return successResponse;
            } else if ('message' in response.res!) {
              if(response.statusCode === 401) {
                Logout();
                throw new Error("Phiên đăng nhập đã hết hạn!");
              } else {
                const errorResponse = response.res as { message: string };
                setOnLoading(false);
                if(errorResponse.message == "You are banned from posting due to violate of terms!"){
                  errorResponse.message = "Bạn đã bị cấm do vi phạm tiêu chuẩn cộng đồng";
                }
                throw new Error(errorResponse.message); // Ném lỗi để toast xử lý
              }
            } else {
              setOnLoading(false);
              throw new Error("Không thể chỉnh sửa bài viết!"); // Lỗi chung
            }
          } catch (error: any) {
            setOnLoading(false);
            throw new Error(error.message || "Có lỗi xảy ra");
          }
        }
      },
    });

    const getMimeTypeFromUrl = (url: string): string => {
      const extension = url.split('.').pop()?.toLowerCase();
      switch (extension) {
        case 'jpg':
        case 'jpeg':
          return 'image/jpeg';
        case 'png':
          return 'image/png';
        case 'gif':
          return 'image/gif';
        case 'svg':
          return 'image/svg+xml';
        default:
          return 'application/octet-stream'; // MIME type mặc định
      }
    };

    // Đẩy URL của hình ảnh vào imagePreviews
    const getFileNameFromUrl = (url: string): string => {
      // Lấy tên file từ cuối đường dẫn URL
      return url.split('/').pop() || 'unknown';
    };
    
    const urlToFile = async (url: string, filename: string) => {
      const response = await fetch(url);
      const blob = await response.blob();
      const mimeType = getMimeTypeFromUrl(url); // Xác định MIME type từ URL
      return new File([blob], filename, { type: mimeType });
    };
    
    const convertUrlsToFiles = async (urls: string[]) => {
      const files = await Promise.all(
        urls.map(url => urlToFile(url, getFileNameFromUrl(url))) // Gọi với chỉ filename
      );
      setSelectedFiles(prev => [...prev, ...files]); // Thêm file vào selectedFiles
      setIsLoading(true);
    };

    useEffect(() => {
      if (!isOpen) return;
      formik.setValues({
        Content: currentPost.content,
      });
      if (currentPost.content.length > 0){
        setIsReady(true);
      }
      if(currentPost.attachments.length === 0) return setIsLoading(false);
      // Sau khi khai báo hàm, bạn có thể sử dụng nó
      const existingImages = currentPost.attachments.map(att => att.attachment);
      setImagePreviews(existingImages);
      convertUrlsToFiles(existingImages);
    }, [isOpen]);
  
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

    function extractHashtags(content: string | null): string[] {
      if (!content) return [];
      // Biểu thức chính quy để nhận diện hashtag
      const hashtags = content.match(/#[^\s!@#$%^&*()=+.\/,\[{\]};:'"?><]+/g);
      return hashtags || []; // Trả về mảng hashtag hoặc mảng rỗng nếu không có hashtag nào
    }
    
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
              <div className="text-xl">Chỉnh sửa bài viết</div>
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
                        <div
                          className="cursor-pointer"
                          onMouseDownCapture={onChooseFile}
                        >
                            Thêm Hình Ảnh
                        </div>
                        </div>
                        <div className="flex flex-wrap justify-center mt-2">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative m-2">
                            <img src={preview} alt={`preview-${index}`} className="w-32 h-32 object-cover" />
                            <div
                                className="absolute top-0 right-0 text-xl text-gray-600 rounded-full p-1 hover:text-red-600"
                                onMouseDownCapture={() => removeImage(index)}
                            >
                                <FaCircleXmark />
                            </div>
                          </div>
                        ))}
                        </div>
                    </div>
                  ) : (
                    <>
                      {isLoading ? (
                        <div className="flex justify-center py-2">
                          <ThreeDot color="#e5dfca" size="medium" text="" textColor="" />
                        </div>
                      ) : (
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
                      )}
                    </>
                  )}
                  <Button
                    type="submit"
                    isLoading={onLoading}
                    disabled={selectedFiles.length != 0 && !isReady && isLoading}
                    className={`w-full ${selectedFiles.length != 0 && !isReady && isLoading ? "cursor-not-allowed" : "bg-primary" } mt-4`}
                  >
                    Chỉnh sửa
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

interface DeletePostProps {
  isOpen: boolean;
  onOpenChange: () => void;
  setPosts: Dispatch<SetStateAction<Post[]>>;
  currentPost: Post;
}

export const DeletePost: React.FC<DeletePostProps> = ({
  isOpen,
  onOpenChange,
  setPosts,
  currentPost,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  var DeleteReq: DeletePostReq = {
    postId: currentPost.id,
  };
  function DeletePost (){
    setIsLoading(true);
    toast.promise(callAPIDeletePost(DeleteReq, localStorage.token), {
      loading: "Đang đăng bài viết...",
      success: <b>Đăng bài viết thành công!</b>,
      error: (err) => <b>{err.message || 'Có lỗi xảy ra khi đăng bài viết.'}</b>,
    });
  
    async function callAPIDeletePost(DeleteReq: DeletePostReq, token: string) {
      try {
        const response = await DELETEPOST({
          DeleteReq: DeleteReq,
          token: token,
        });
    
        if (response.isSuccess && 'message' in response.res!) {
          setIsLoading(false);
          setPosts(prevPosts => prevPosts.filter(post => post.id !== currentPost.id));
          onOpenChange();
        } else if ('message' in response.res!) {
          if(response.statusCode === 401) {
            Logout();
            throw new Error("Phiên đăng nhập đã hết hạn!");
          } else {
            const errorResponse = response.res as { message: string };
            setIsLoading(false);
            if(errorResponse.message == "You are banned from posting due to violate of terms!"){
              errorResponse.message = "Bạn đã bị cấm do vi phạm tiêu chuẩn cộng đồng";
            }
            throw new Error(errorResponse.message); // Ném lỗi để toast xử lý
          }
        } else {
          setIsLoading(false);
          throw new Error("Không thể xóa bài viết!"); // Lỗi chung
        }
      } catch (error: any) {
        setIsLoading(false);
        throw new Error(error.message || "Có lỗi xảy ra");
      }
    }
  }
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex justify-center items-center">
              <div className="text-xl">Xóa bài viết</div>
            </ModalHeader>
            <ModalBody>
              <p>Bạn có chắc chắn muốn xóa bài viết này không?</p>
              <div className="flex justify-end gap-2">
                <Button color="danger" isLoading={isLoading} onClick={DeletePost}>Xóa</Button>
                <Button onClick={onClose} isDisabled={isLoading}>Hủy</Button>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}