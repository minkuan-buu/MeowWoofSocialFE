import { FeelingGUI } from "@/interface/feeling";
import EmojiPicker, { Emoji, EmojiClickData, EmojiStyle } from "emoji-picker-react";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { AiOutlineLike } from "react-icons/ai";

interface LikeButtonProps {
    postId: string;
    emojiPost: {[key: string]: FeelingGUI | null};
    setEmojiPost: Dispatch<SetStateAction<{
        [key: string]: FeelingGUI | null;
    }>>
}

export const LikeButton: React.FC<LikeButtonProps> = ({
    postId,
    emojiPost,
    setEmojiPost
}) => {
    const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
    const [showEmotions, setShowEmotions] = useState<{ [key: string]: boolean }>({}); // Trạng thái cho từng bài viết
    const hoverTimeoutRefs = useRef<{ [key: string]: number | null }>({}); // Timeout cho từng bài viết
    const closeTimeoutRefs = useRef<{ [key: string]: number | null }>({}); // Timeout đóng cho từng bài viết
    const reactionEmojis = ['1f44d','2764-fe0f','1f606','1f62e','1f622','1f621'];
    const reactionEmojisString = ['Thích','Yêu thích','Haha','Wow','Buồn','Phẫn nộ'];
    
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

    const onEmojiClick = (postId: string, emojiData: EmojiClickData) => {
        setSelectedEmoji(emojiData.emoji);
        console.log(`${postId}: ${emojiData.emoji}`);
        // Ẩn tất cả các thanh cảm xúc sau khi chọn emoji
        // Ensure userFeeling is not undefined
        if(emojiPost[postId] != null){
            
        }
        var userReact: FeelingGUI = {
            typeReact: emojiData.unified,
            name: reactionEmojisString[
              reactionEmojis.indexOf(emojiData.unified)
            ],
        }
        setEmojiPost((prev) => ({
            ...prev,
            [postId]: userReact, // Ensure value is either string or null
        }));
        setShowEmotions({});
    };

    useEffect(() => {
        console.log(emojiPost)
    }, [])
    return(
        <>
            <div className="relative">
                <div
                    className={`flex flex-row items-center py-1 ${emojiPost[postId] ? emojiPost[postId].name.split(" ").length > 1 ? "px-10" : "px-11" : "px-12"} hover:bg-[#e5dfca] hover:text-[#102530] hover:rounded-md transition-all hover-div`}
                    onMouseEnter={() => handleMouseEnterLike(postId)}
                    onMouseLeave={() => handleMouseLeaveLike(postId)}
                >
                    {emojiPost[postId] ? (
                        <>
                            <Emoji unified={emojiPost[postId].typeReact} size={20} />
                            <span className="ml-2 select-none">{emojiPost[postId].name}</span>
                        </>
                    ) : ( 
                        <>
                            <AiOutlineLike />
                            <span className="ml-2 select-none">Thích</span>
                        </>
                    )}
                   
                </div>

                {/* Bản chọn cảm xúc */}
                {showEmotions[postId] && (
                    <div
                        className="absolute bottom-full translate-x-[-50%] mb-2 shadow-lg"
                        onMouseEnter={() => handleMouseEnterEmoji(postId)}
                        onMouseLeave={() => handleMouseLeaveEmoji(postId)}
                        style={{
                            opacity: showEmotions[postId] ? 1 : 0,
                            transform: showEmotions[postId] ? 'translateY(0)' : 'translateY(10px)',
                            transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
                        }}
                    >
                    <EmojiPicker
                        open={showEmotions[postId]}
                        lazyLoadEmojis
                        reactions={reactionEmojis}
                        reactionsDefaultOpen={true}
                        onReactionClick={(e) => onEmojiClick(postId, e)}
                        allowExpandReactions={false}
                        searchDisabled={true}
                        skinTonesDisabled={true}
                        emojiStyle={EmojiStyle.FACEBOOK}
                    />
                    </div>
                )}
                </div>
        </>
    );
}