import { Modal } from "antd";

type ModalProps = {
    isVisible: boolean;
    confirmLoading: boolean;
    title: string;
    description: string;
    setConfirmLoading: (confirmLoading: boolean) => void;
    handleOk: () => void;
    handleCancel: () => void;
};

const ModalConfirm = (props: ModalProps) => {
    return (
        <Modal
            title={props.title}
            loading={props.confirmLoading ?? false}
            centered
            open={props.isVisible}
            onOk={props.handleOk}
            onCancel={props.handleCancel}
        >
            <p style={{ padding: "0 16px" }}>{props.description}</p>
        </Modal>
    );
};

export default ModalConfirm;
