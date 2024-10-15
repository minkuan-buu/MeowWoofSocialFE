import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { button as buttonStyles } from "@nextui-org/theme";

import { Avatar, Button, Card, CardBody, CardHeader, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Image, Input, Textarea, useDisclosure } from "@nextui-org/react";
import { ourServices, siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import DefaultLayout from "@/layouts/default";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import '../styles/status-bar.css';
import { TbDotsVertical } from "react-icons/tb";
import { AiOutlineLike } from "react-icons/ai";
import { FaCommentAlt, FaRegBookmark, FaRegCommentAlt, FaShareSquare } from "react-icons/fa";
import NonFooterLayout from "@/layouts/non-footer";
import { NEWSFEED } from "@/api/Post";
import { ThreeDot } from "react-loading-indicators";
import toast, { Toaster } from "react-hot-toast";
import { FiXCircle } from "react-icons/fi";
import EmojiPicker, { EmojiClickData, EmojiStyle } from 'emoji-picker-react';
import { CustomEmoji } from "emoji-picker-react/dist/config/customEmojiConfig";
import { CreatePost, DeletePost, PostDetailPopup, UpdatePost } from "@/components/post";
import { Post } from "@/interface/post";
import { ShareModal } from "@/components/share";
import { IoSend, IoWarningOutline } from "react-icons/io5";
import { IoMdImages } from "react-icons/io";
import { FaCircleXmark } from "react-icons/fa6";
import { CREATECOMMENT } from "@/api/Comment";
import { useFormik } from "formik";
import { CommentForm } from "@/components/comment";
import { HiDotsHorizontal } from "react-icons/hi";
import { LikeButton } from "@/components/likeButton";
import { calculateTimeDifference } from "@/components/func/postFunc";
import { FeelingGUI } from "@/interface/feeling";
import Logout from "@/components/logout";
import { MdDelete, MdEdit } from "react-icons/md";

interface newFeedPost{
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  content: string,
  attachments: {
    id: string;
    attachment: string;
  }[],
  hashtags: {
    id: string;
    hashtag: string;
  }[],
  status: string,
  feeling: {
    id: string;
    typeReact: string;
    author: {
      id: string;
      name: string;
      avatar: string;
    },
  }[],
  comment: {
    id: string;
    content: string;
    attachment: string;
    author: {
      id: string;
      name: string;
      avatar: string;
    };
    createdAt: Date;
    updatedAt: Date;
  }[],
  createAt: Date,
  updatedAt: Date
}[];

const PostCard: React.FC<{ post: Post, emojiPost: {[key: string]: FeelingGUI | null}, setEmojiPost: Dispatch<SetStateAction<{
  [key: string]: FeelingGUI | null;
}>>, setPosts: Dispatch<SetStateAction<Post[]>> }> = ({ post, emojiPost, setEmojiPost, setPosts }) => {
  const { isOpen: isOpenPostPopup, onOpen: onOpenPostPopup, onOpenChange: onOpenChangePostPopup } = useDisclosure();
  const {
    isOpen: isOpenShare,
    onOpen: onOpenShare,
    onOpenChange: onOpenChangeShare,
  } = useDisclosure();
  const {
    isOpen: isOpenDeletePost,
    onOpen: onOpenDeletePost,
    onOpenChange: onOpenChangeDeletePost,
  } = useDisclosure();
  const {
    isOpen: isOpenUpdatePost,
    onOpen: onOpenUpdatePost,
    onOpenChange: onOpenChangeUpdatePost,
  } = useDisclosure();
  const [sharePostId, setSharePostId] = useState<string>("");
  const Share = (postId: string) => {
    setSharePostId(postId);
    onOpenShare();
  }
  return (
    <Card key={post.id}>
      <CardBody>
        <div className="flex flex-col gap-4">
          {/* Post Author & Time */}
          <div className="flex justify-between">
            <div className="flex items-start justify-start">
              <Avatar
                className="avatar-size"
                name={post.author.name}
                src={post.author.avatar || undefined}
              />
              <div className="flex flex-col">
                <span className="ml-2">{post.author.name}</span>
                <span className="ml-2 text-xs text-gray-400">
                  {/* Replace this with your time calculation */}
                  {calculateTimeDifference(post.createAt)}
                </span>
              </div>
            </div>
            <UpdatePost isOpen={isOpenUpdatePost} onOpenChange={onOpenChangeUpdatePost} setPosts={setPosts} currentPost={post}/>
            <DeletePost isOpen={isOpenDeletePost} onOpenChange={onOpenChangeDeletePost} currentPost={post} setPosts={setPosts}/>
            <Dropdown>
              <DropdownTrigger>
              <Button className="!w-10 !h-10 !min-w-0 !p-0 bg-transparent hover:bg-gray-400 !rounded-full transition-all duration-300 flex items-center justify-center">
                <HiDotsHorizontal style={{ width: "15px", height: "15px" }} />
              </Button>
              </DropdownTrigger>
              {post.author.id === localStorage.getItem("id") ? (
                <DropdownMenu variant="faded" aria-label="Dropdown menu with icons">
                  <DropdownItem
                    key="stored"
                    startContent={<FaRegBookmark />}
                  >
                    Lưu bài viết
                  </DropdownItem>
                  <DropdownItem
                    key="edit"
                    startContent={<MdEdit />}
                    onAction={onOpenUpdatePost}
                  >
                    Chỉnh sửa bài viết
                  </DropdownItem>
                  <DropdownItem
                    key="delete"
                    className="text-danger"
                    color="danger"
                    startContent={<MdDelete />}
                    onAction={onOpenDeletePost}
                  >
                    Xóa bài viết
                  </DropdownItem>
                </DropdownMenu>
              ) : (
                <DropdownMenu variant="faded" aria-label="Dropdown menu with icons">
                  <DropdownItem
                    key="stored"
                    startContent={<FaRegBookmark />}
                  >
                    Lưu bài viết
                  </DropdownItem>
                  <DropdownItem
                    key="report"
                    startContent={<IoWarningOutline />}
                  >
                    Báo xấu
                  </DropdownItem>
                </DropdownMenu>
              )}
            </Dropdown>
          </div>

          {/* Post Content */}
          <div>{post.content}</div>

          {/* Attachments */}
          {post.attachments.length > 0 && (
            <div className="flex flex-col">
              <Image src={`${post.attachments[0].attachment}`} alt="" className="w-full h-auto" />

              {/* Render thêm hình ảnh như hình vuông nhỏ bên dưới hình ảnh đầu tiên */}
              {post.attachments.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {post.attachments.length > 1 && (
                  <div className="relative">
                    <img
                      src={post.attachments[1].attachment}
                      alt=""
                      className="w-full h-40 object-cover rounded"
                    />
                  </div>
                )}

                {/* Hình ảnh thứ hai */}
                {post.attachments.length > 2 && (
                  <div className="relative">
                    <img
                      src={post.attachments[2].attachment}
                      alt=""
                      className="w-full h-40 object-cover rounded"
                    />
                  </div>
                )}

                {/* Hình ảnh thứ ba với số lượng hình ảnh còn lại */}
                {post.attachments.length > 3 && (
                  <div className="relative">
                    <img
                      src={post.attachments[3].attachment} // Hiển thị hình thứ 3
                      alt={`third-${2}`}
                      className="w-full h-40 object-cover rounded"
                    />
                    <span className="absolute w-full h-full flex justify-center items-center top-0 left-0 text-3xl font-bold text-white bg-black bg-opacity-50 p-1 rounded">
                      +{post.attachments.length - 4} {/* Số lượng hình ảnh còn lại */}
                    </span>
                  </div>
                )}
              </div>
            )}
            </div>
          )}

          {/* Like & Comment Section */}
          <div className="flex justify-between text-sm">
            <div>Lượt thích</div>
            <div>{post.comment.length} bình luận</div>
          </div>

          {/* Interactions */}
          <div className="flex flex-col gap-1">
            <hr className="border-gray-500" />
            <div className="flex flex-row w-full items-center">
              <LikeButton postId={post.id} emojiPost={emojiPost} setEmojiPost={setEmojiPost}/>
              <hr className="vertical-hr bg-gray-500" />
              <div
                className="flex flex-row items-center py-1 px-11 hover:bg-[#e5dfca] hover:text-[#102530] hover:rounded-md transition-all"
                onMouseDownCapture={onOpenPostPopup}
              >
                <FaRegCommentAlt />
                <span className="ml-2 select-none">Bình luận</span>
              </div>
              <hr className="vertical-hr bg-gray-500" />
              <div
                className="flex flex-row items-center py-1 px-11 hover:bg-[#e5dfca] hover:text-[#102530] hover:rounded-md transition-all"
                onMouseDownCapture={() => Share(post.id)}
              >
                <ShareModal isOpen={isOpenShare} onOpenChange={onOpenChangeShare} postId={post.id}/>
                <FaShareSquare />
                <span className="ml-2 select-none">Chia sẻ</span>
              </div>
            </div>

            {/* Comments and Post Popup */}
            <hr className="border-gray-500" />
            <div className="flex flex-row justify-start mt-2">
              <Avatar
                className="avatar-size select-none w-[40px] h-[40px]"
                name={localStorage.getItem("name") || undefined}
                src={localStorage.getItem("avatar") || undefined}
              />
              <div className="flex flex-col w-11/12">
                <CommentForm postId={post.id} />
              </div>
            </div>

            {/* Show comments popup if there are comments */}
            {post.comment.length > 0 && (
              <>
                <div className="flex justify-end">
                  <PostDetailPopup isOpen={isOpenPostPopup} onOpenChange={onOpenChangePostPopup} post={post} setEmojiPost={setEmojiPost} emojiPost={emojiPost}/>
                  <div onMouseDownCapture={onOpenPostPopup} className="text-sm select-none pt-2 px-2 hover:text-gray-300 cursor-pointer">
                    Xem tất cả bình luận
                  </div>
                </div>
                <div className="relative grid grid-cols-10 mt-2">
                  {/* Render first comment */}
                  <div className="col-span-1">
                    <Avatar
                      className="avatar-size select-none w-[40px] h-[40px]"
                      name={post.comment[0].author.name}
                      src={post.comment[0].author.avatar || undefined}
                    />
                  </div>
                  <div className="col-span-9 h-fit">
                    {post.comment[0].content ? (
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
                          <span className="text-sm">{post.comment[0].author.name}</span>
                          <p className="text-sm">{post.comment[0].content}</p>
                        </div>
                        <HiDotsHorizontal className="ml-2" />
                      </div>
                    ) : (
                      <div className="flex flex-row justify-start items-center max-w-full">
                        <span className="text-sm">{post.comment[0].author.name}</span>
                        <HiDotsHorizontal className="ml-2" />
                      </div>
                    )}
                    {post.comment[0].attachment && (
                      <img
                        src={post.comment[0].attachment}
                        alt={`CommentAttachment-${post.comment[0].id}`}
                        className="mt-1 max-w-full h-auto rounded-3xl"
                        style={{
                          maxHeight: "65%",
                          maxWidth: "65%"
                        }}
                      />
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default function IndexPage() {
  const {
    isOpen: isOpenCreatePost,
    onOpen: onOpenCreatePost,
    onOpenChange: onOpenChangeCreatePost,
  } = useDisclosure();
  const {
    isOpen: isOpenShare,
    onOpen: onOpenShare,
    onOpenChange: onOpenChangeShare,
  } = useDisclosure();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [showEmotions, setShowEmotions] = useState<{ [key: string]: boolean }>({}); // Trạng thái cho từng bài viết
  const hoverTimeoutRefs = useRef<{ [key: string]: number | null }>({}); // Timeout cho từng bài viết
  const closeTimeoutRefs = useRef<{ [key: string]: number | null }>({}); // Timeout đóng cho từng bài viết
  const [emojiPost, setEmojiPost] = useState<{ [key: string]: FeelingGUI | null }>({});
  
  const handleMouseEnterLike = (postId: string) => {
    // Khi chuột hover vào nút "Thích"
    hoverTimeoutRefs.current[postId] = window.setTimeout(() => {
      setShowEmotions((prev) => ({ ...prev, [postId]: true }));
    }, 1000); // 1 giây
  };
  const [sharePostId, setSharePostId] = useState<string>("");

  const handleMouseLeaveLike = (postId: string) => {
    // Khi chuột rời khỏi nút "Thích"
    if (hoverTimeoutRefs.current[postId]) {
      clearTimeout(hoverTimeoutRefs.current[postId]);
      hoverTimeoutRefs.current[postId] = null;
    }
    
    // Đóng thanh cảm xúc sau 3 giây
    closeTimeoutRefs.current[postId] = window.setTimeout(() => {
      setShowEmotions((prev) => ({ ...prev, [postId]: false }));
    }, 1000); // 3 giây
  };

  const handleMouseEnterEmoji = (postId: string) => {
    // Khi chuột hover vào thanh cảm xúc
    if (closeTimeoutRefs.current[postId]) {
      clearTimeout(closeTimeoutRefs.current[postId]);
      closeTimeoutRefs.current[postId] = null;
    }
  };

  const handleMouseLeaveEmoji = (postId: string) => {
    // Khi chuột rời khỏi thanh cảm xúc
    closeTimeoutRefs.current[postId] = window.setTimeout(() => {
      setShowEmotions((prev) => ({ ...prev, [postId]: false }));
    }, 3000); // 3 giây
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setSelectedEmoji(emojiData.emoji);
    console.log(emojiData.emoji);
    // Ẩn tất cả các thanh cảm xúc sau khi chọn emoji
    setShowEmotions({});
  };

  // Tạo một mảng refs để tham chiếu đến nhiều Textareas
  // const textareaRefs = useRef<(HTMLTextAreaElement | null)[]>([]);
  // const [textAreaComment, setTextAreaComment] = useState<{[key: string]: string | null}>({});
  // Hàm để lưu ref của mỗi Textarea
  // const setTextareaRef = (element: HTMLTextAreaElement | null, index: number) => {
  //   textareaRefs.current[index] = element;
  // };

  // const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: File | null }>({});
  // const [imagePreviews, setImagePreviews] = useState<{ [key: string]: string | null }>({});

  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, postId: string) => {
  //   const uploadFiles = Array.from(event.target.files as FileList);

  //   if (uploadFiles.length > 0) {
  //     const file = uploadFiles[0]; // Chỉ lấy tệp đầu tiên

  //     // Đọc tệp để xem trước hình ảnh
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       if (e.target?.result) {
  //           setImagePreviews(prev => ({
  //               ...prev,
  //               [postId]: e.target?.result as string // Lưu hình ảnh xem trước theo postId
  //           }));
  //       }
  //     };
  //     reader.readAsDataURL(file);
  //     console.log(postId);
  //     console.log(selectedFiles);
  //     console.log(imagePreviews);
  //     // Lưu file đã chọn theo postId
  //     setSelectedFiles(prev => ({
  //         ...prev,
  //         [postId]: file
  //     }));
  //   }
  // };


  // Hàm xử lý khi bấm vào nút "Bình luận"
  // const handleCommentClick = (index: number) => {
  //   const textarea = textareaRefs.current[index];
  //   if (textarea) {
  //     textarea.focus(); // Focus vào Textarea tương ứng nếu không phải là null
  //   }
  // };


  // Danh sách các emoji phản ứng cố định
  const reactionEmojis = ['1f44d','2764-fe0f','1f606','1f62e','1f622','1f621'];
  const reactionEmojisString = ['Thích','Yêu thích','Haha','Wow','Buồn','Phẫn nộ'];

  const calculateTimeDifference = (timePost: Date) => {
    const now = new Date();
    const getTime = new Date(timePost);
    const distance = now.getTime() - getTime.getTime();

    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    let hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let time = "";
    const month = [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ];

    if (distance >= 604800000) {
      return (time += `${getTime.getDate()} ${
        month[getTime.getMonth()]
      } ${getTime.getFullYear()}`);
    } else if (distance >= 86400000 && distance < 604800000) {
      return (time += days + " ngày trước");
    } else if (distance < 86400000 && distance >= 3600000) {
      return (time += hours + " giờ trước");
    } else if (distance < 3600000 && distance >= 60000) {
      return (time += minutes + " phút trước");
    } else {
      return (time += "Mới đây");
    }
  };

  const [posts, setPosts] = useState<Post[]>([]); // Mảng chứa bài viết
  const [isLoading, setIsLoading] = useState<boolean>(false); // Trạng thái đang tải
  const pageSize = 3; // Số lượng bài viết mỗi lần fetch
  const [onLoading, setOnLoading] = useState<boolean>(false);
  const lastPostIdRef = useRef<string | null>(null); // Sử dụng useRef để lưu lastPostId
  const hasMoreRef = useRef<boolean>(true); // Sử dụng useRef để lưu trạng thái hasMore
  const loadedPostsRef = useRef<Set<string>>(new Set()); // Lưu các ID bài viết đã tải

  // Fetch posts from API
  const fetchPosts = async (lastPostId: string | null) => {
    if (isLoading || !hasMoreRef.current || !localStorage.token) return; // Tránh nhiều yêu cầu cùng lúc
    setIsLoading(true);

    try {
      const result = await NEWSFEED({
        PageSize: pageSize,
        lastPostId: lastPostId || '',
        token: localStorage.token,
      });

      if (result.isSuccess && result.res != null) {
        const newPosts = result.res.data;

        // Lọc bỏ các bài viết đã tồn tại bằng cách kiểm tra ID trong loadedPostsRef
        const filteredPosts = newPosts.filter(
          (post) => !loadedPostsRef.current.has(post.id) // Sử dụng Set để kiểm tra nhanh
        );

        if (filteredPosts.length > 0) {
          // Cập nhật posts với các bài viết mới
          setPosts((prev) => [...prev, ...filteredPosts]);

          // Cập nhật lastPostId với bài viết cuối cùng
          lastPostIdRef.current = filteredPosts[filteredPosts.length - 1].id;

          // Thêm các ID bài viết mới vào loadedPostsRef
          filteredPosts.forEach((post) => loadedPostsRef.current.add(post.id));
          filteredPosts.forEach((post) => {
            var userFeeling = post.feeling.find(
              (x) => x.author.id === localStorage.getItem("id"),
            );
            var userReact: FeelingGUI | null = null;
            // Ensure userFeeling is not undefined
            if (userFeeling) {
              userReact = {
                typeReact: userFeeling.typeReact,
                name: reactionEmojisString[
                  reactionEmojis.indexOf(userFeeling?.typeReact)
                ],
              }
              setEmojiPost((prev) => ({
                ...prev,
                [post.id]: userReact || null, // Ensure value is either string or null
              }));
            }
          });
        }

        // Kiểm tra điều kiện ngừng tải thêm bài viết
        if (filteredPosts.length === 0 || newPosts.length < pageSize) {
          hasMoreRef.current = false; // Cập nhật hasMore bằng useRef
        }
      } else if (!result.isSuccess) {
        if(result.statusCode === 401) {
          Logout();
        } else {
          toast.custom((t) => (
            <div
              className={`${
                t.visible ? "animate-enter" : "animate-leave"
              } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
            >
              <div className="flex-1 w-0 p-4" style={{color: "#102530"}}>
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    {/* <img
                      className="h-10 w-10 rounded-full"
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixqx=6GHAjsWpt9&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
                      alt=""
                    /> */}
                    <FiXCircle />
                  </div>
                  <div className="ml-3 flex-1">
                    <p>Không thể kết nối đến máy chủ</p>
                  </div>
                </div>
              </div>
              <div className="flex border-l border-gray-200">
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Đóng
                </button>
              </div>
            </div>
          ))
        }
      } else {
        hasMoreRef.current = false; // Không còn bài viết để tải
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      hasMoreRef.current = false; // Xử lý lỗi khi fetch API thất bại
    } finally {
      setIsLoading(false); // Kết thúc trạng thái tải
    }
  };


  // Lazy load posts when scrolling
  const handleScroll = () => {
    // Check if scroll position is near the bottom of the page
    if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight) {
      if (!isLoading && hasMoreRef.current) {
        const lastPostId = lastPostIdRef.current; // Sử dụng lastPostId từ useRef
        fetchPosts(lastPostId); // Fetch bài viết mới dựa trên lastPostId
      }
    }
  };
  
  // async function callAPICreateComment(CommentReq: FormData, token: string, postId: string) {
  //   try {
  //     const response = await CREATECOMMENT({
  //       CommentReq: CommentReq,
  //       token: token,
  //     });

  //     if (response.isSuccess && 'data' in response.res!) {
  //       setOnLoading(false);

  //       // Sau khi đăng bình luận thành công, xóa nội dung của textarea
  //       // Xóa nội dung `textarea` sau khi thành công
  //       removeImage(postId); // Xóa hình ảnh tương ứng

  //       return response.res.data;
  //     } else if ("message" in response.res!) {
  //       const errorResponse = response.res as { message: string };
  //       setOnLoading(false);

  //       throw new Error(errorResponse.message);
  //     } else {
  //       setOnLoading(false);
  //       throw new Error("Không thể đăng bình luận!");
  //     }
  //   } catch (error: any) {
  //     setOnLoading(false);
  //     throw new Error(error.message || "Có lỗi xảy ra");
  //   }
  // }

  // const handleTest = async (id: string, index: number) => {
  //   const textareaValue = textareaRefs.current[index]?.value; // Lấy giá trị từ textarea
  
  //   const NewComment = new FormData();
  //   NewComment.append("PostId", id); // Thêm PostId vào FormData
  
  //   // Chỉ thêm nội dung nếu không null hoặc undefined
  //   if (textareaValue) {
  //     NewComment.append("Content", textareaValue);
  //   }
  
  //   // Chỉ thêm file đính kèm nếu nó tồn tại
  //   if (selectedFiles[id]) {
  //     NewComment.append("Attachment", selectedFiles[id] as Blob); // Đảm bảo kiểu của selectedFiles[id] là Blob
  //   }
  
  //   // Sử dụng toast.promise để xử lý phản hồi từ API
  //   toast.promise(callAPICreateComment(NewComment, localStorage.token), {
  //     loading: "Đang đăng bình luận...",
  //     success: <b>Đăng bình luận thành công!</b>,
  //     error: (err) => <b>{err.message || 'Có lỗi xảy ra khi đăng bình luận.'}</b>,
  //   });
  
    
  // };
  

  // const handleChangeContent = (value: string, index: number) => {
  //   if (textareaRefs.current[index]) {
  //     textareaRefs.current[index].value = value; // Cập nhật trực tiếp giá trị textarea
  //   }
  
  //   // Kiểm tra và cập nhật trạng thái sẵn sàng
  //   if (value.trim().length > 0) {
  //     setIsReady(true);
  //   } else {
  //     setIsReady(false);
  //   }
  // };

  useEffect(() => {
    // Fetch lần đầu khi component mount
    fetchPosts(null);

    // Set up scroll event listener for lazy loading
    window.addEventListener('scroll', handleScroll);

    // Clean up event listener when component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Chạy một lần khi component mount

  // const removeImage = (postId: string) => {
  //   // Xóa file đã chọn và hình ảnh xem trước
  //   setImagePreviews((prevPreviews) => {
  //     const updatedPreviews = { ...prevPreviews };
  //     delete updatedPreviews[postId];  // Xóa hình ảnh của postId tương ứng
  //     return updatedPreviews;  // Cập nhật lại trạng thái với ảnh đã bị xóa
  //   });
  
  //   setSelectedFiles((prevFiles) => {
  //     const updatedFiles = { ...prevFiles };
  //     delete updatedFiles[postId];  // Xóa file đã chọn của postId tương ứng
  //     return updatedFiles;  // Cập nhật lại trạng thái file đã chọn
  //   });
  // };

  return (
    <>
      {localStorage.getItem("token") == null ? (
        <DefaultLayout>
          <section style={{ backgroundColor: "#e5dfca" }}>
            <section
              className="pt-44 pl-20"
              id="#"
              style={{
                backgroundImage: "url('/background.svg')",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                minHeight: "105vh",
              }}
            >
              <div className="flex justify-between gap-x-96">
                <div className="font-literata font-bold sm:pr-96 sm:pl-10">
                  <div className="text-5xl">
                    <span style={{ color: "#102530" }}>Nền tảng xã hội cho</span>
                    <br />
                    <span style={{ color: "#ed5c02" }}>người yêu chó mèo</span>
                    <span style={{ color: "#102530" }}> tại Việt Nam</span>
                  </div>
                  <br />
                  <div className="mt-6">
                    <div className="flex">
                    <span
                        className="inline-block"
                        style={{
                          width: "50px",
                          height: "50px",
                          backgroundImage: "url('/dot-pet-foot.svg')",
                          backgroundSize: "contain",
                          backgroundRepeat: "no-repeat",
                        }}
                      />
                      <span className="text-xl" style={{ color: "#102530" }}>
                        Giao lưu, chia sẻ khoảnh khắc đáng yêu của thú cưng
                      </span>
                    </div>
                    <div className="flex">
                      <span
                        className="inline-block"
                        style={{
                          width: "50px",
                          height: "50px",
                          backgroundImage: "url('/dot-pet-foot.svg')",
                          backgroundSize: "contain",
                          backgroundRepeat: "no-repeat",
                        }}
                      />
                      <span className="text-xl" style={{ color: "#102530" }}>
                        Đặt hàng và dịch vụ chăm sóc
                      </span>
                    </div>
                    <div className="flex">
                      <span
                        className="inline-block"
                        style={{
                          width: "50px",
                          height: "50px",
                          backgroundImage: "url('/dot-pet-foot.svg')",
                          backgroundSize: "contain",
                          backgroundRepeat: "no-repeat",
                        }}
                      />
                      <span className="text-xl" style={{ color: "#102530" }}>
                        Tham gia các sự kiện lớn nhỏ
                      </span>
                    </div>
                  </div>
                  <Button
                    className="items-center"
                    as={Link}
                    size="lg"
                    style={{ backgroundColor: "#ed5c02", color: "FFF" }}
                    href="/authentication"
                  >
                    Tham gia ngay
                  </Button>
                </div>
                <div />
              </div>

              <div className="mt-8">
              </div>
            </section>
            <section
              className="gap-y-96"
              id="our-services"
              style={{
                backgroundColor: "#e5dfca",
              }}
            >
              <div className="gap-x-96 py-4 sm:py-10">
                <div className="font-literata font-bold sm:pr-96 sm:pl-32">
                  <div className="text-4xl">
                    <span style={{ color: "#102530" }}>Dịch vụ của chúng tôi</span>
                  </div>
                </div>
                <div className="flex justify-evenly mt-10">
                  {ourServices.map((cardIndex) => (
                    <Card
                      key={cardIndex.id}
                      className="max-w-[350px] min-w-[350px] pb-10"
                      style={{
                        backgroundColor:
                          hoveredCard === cardIndex.id ? "#ffdb59" : "#e5dfca",
                      }}
                      onMouseEnter={() => setHoveredCard(cardIndex.id)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      <CardHeader className="flex justify-center">
                        <img
                          alt="SVG Icon"
                          height={250}
                          src={cardIndex.iconPath}
                          width={250}
                        />
                      </CardHeader>
                      <CardBody className="px-5">
                        <div className="mt-5">
                          <div className="font-literata font-bold text-xl">
                            <span style={{ color: "#102530" }}>{cardIndex.name}</span>
                          </div>
                          <div className="font-literata">
                            <span style={{ color: "#102530" }}>
                              {cardIndex.description}
                            </span>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </div>
            </section>
          </section>
        </DefaultLayout>
      ) : (
        <NonFooterLayout>
          <Toaster
            position="bottom-left"
            reverseOrder={false}
          />
          <CreatePost
            isOpen={isOpenCreatePost}
            onOpenChange={onOpenChangeCreatePost}
            setPosts={setPosts}
          />
          <ShareModal isOpen={isOpenShare} onOpenChange={onOpenChangeShare} postId={sharePostId}/>
          {/* <section className="flex-1 bg-[#e5dfca]"> */}
            <div className="flex justify-center pt-5 pb-20">
              <div className="flex flex-col gap-4 w-[600px] h-full">
                <Card className="py-2">
                  <CardBody>
                    <div className="flex items-center justify-center">
                      <Avatar
                        className="avatar-size select-none" // Thêm class cho Avatar
                        name={
                          localStorage.getItem("avatar")
                            ? undefined
                            : localStorage.getItem("name") || undefined
                        }
                        src={localStorage.getItem("avatar") || undefined}
                      />
                    <Button
                      className="status-bar select-none"
                      onPress={onOpenCreatePost}
                      color="#e5dfca"
                    >
                        <span className="status-icon">😊</span>
                        <span className="status-text">
                          {localStorage.getItem("name")} ơi, bạn đang nghĩ gì
                          thế?
                        </span>
                      </Button>
                    </div>
                  </CardBody>
                </Card>
                {posts.map((post: Post, index: number) => (
                  <PostCard key={post.id} post={post} emojiPost={emojiPost} setEmojiPost={setEmojiPost} setPosts={setPosts}/>
                ))}
                {isLoading ? (
                  <div className="flex justify-center">
                    <ThreeDot color="#102530" size="medium" text="" textColor="" />
                  </div>
                ) : null}
                {!hasMoreRef.current ? (
                   <div className="flex justify-center text-[#102530]">
                      Không còn nội dung nào
                  </div>
                ) : null}
                {/* <Card>
                  <CardBody>
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between">
                        <div className="flex items-start justify-start">
                          <Avatar
                            className="avatar-size"  // Thêm class cho Avatar
                            name={
                              localStorage.getItem("avatar")
                                ? undefined
                                : localStorage.getItem("name") || undefined
                            }
                            src={localStorage.getItem("avatar") || undefined}
                          />
                          <div className="flex flex-col">
                            <span className="ml-2">Name</span>
                            <span className="ml-2 text-xs text-gray-400">
                              CreatedAt
                            </span>
                          </div>
                        </div>
                        <TbDotsVertical />
                      </div>
                      <div className="">Nội dung ở đây</div>
                      <img src="dog-cat-sit.jpg" alt="" />
                      <hr />
                      <div className="flex flex-row w-full">
                        <div className="flex flex-row items-center px-12">
                          <AiOutlineLike />
                          <span className="ml-2 select-none">Thích</span>
                        </div>
                        <hr />
                        <hr className="vertical-hr bg-gray-50" />
                        <div className="flex flex-row items-center px-12">
                          <FaRegCommentAlt />
                          <span className="ml-2 select-none">Bình luận</span>
                        </div>
                        <hr />
                        <hr className="vertical-hr bg-gray-50" />
                        <div className="flex flex-row items-center px-12">
                          <FaShareSquare />
                          <span className="ml-2 select-none">Chia sẻ</span>
                        </div>
                        <hr />
                      </div>
                    </div>
                  </CardBody>
                </Card> */}
              </div>
            </div>
          {/* </section> */}
        </NonFooterLayout>
      )}
    </>
  );
}
