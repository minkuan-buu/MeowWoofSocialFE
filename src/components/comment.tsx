import { useFormik } from 'formik';
import { Textarea } from '@nextui-org/react'; // Hoặc component textarea bạn đang sử dụng
import { toast } from 'react-hot-toast';
import { CREATECOMMENT } from '@/api/Comment';
import { useRef, useState } from 'react';
import { IoMdImages } from 'react-icons/io';
import { IoSend } from 'react-icons/io5';
import { FaCircleXmark } from 'react-icons/fa6';

export const CommentForm = ({
  postId,
}: {
  postId: string;
}) => {
  const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: File | null }>({});
  const [imagePreviews, setImagePreviews] = useState<{ [key: string]: string | null }>({});
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const [isReady, setIsReady] = useState<boolean>(false);

  const removeImage = (postId: string) => {
    // Xóa file đã chọn và hình ảnh xem trước
    setImagePreviews((prevPreviews) => {
        const updatedPreviews = { ...prevPreviews };
        delete updatedPreviews[postId]; // Xóa hình ảnh của postId tương ứng
        return updatedPreviews; // Cập nhật lại trạng thái với ảnh đã bị xóa
    });

    setSelectedFiles((prevFiles) => {
        const updatedFiles = { ...prevFiles };
        delete updatedFiles[postId]; // Xóa file đã chọn của postId tương ứng
        return updatedFiles; // Cập nhật lại trạng thái file đã chọn
    });

    // Đặt lại giá trị của input về null
    if (inputRefs.current[postId]) {
        inputRefs.current[postId].value = '';  // Reset lại giá trị của input
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, postId: string) => {
    const uploadFiles = Array.from(event.target.files as FileList);

    if (uploadFiles.length > 0) {
      const file = uploadFiles[0]; // Chỉ lấy tệp đầu tiên

      // Đọc tệp để xem trước hình ảnh
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
            setImagePreviews(prev => ({
                ...prev,
                [postId]: e.target?.result as string // Lưu hình ảnh xem trước theo postId
            }));
        }
      };
      reader.readAsDataURL(file);
      console.log(postId);
      console.log(selectedFiles);
      console.log(imagePreviews);
      // Lưu file đã chọn theo postId
      setSelectedFiles(prev => ({
          ...prev,
          [postId]: file
      }));
    }
  };

  const formik = useFormik({
    initialValues: { content: '' }, // Khởi tạo giá trị của textarea
    onSubmit: async (values, { resetForm }) => {
      const NewComment = new FormData();
      NewComment.append("PostId", postId); // Thêm PostId vào FormData

      // Thêm nội dung vào FormData
      if (values.content) {
        NewComment.append("Content", values.content);
      }

      // Thêm file đính kèm nếu nó tồn tại
      if (selectedFiles[postId]) {
        NewComment.append("Attachment", selectedFiles[postId] as Blob);
      }

      // Gọi API và xử lý phản hồi
      await toast.promise(callAPICreateComment(NewComment, localStorage.token), {
        loading: "Đang đăng bình luận...",
        success: <b>Đăng bình luận thành công!</b>,
        error: (err) => <b>{err.message || 'Có lỗi xảy ra khi đăng bình luận.'}</b>,
      });

      // Reset form sau khi gửi bình luận
      resetForm();
      removeImage(postId); // Xóa hình ảnh tương ứng
    },
  });

  async function callAPICreateComment(CommentReq: FormData, token: string) {
    try {
      const response = await CREATECOMMENT({
        CommentReq: CommentReq,
        token: token,
      });

      if (response.isSuccess && 'data' in response.res!) {
        return response.res.data;
      } else if ("message" in response.res!) {
        const errorResponse = response.res as { message: string };
        throw new Error(errorResponse.message);
      } else {
        throw new Error("Không thể đăng bình luận!");
      }
    } catch (error: any) {
      throw new Error(error.message || "Có lỗi xảy ra");
    }
  }

  const handleChangeContent = (value: string) => {
    // Kiểm tra và cập nhật trạng thái sẵn sàng
    if (value.trim().length > 0) {
      setIsReady(true);
    } else {
      setIsReady(false);
    }

    formik.setFieldValue("content", value);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Textarea
        className="ml-2"
        name="content"
        value={formik.values.content}
        onChange={(e) => handleChangeContent(e.target.value)}
        placeholder="Nhập bình luận"
        onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (isReady || selectedFiles[postId] != null || !formik.isSubmitting) {
                formik.handleSubmit(); // Truyền cả postId và index
            }
        }
        }}
        minRows={1}
        maxRows={5}
        style={{ resize: "none", whiteSpace: "pre-wrap" }}
        endContent={(
        <div className="flex flex-row gap-3">
            <input
                ref={(el) => (inputRefs.current[postId] = el)}
                accept="image/jpeg, image/png, image/gif, image/svg+xml"
                style={{ display: "none" }}
                type="file"
                onChange={(event) => handleFileChange(event, postId)} // Truyền postId vào hàm
            />
            <div onMouseDownCapture={() => inputRefs.current[postId]?.click()} style={{ cursor: 'pointer' }} className="flex items-center">
                <IoMdImages style={{ fontSize: "20px" }} />
            </div>
            <button
                type="submit"
                disabled={!selectedFiles[postId] && !isReady}
                // onClick={() => formik.handleSubmit}
                className={`flex items-center ${!selectedFiles[postId] && !isReady ? 'cursor-not-allowed opacity-50' : ''}`}
            >
                <IoSend />
            </button>
        </div>
        )}
    />
    {/* Hiển thị hình preview dưới Textarea chỉ cho post hiện tại */}
    {imagePreviews[postId] && (
        <div className="relative mt-2 ml-2">
        <span className="text-sm">Xem trước hình đính kèm bình luận của bạn</span>
        {/* Nút xóa hình ảnh xem trước */}
        <button
            className="absolute top-6 right-0 text-xl text-gray-600 rounded-full p-1 hover:text-red-600"
            onClick={() => removeImage(postId)}
        >
            <FaCircleXmark />
        </button>

        {/* Hình xem trước */}
        <img 
            src={imagePreviews[postId]!}  // Lấy hình ảnh theo postId
            alt="Hình xem trước" 
            className="max-w-full h-auto rounded"
        />
        </div>
    )}
    </form>
  );
};

