import { Modal, ModalProps } from "antd";

interface ModalPropsCustom extends ModalProps {
    isVisible: boolean;
    title: string;
    children: React.ReactNode;
    setIsVisible: (isVisible: boolean) => void;
}

const ModalWrapped = (props: ModalPropsCustom) => {
    return (
        <Modal
            width={{
                xs: "100%",
                sm: "100%",
                md: "100%",
                lg: "100%",
                xl: "1200px",
                xxl: "1200px"
            }}
            {...props}
            centered
            open={props.isVisible}
            footer={null}
            closable={false}
            onCancel={() => props.setIsVisible(false)}
        >
            {props.children}
        </Modal>
    );
};

export default ModalWrapped;
