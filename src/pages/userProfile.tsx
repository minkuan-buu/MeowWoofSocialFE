import { Button } from "@nextui-org/button";
import {
  Avatar,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Modal,
  Skeleton,
  useDisclosure,
} from "@nextui-org/react";
import { Link } from "@nextui-org/link";

import { GETUSERPOST } from "@/api/Post";
import { GETUSER } from "@/api/User";
import { CommentForm } from "@/components/comment";
import { calculateTimeDifference } from "@/components/func/postFunc";
import { LikeButton, LikeButtonUserProfile } from "@/components/likeButton";
import Logout from "@/components/logout";
import { DeletePost, PostDetailPopup, UpdatePost } from "@/components/post";
import { ShareModal } from "@/components/share";
import { FeelingGUI } from "@/interface/feeling";
import { Post } from "@/interface/post";
import { UserBasicModel, UserProfilePage } from "@/interface/user";
import NonFooterLayout from "@/layouts/non-footer";

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaRegBookmark, FaRegCommentAlt, FaShareSquare } from "react-icons/fa";
import { FiXCircle } from "react-icons/fi";
import { HiDotsHorizontal, HiOutlineMail } from "react-icons/hi";
import { IoTimeOutline, IoWarningOutline } from "react-icons/io5";
import { MdDelete, MdEdit } from "react-icons/md";
import { ThreeDot } from "react-loading-indicators";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { ModalBasicUser } from "@/components/ModalUser";
import { se } from "date-fns/locale";

const PostCard: React.FC<{ post: Post, emojiPost: {[key: string]: FeelingGUI | null}, setEmojiPost: Dispatch<SetStateAction<{
  [key: string]: FeelingGUI | null;
}>>, setPosts: Dispatch<SetStateAction<Post[]>> }> = ({ post, emojiPost, setEmojiPost, setPosts }) => {
  const [showInfomations, setShowInfomations] = useState<{ [key: string]: boolean }>({}); // Trạng thái cho từng bài viết
  const hoverTimeoutRefs = useRef<{ [key: string]: number | null }>({}); // Timeout cho từng bài viết
  const closeTimeoutRefs = useRef<{ [key: string]: number | null }>({}); // Timeout đóng cho từng bài viết
  const { isOpen: isOpenPostPopup, onOpen: onOpenPostPopup, onOpenChange: onOpenChangePostPopup } = useDisclosure();

  const handleMouseEnterName = (postId: string) => {
    // Khi chuột hover vào nút "Thích"
    hoverTimeoutRefs.current[postId] = window.setTimeout(() => {
      setShowInfomations((prev) => ({ ...prev, [postId]: true }));
    }, 500); // 1 giây
  };

  const handleMouseLeaveName = (postId: string) => {
    // Khi chuột rời khỏi nút "Thích"
    if (hoverTimeoutRefs.current[postId]) {
      clearTimeout(hoverTimeoutRefs.current[postId]);
      hoverTimeoutRefs.current[postId] = null;
    }

    // Đóng thanh cảm xúc sau 3 giây
    closeTimeoutRefs.current[postId] = window.setTimeout(() => {
      setShowInfomations((prev) => ({ ...prev, [postId]: false }));
    }, 1000); // 3 giây
  };

  const handleMouseEnterInformation = (postId: string) => {
    // Khi chuột hover vào thanh cảm xúc
    if (closeTimeoutRefs.current[postId]) {
      clearTimeout(closeTimeoutRefs.current[postId]);
      closeTimeoutRefs.current[postId] = null;
    }
  };

  const handleMouseLeaveInformation = (postId: string) => {
    // Khi chuột rời khỏi thanh cảm xúc
    closeTimeoutRefs.current[postId] = window.setTimeout(() => {
      setShowInfomations((prev) => ({ ...prev, [postId]: false }));
    }, 100); // 3 giây
  };
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
  const redirectImageView = (postId: string, attachmentId: string) => {
    window.location.href = `/post/${postId}/attachment/${attachmentId}`;
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
                <div className="relative">
                  <div
                    className="ml-2 cursor-pointer"
                    onMouseEnter={() => handleMouseEnterName(post.id)}
                    onMouseLeave={() => handleMouseLeaveName(post.id)}
                  >
                    {post.author.name}
                  </div>
                  {/* Bản chọn cảm xúc */}
                  {showInfomations[post.id] && (
                    <div
                      className={`absolute min-w-[300px] border-[#e5dfca] border-1 rounded-xl transition-opacity duration-700 ease-in-out ${showInfomations[post.id] ? "translate-x-0 opacity-100" : "translate-x-0 opacity-0"}`}
                      style={{ zIndex: 999 }}
                      onMouseEnter={() => handleMouseEnterInformation(post.id)}
                      onMouseLeave={() => handleMouseLeaveInformation(post.id)}
                    >
                      <Card>
                        <CardBody>
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <Avatar
                                className="w-20 h-20 text-large"
                                name={post.author.name}
                                size="lg"
                                src={post.author.avatar || undefined}
                              />
                              <div className="flex flex-col items-center">
                                <div>{post.author.name}</div>
                              </div>
                            </div>
                            <Divider />
                            <Button color="primary" as={Link} href={`/user/${post.author.id}`}>
                              Xem trang cá nhân
                            </Button>
                            <div className="flex flex-col gap-2">
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </div>
                  )}
                </div>
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
              <Image src={`${post.attachments[0].attachment}`} alt="" className="w-full h-auto cursor-pointer" onMouseDownCapture={() => redirectImageView(post.id, post.attachments[0].id)}/>

              {/* Render thêm hình ảnh như hình vuông nhỏ bên dưới hình ảnh đầu tiên */}
              {post.attachments.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {post.attachments.length > 1 && (
                  <div className="relative cursor-pointer" onMouseDownCapture={() => redirectImageView(post.id, post.attachments[1].id)}>
                    <img
                      src={post.attachments[1].attachment}
                      alt=""
                      className="w-full h-40 object-cover rounded"
                    />
                  </div>
                )}

                {/* Hình ảnh thứ hai */}
                {post.attachments.length > 2 && (
                  <div className="relative cursor-pointer" onMouseDownCapture={() => redirectImageView(post.id, post.attachments[2].id)}>
                    <img
                      src={post.attachments[2].attachment}
                      alt=""
                      className="w-full h-40 object-cover rounded"
                    />
                  </div>
                )}

                {/* Hình ảnh thứ ba với số lượng hình ảnh còn lại */}
                {post.attachments.length > 3 && (
                  <div className="relative cursor-pointer" onMouseDownCapture={() => redirectImageView(post.id, post.attachments[3].id)}>
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
              <LikeButtonUserProfile postId={post.id} emojiPost={emojiPost} setEmojiPost={setEmojiPost}/>
              <hr className="vertical-hr bg-gray-500" />
              <div
                className="flex flex-row items-center py-1 px-14 hover:bg-[#e5dfca] hover:text-[#102530] hover:rounded-md transition-all"
                onMouseDownCapture={onOpenPostPopup}
              >
                <FaRegCommentAlt />
                <span className="ml-2 select-none">Bình luận</span>
              </div>
              <hr className="vertical-hr bg-gray-500" />
              <div
                className="flex flex-row items-center py-1 px-14 hover:bg-[#e5dfca] hover:text-[#102530] hover:rounded-md transition-all"
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

export default function UserInfo() {
  const [posts, setPosts] = useState<Post[]>([]); // Mảng chứa bài viết
  const [isLoading, setIsLoading] = useState<boolean>(false); // Trạng thái đang tải
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(false); // Trạng thái đang tải
  const pageSize = 3; // Số lượng bài viết mỗi lần fetch
  const lastPostIdRef = useRef<string | null>(null); // Sử dụng useRef để lưu lastPostId
  const hasMoreRef = useRef<boolean>(true); // Sử dụng useRef để lưu trạng thái hasMore
  const loadedPostsRef = useRef<Set<string>>(new Set()); // Lưu các ID bài viết đã tải
  const { userId } = useParams(); // Lấy userId từ URL
  // Danh sách các emoji phản ứng cố định
  const reactionEmojis = ['1f44d','2764-fe0f','1f606','1f62e','1f622','1f621'];
  const reactionEmojisString = ['Thích','Yêu thích','Haha','Wow','Buồn','Phẫn nộ'];
  const [emojiPost, setEmojiPost] = useState<{ [key: string]: FeelingGUI | null }>({});
  const [currentUser, setCurrentUser] = useState<UserProfilePage>();
  const {isOpen: isOpenModelUser, onOpen: onOpenModelUser, onOpenChange: onOpenChangeModelUser} = useDisclosure();
  const [followUserList, setFollowUserList] = useState<UserBasicModel[]>([]);
  const [Header, setHeader] = useState<string>("");

  // Fetch posts from API
  const fetchPosts = async (lastPostId: string | null) => {
    if (isLoading || !hasMoreRef.current || !localStorage.token) return; // Tránh nhiều yêu cầu cùng lúc
    setIsLoading(true);

    if (userId == null) {
      window.location.href = "/";
      return;
    }

    try {
      const result = await GETUSERPOST({
        userId: userId,
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

  const fetchProfile = async () => {
    if (isLoadingProfile || !localStorage.token) return; // Tránh nhiều yêu cầu cùng lúc
    setIsLoadingProfile(true);
    if (userId == null) {
      window.location.href = "/";

      return;
    }
    try {
      const result = await GETUSER({
        userId: userId,
        token: localStorage.token,
      });

      if (result.isSuccess && result.res != null) {
        const profile = result.res.data;

        setCurrentUser(profile);
      } else if (!result.isSuccess) {
        if (result.statusCode === 401) {
          Logout();
        } else {
          toast.custom((t) => (
            <div
              className={`${
                t.visible ? "animate-enter" : "animate-leave"
              } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
            >
              <div className="flex-1 w-0 p-4" style={{ color: "#102530" }}>
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
      } 
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoadingProfile(false); // Kết thúc trạng thái tải
    }
  };

  // Lazy load posts when scrolling
  const handleScroll = () => {
    // Check if scroll position is near the bottom of the page
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight
    ) {
      if (!isLoading && hasMoreRef.current) {
        const lastPostId = lastPostIdRef.current; // Sử dụng lastPostId từ useRef

        fetchPosts(lastPostId); // Fetch bài viết mới dựa trên lastPostId
      }
    }
  };

  const formatDate = (date: Date): string => {
    var getDate = format(date, 'dd/MM, yyyy');
    var displayDate = getDate.replace('/', ' tháng ');
    return displayDate;
  };

  useEffect(() => {
    // Fetch lần đầu khi component mount
    setPosts([]);
    hasMoreRef.current = true;
    loadedPostsRef.current = new Set();
    loadedPostsRef.current.clear();
    lastPostIdRef.current = null;
    setEmojiPost({});
    setIsLoading(true);
    setIsLoadingProfile(true);
    fetchProfile();
    fetchPosts(null);
    // Set up scroll event listener for lazy loading
    window.addEventListener('scroll', handleScroll);

    // Clean up event listener when component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [userId]);

  function handleFollowing() {
    var followingUserList: UserBasicModel[] = [];

    currentUser?.following.forEach((following) => {
      followingUserList.push({
        id: following.id,
        name: following.name,
        avatar: following.avatar,
        isFollow: following.isFollow,
      });
    });
    setHeader("Đang theo dõi");
    setFollowUserList(followingUserList);
    onOpenModelUser();
  }

  function handleFollower() {
    var followerUserList: UserBasicModel[] = [];

    currentUser?.follower.forEach((follower) => {
      followerUserList.push({
        id: follower.id,
        name: follower.name,
        avatar: follower.avatar,
        isFollow: follower.isFollow,
      });
    });
    setHeader("Người theo dõi");
    setFollowUserList(followerUserList);
    onOpenModelUser();
  }

  return (
    <NonFooterLayout>
      <div className="flex justify-center pt-5 pb-20">
        <div className="flex flex-col gap-4 max-w-[1150px] h-full">
          <Card className="py-2 w-[1150px]">
            <CardBody>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-5">
                  <Skeleton
                    className="flex rounded-full w-36 h-36"
                    isLoaded={!isLoadingProfile}
                  >
                    {currentUser && (
                      <>
                        <Avatar
                          className="w-36 h-36 text-large"
                          name={currentUser.name}
                          size="lg"
                          src={currentUser.avatar || undefined}
                        />
                      </>
                    )}
                  </Skeleton>
                  <div className="flex flex-col gap-2">
                    <Skeleton isLoaded={!isLoadingProfile} className="w-4/5 rounded-lg">
                      <div className="text-2xl">{currentUser && currentUser.name}</div>
                    </Skeleton>
                    <div className="text-sm min-w-[300px]">
                      <Skeleton isLoaded={!isLoadingProfile} className="rounded-lg">
                        {!isLoadingProfile && currentUser ? (
                          <>
                            <ModalBasicUser isOpen={isOpenModelUser} onOpenChange={onOpenChangeModelUser} ListUser={followUserList} Header={Header}/>
                            <div
                              className="cursor-pointer inline-block hover:text-gray-400"
                              onMouseDownCapture={() => handleFollowing()}
                            >
                              {`${currentUser?.following.length} Đang theo dõi`}
                            </div>
                            <span className="px-1 inline-block"> • </span>
                            <div
                              className="cursor-pointer inline-block hover:text-gray-400"
                              onMouseDownCapture={() => handleFollower()}
                            >
                              {`${currentUser?.follower.length} Người theo dõi`}
                            </div>
                          </>
                        ) : null}
                      </Skeleton>
                    </div>
                  </div>
                </div>
                {currentUser?.id === localStorage.getItem("id") ? (
                  <>
                    <Button disabled={isLoadingProfile} startContent={<MdEdit />}>Chỉnh sửa thông tin</Button>
                  </>
                ) : (
                  <>
                    {currentUser?.isFollow ? (
                      <Button disabled={isLoadingProfile}>Bỏ theo dõi</Button>
                    ) : (
                      <Button color="primary" disabled={isLoadingProfile}>Theo dõi</Button>
                    )}
                  </>
                )}
              </div>
            </CardBody>
          </Card>
          <div className="flex flex-row gap-4">
            {/* Thẻ Card sticky */}
            <Card className="sticky top-20 py-4 w-[450px] max-h-fit">
              <CardHeader className="flex justify-center">
                <strong>Thông tin liên hệ</strong>
              </CardHeader>
              <CardBody>
                <div className="flex flex-col gap-4 text-sm">
                  <div className="flex items-center gap-5">
                    <Skeleton isLoaded={!isLoadingProfile} className="rounded-lg">
                      {currentUser && (
                        <div className="flex flex-row items-center gap-2">
                          <HiOutlineMail size={28} />
                          <Link className="text-white" href={`mailto:${currentUser.email}`}>
                            {currentUser.email}
                          </Link>
                        </div>
                      )}
                    </Skeleton>
                  </div>
                  <div className="flex items-center gap-5">
                    <Skeleton isLoaded={!isLoadingProfile} className="rounded-lg">
                      {currentUser && (
                        <div className="flex flex-row items-center gap-2">
                          <IoTimeOutline size={28} />
                          <span className="text-white">
                            Thành viên của <strong>MeowWoof Social</strong> từ ngày {currentUser && formatDate(currentUser.createdAt)}
                          </span>
                        </div>
                      )}
                    </Skeleton>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Phần nội dung chính cuộn tự do */}
            <div className="flex flex-col gap-4 w-[685px] h-full">
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
            </div>
          </div>
        </div>
      </div>
    </NonFooterLayout>
  );
}
