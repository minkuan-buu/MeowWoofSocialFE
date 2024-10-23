import { UserBasicModel } from "@/interface/user";
import { Button } from "@nextui-org/button";
import { Avatar, Divider, Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";

interface ModalBasicUserProps {
  ListUser: UserBasicModel[];
  Header: string;
  isOpen: boolean;
  onOpenChange: () => void;
}

export const ModalBasicUser: React.FC<ModalBasicUserProps> = ({
  ListUser,
  Header,
  isOpen,
  onOpenChange,
}) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex justify-center">
              <span>{Header}</span>
            </ModalHeader>
            <ModalBody className="overflow-y-auto max-h-[80vh] pb-9"> {/* Thêm max-height để đảm bảo modal không chiếm hết không gian */}
              {ListUser.length === 0 && (
                <div className="flex justify-center"><i>Chưa có thông tin</i></div>
              )}
              {ListUser.map((user) => (
                <>
                  <div key={user.id} className="flex justify-between items-center gap-4">
                    <div className="flex flex-row items-center gap-4">
                      <Avatar
                        className="w-14 h-14 text-large"
                        name={user.name}
                        size="lg"
                        src={user.avatar || undefined}
                      />
                      <span>{user.name}</span>
                    </div>
                    <Button>Theo dõi</Button>
                  </div>
                </>
              ))}
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}