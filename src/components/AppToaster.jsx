import { Toaster } from "react-hot-toast";

const AppToaster = () => {
    return (
        <Toaster
            position="top-center"
            reverseOrder={false}
            gutter={10}
            containerStyle={{
                top: 84,
            }}
        />
    );
};

export default AppToaster;
