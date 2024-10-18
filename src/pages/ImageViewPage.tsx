import { GETPOST } from "@/api/Post";
import { CommentForm } from "@/components/comment";
import { calculateTimeDifference } from "@/components/func/postFunc";
import { ImageView } from "@/components/imageView";
import { LikeButton, LikeButtonImageView } from "@/components/likeButton";
import Logout from "@/components/logout";
import { DeletePost, UpdatePost } from "@/components/post";
import { title } from "@/components/primitives";
import { ShareModal } from "@/components/share";
import { FeelingGUI } from "@/interface/feeling";
import { Post, PostAttachment } from "@/interface/post";
import NonFooterImageViewLayout from "@/layouts/imageViewLayout";
import { Button } from "@nextui-org/button";
import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, ScrollShadow, useDisclosure } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { FaRegBookmark, FaRegCommentAlt, FaShareSquare } from "react-icons/fa";
import { HiDotsHorizontal } from "react-icons/hi";
import { IoWarningOutline } from "react-icons/io5";
import { MdDelete, MdEdit } from "react-icons/md";
import { useParams } from "react-router-dom";


export const ImageViewPage = () => {
  const { postId, attachmentId } = useParams();
  const [currentPost, setCurrentPost] = useState<Post>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
  const [emojiPost, setEmojiPost] = useState<{ [key: string]: FeelingGUI | null }>({});
  const [sharePostId, setSharePostId] = useState<string>("");
  const Share = (postId: string) => {
    setSharePostId(postId);
    onOpenShare();
  }
  const reactionEmojis = ['1f44d','2764-fe0f','1f606','1f62e','1f622','1f621'];
  const reactionEmojisString = ['Thích','Yêu thích','Haha','Wow','Buồn','Phẫn nộ'];

  useEffect(() => {
    if (isLoading || !localStorage.token || currentPost) return;
    setIsLoading(true);

    const getPost = async () => {

      if (!postId || !attachmentId) {
        window.location.href = "/";
        return;
      }

      try {
        const postResult = await GETPOST({ postId: postId, token: localStorage.token });

        if (!postResult.isSuccess && postResult.statusCode === 401) {
          Logout();
        } else {
          const newPost = postResult.res?.data;
          if (newPost && newPost.attachments.length > 0) {
            setCurrentPost(newPost);
            var userFeeling = newPost.feeling.find(
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
                [newPost.id]: userReact || null, // Ensure value is either string or null
              }));
            }
          } else if(newPost) {
            window.location.href = `/post/${newPost.id}`;
          } else if(!newPost) {
            window.location.href = "/";
          }
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getPost();
  }, [postId, currentPost]);

  if (isLoading) {
    return <div>Loading...</div>; // or use a spinner
  }

  // Nếu không có attachmentId, truyền null để ImageView hiểu là hình đầu tiên
  const selectedImageId = attachmentId || null;

  return (
    <NonFooterImageViewLayout>
      {!isLoading && currentPost && (
        <section className="relative grid grid-cols-12 overflow-hidden">
          <div className="col-span-9 h-[93vh]">
            <ImageView images={currentPost?.attachments}/>
          </div>
          <div className="col-span-3 h-[93vh] bg-[#31363F] px-4 pt-4 ">
            <div className="flex flex-col gap-4">
              {/* Post Author & Time */}
              <div className="flex justify-between">
                <div className="flex items-start justify-start">
                  <Avatar
                    className="avatar-size"
                    name={currentPost?.author.name}
                    src={currentPost?.author.avatar || undefined}
                  />
                  <div className="flex flex-col">
                    <span className="ml-2">{currentPost?.author.name}</span>
                    <span className="ml-2 text-xs text-gray-400">
                      {/* Replace this with your time calculation */}
                      {currentPost?.createAt && calculateTimeDifference(currentPost?.createAt)}
                    </span>
                  </div>
                </div>
                {/* <UpdatePost isOpen={isOpenUpdatePost} onOpenChange={onOpenChangeUpdatePost} setPosts={setPosts} currentPost={post}/>
                <DeletePost isOpen={isOpenDeletePost} onOpenChange={onOpenChangeDeletePost} currentPost={post} setPosts={setPosts}/> */}
                <Dropdown>
                  <DropdownTrigger>
                  <Button className="!w-10 !h-10 !min-w-0 !p-0 bg-transparent hover:bg-gray-400 !rounded-full transition-all duration-300 flex items-center justify-center">
                    <HiDotsHorizontal style={{ width: "15px", height: "15px" }} />
                  </Button>
                  </DropdownTrigger>
                  {currentPost?.author.id === localStorage.getItem("id") ? (
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
              <div>{currentPost?.content}</div>

              {/* Like & Comment Section */}
              <div className="flex justify-between text-sm">
                <div>Lượt thích</div>
                <div>{currentPost?.comment.length} bình luận</div>
              </div>

              {/* Interactions */}
              <div className="flex flex-col gap-1">
                <hr className="border-gray-500" />
                <div className="flex flex-row w-full items-center">
                  <LikeButtonImageView postId={currentPost.id} emojiPost={emojiPost} setEmojiPost={setEmojiPost}/>
                  <hr className="vertical-hr bg-gray-500" />
                  <div
                    className="flex flex-row items-center py-1 px-6 hover:bg-[#e5dfca] hover:text-[#102530] hover:rounded-md transition-all"
                  >
                    <FaRegCommentAlt />
                    <span className="ml-2 select-none">Bình luận</span>
                  </div>
                  <hr className="vertical-hr bg-gray-500" />
                  <div
                    className="flex flex-row items-center py-1 px-6 hover:bg-[#e5dfca] hover:text-[#102530] hover:rounded-md transition-all"
                    onMouseDownCapture={() => Share(currentPost?.id)}
                  >
                    <ShareModal isOpen={isOpenShare} onOpenChange={onOpenChangeShare} postId={currentPost.id}/>
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
                    <CommentForm postId={currentPost?.id} />
                  </div>
                </div>

                {currentPost?.comment && (
                  <ScrollShadow hideScrollBar className="w-full h-[625px]">
                    {currentPost?.comment.map((comment) => (
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
                  </ScrollShadow>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </NonFooterImageViewLayout>
  );
};

